# Influencer Import - Quick Reference

One-page cheat sheet for influencer import commands and setup.

---

## 🚀 Commands

```bash
# Import influencers
npm run import:influencers

# Test import (no changes)
npm run import:influencers:dry

# Verify import success
npm run verify:influencers

# Delete all influencers
npm run cleanup:influencers
```

---

## 🌐 Production Setup

Set this environment variable:

```bash
RUN_INFLUENCER_IMPORT=true
```

Import runs automatically when Strapi starts.

---

## 📊 What Gets Imported

- **26 influencers**
- **52 total entries** (26 EN + 26 FR)
- Includes: discount codes, bullet points, SEO metadata

---

## ✅ Verify Success

```bash
npm run verify:influencers
```

Expected: `✅ 9/9 validation checks passed`

---

## 🔄 Update Data

```bash
# 1. Edit influencers-data.json
# 2. Clean
npm run cleanup:influencers

# 3. Re-import
npm run import:influencers

# 4. Verify
npm run verify:influencers
```

---

## 🐛 Troubleshooting

| Issue              | Solution                            |
| ------------------ | ----------------------------------- |
| Import doesn't run | Set `RUN_INFLUENCER_IMPORT=true`    |
| Locales missing    | Add EN/FR in Settings → i18n        |
| Already exists     | Normal! Duplicate detection working |
| BulletPoints null  | Clean and re-import                 |

---

## 📁 Files

- `influencers-data.json` - Source data
- `scripts/import-influencers.js` - Import script
- `scripts/verify-influencers.js` - Verification
- `src/bootstrap.js` - Auto-import logic

---

## 💡 Key Points

✅ Safe to run multiple times (duplicate detection)  
✅ Works on all platforms (Docker, Heroku, etc.)  
✅ Automatic in production (with env var)  
✅ Manual in development (npm commands)

---

**Full Guide:** See `scripts/INFLUENCER_IMPORT.md`
