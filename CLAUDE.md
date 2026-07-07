# Lucis CMS - Claude Code instructions

## Project

Headless CMS for [Lucis](https://lucis.life), built on Strapi v5 (JavaScript, not TypeScript).
Single production instance, deployed via Strapi Cloud. There is no separate staging Strapi —
`main` deploys straight to [cms.lucis.life/admin](https://cms.lucis.life/admin) on merge.

Running `npm run develop` locally boots a **local SQLite instance with Strapi's demo seed data**
(`data/data.json`, `scripts/seed.js`) — it is not connected to real Lucis content. Use it only to
sanity-check that schema changes boot cleanly, never to preview real content.

## Stack

- Runtime: Node `>=20 <=26`, npm
- Framework: Strapi v5.50, plain JavaScript (`jsconfig.json`, no TypeScript, no ESLint, no Husky)
- Database: SQLite (`better-sqlite3`) locally; Strapi Cloud manages production storage
- i18n: Strapi's built-in internationalization plugin (`en` + `fr` locales on every localized field)

## Git

- Reference branch: `main`
- Branch naming: `<type>/<short-desc>` (`feat/`, `fix/`, `chore/`) for engineering work;
  `gtm/<short-desc>` for changes originating from the `gtm-studio` skill in lucis-website —
  the prefix tells a reviewer the change was AI/GTM-drafted and needs a full schema review.
- No pre-commit hooks configured. Before opening a PR: run `npm run develop` once locally and
  confirm Strapi boots without schema errors, then stop the server (don't commit `.tmp/` or the
  local `.db` file — already gitignored).
- **Never merge your own PR.** Schema changes deploy to production Strapi immediately on merge
  to `main` — always get a technical reviewer.

## Content types

| Content Type | draftAndPublish | Notes |
|---|---|---|
| `article` | ✅ yes | Blog posts. Author + category relations. Only content type with a webhook-driven revalidation on the website (`entry.publish`/`update`/`unpublish`). |
| `dynamic-page` | ✅ yes | Flexible `/lp/[slug]` pages built from `dynamic-lp` blocks. |
| `influencer` | ✅ yes | Landing pages with discount codes. Website has no draft-preview route for it — only published entries render. |
| `persona-page` | ✅ yes | Schema exists (slug, navTitle, navSubtitle, `dynamic-lp` sections) but **the website does not consume it yet** — no service/action/type/route. The live `/for/[persona]` pages are still fully hardcoded in lucis-website. Wiring this up is exactly the kind of gap the "migrate a hardcoded section" workflow exists to close. |
| `about`, `author`, `biomarker-card`, `category`, `faq`, `global`, `how-app-works-card`, `problem`, `testimonial-card`, `website-banner`, `why-section` | ❌ no | **No draft state.** Any create/update/delete via the API or MCP takes effect on the live site immediately. Treat writes to these as production changes, not staged drafts. |

## The `dynamic-lp` component group

`src/components/dynamic-lp/*.json` are Strapi **components** (not content types) — reusable
content blocks assembled into a `dynamiczone` field. Today exactly two content types use this
zone: `dynamic-page` (field `Sections`) and `persona-page` (field `sections`). Both list the same
family of components in their schema's `components` array.

The website renders each block via a `switch` on `__component` in
`lucis-website/src/app/[lang]/components/organisms/common/dynamic-lp-section-renderer.tsx`.
**A component existing here does not guarantee the website renders it** — `dynamic-lp.pricing-section`
and `dynamic-lp.persona-hero-section` are both valid zone members with no case in that switch today,
so adding either in the CMS currently renders nothing on the page. Always cross-check the renderer
before telling an editor a block is usable.

### Adding a new `dynamic-lp` component (code-first, not the admin UI)

Components are authored as code and shipped through git — never created by hand in the Strapi
admin UI, so they're reviewable and reproducible across environments.

1. Create `src/components/dynamic-lp/<name>-section.json`. Match the existing shape:
   ```json
   {
     "collectionName": "components_dynamic_lp_<name>_sections",
     "info": { "displayName": "<Name> Section" },
     "options": {},
     "attributes": {
       "title": { "type": "string", "required": true },
       "subtitle": { "type": "string" }
     },
     "config": {}
   }
   ```
   - Use `"type": "media"` for images/video (`allowedTypes: ["images"]` etc.), `"type": "relation"`
     with `"relation": "oneToMany"` + `"target": "api::<collection>.<collection>"` when the block
     should pull from an existing collection (see `biomarker-section.json`, `testimonial-section.json`
     for the pattern), `"type": "text"`/`"blocks"` for longer copy.
   - Only add `"pluginOptions": { "i18n": { "localized": true } }` per attribute if the parent
     content type's dynamic zone field is itself localized (both `dynamic-page.Sections` and
     `persona-page.sections` are) — check the parent schema first.
2. Register `"dynamic-lp.<name>-section"` in the `components` array of **every** content-type
   schema whose dynamic zone should offer it. Today that means both
   `src/api/dynamic-page/content-types/dynamic-page/schema.json` and
   `src/api/persona-page/content-types/persona-page/schema.json` — check this list hasn't grown
   before assuming it's just these two.
3. Optionally run `npm run develop` locally to confirm Strapi boots cleanly and inspect the diff to
   `types/generated/contentTypes.d.ts` (auto-regenerated on every `develop`/`build` — never hand-edit
   it, and review the diff before committing rather than accepting it blindly).
4. Commit, push to a `gtm/<short-desc>` or `feat/<short-desc>` branch, open a PR against `main`.
   A merge here alone does **not** make the block appear correctly on the website — the
   corresponding renderer case in lucis-website must also ship (see that repo's CLAUDE.md).

## Native Strapi MCP (editorial CRUD)

Strapi's own MCP server is enabled in `config/server.js` (`mcp: { enabled: true }`, Strapi ≥5.50) —
this is what the `gtm-studio` skill in lucis-website connects to for content create/edit/delete.
It is not a local process; it's exposed by the live production Strapi instance.

To connect a Claude Code session to it: open the Strapi admin panel (Settings) and look for the
MCP / "Connect your AI assistant" panel — it surfaces the ready-to-use connection URL and walks
through minting a scoped API token. Don't hardcode a remembered URL/token; always get it fresh
from the admin panel, since tokens are meant to be rotated.

## Scope guardrails

- No staging Strapi exists. Every write through the native MCP (outside of local `npm run develop`
  demo data) is a write to the real, live CMS.
- Schema/component changes always go through git + PR + a human technical reviewer — never through
  the admin UI's "content-type builder" for anything meant to be reused or committed.
