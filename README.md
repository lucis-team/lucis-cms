# Lucis CMS

Headless CMS for the [Lucis](https://lucis.life) platform, built with [Strapi v5](https://strapi.io). Manages all content served to the Lucis web app — articles, influencer pages, biomarker cards, FAQs, testimonials, and more.

**Live admin:** [cms.lucis.life/admin](https://cms.lucis.life/admin)  
**Strapi Cloud project:** [cloud.strapi.io/projects](https://cloud.strapi.io/projects)

---

## Content Types

| Content Type | Description |
|---|---|
| `article` | Blog articles with author and category relations |
| `author` | Article authors |
| `category` | Article categories |
| `influencer` | Influencer landing pages with discount codes (EN/FR) |
| `biomarker-card` | Biomarker information cards |
| `faq` | Frequently asked questions |
| `testimonial-card` | Customer testimonials |
| `how-app-works-card` | Feature explanation cards |
| `website-banner` | Promotional banners |
| `why-section` | "Why Lucis" section content |
| `problem` | Problem statement content |
| `dynamic-page` | Flexible dynamic page content |
| `global` | Global site settings and metadata |
| `about` | About page content |

Content is fully internationalised — English (`en`) and French (`fr`) locales are supported across all types.

---

## Getting Started

**Requirements:** Node.js `>=20.x <=24.x`, npm `>=6.0.0`

```bash
# Install dependencies
npm install

# Start in development mode (with auto-reload)
npm run develop

# Build the admin panel
npm run build

# Start in production mode
npm start
```

---

## Deployment

This project is deployed via [Strapi Cloud](https://cloud.strapi.io/projects). Every new commit pushed to `main` is automatically deployed to production at [cms.lucis.life/admin](https://cms.lucis.life/admin).

---

## Tech Stack

- **Strapi v5** — headless CMS framework
- **SQLite** (`better-sqlite3`) — local development database
- **i18n** — built-in Strapi internationalisation (EN/FR)
- **Users & Permissions plugin** — API authentication and role management
- **Strapi Cloud plugin** — deployment integration
