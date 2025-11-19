# Influencer Import Guide

Simple guide for importing influencer data into Lucis CMS.

---

## 🚀 Quick Start

### Local Development

```bash
# 1. Test the import (no changes made)
npm run import:influencers:dry

# 2. Run the actual import
npm run import:influencers

# 3. Verify everything worked
npm run verify:influencers
```

### Production Deployment

Set this environment variable before starting Strapi:

```bash
RUN_INFLUENCER_IMPORT=true
```

The import will run automatically when Strapi starts.

---

## 📋 Available Commands

| Command                          | What it does                                  |
| -------------------------------- | --------------------------------------------- |
| `npm run import:influencers`     | Import 26 influencers (52 entries with EN/FR) |
| `npm run import:influencers:dry` | Preview import without making changes         |
| `npm run verify:influencers`     | Check if import was successful                |
| `npm run cleanup:influencers`    | Delete all influencer entries                 |

---

## 🎯 How It Works

### Data Flow

```
influencers-data.json (26 influencers)
         ↓
   Import Script
         ↓
   Strapi Database
         ↓
52 entries (26 English + 26 French)
```

### What Gets Imported

Each influencer includes:

- ✅ Name and slug (unique identifier)
- ✅ Discount code and percentage
- ✅ Hero text and description
- ✅ 4 bullet points (in both languages)
- ✅ SEO metadata
- ✅ Link to registration page

### Example Entry

**Source (influencers-data.json):**

```json
{
  "slug": "unchained",
  "name": "Unchained - Ophélie Duvillard",
  "discount": {
    "code": "UNCHAINEDLUCIS5",
    "percentage": 5
  },
  "translations": {
    "en": {
      "heroText": "Prevention is power",
      "influencerSection": {
        "bulletItems": [
          "Comprehensive scope (110+ biomarkers)",
          "Fast & reliable process",
          "Trends over time",
          "Personalised action plan"
        ]
      }
    },
    "fr": {
      /* French translation */
    }
  }
}
```

**Result in Strapi:**

- 1 English entry with all fields
- 1 French entry (linked to English via documentId)
- Both visible in Content Manager

---

## 🔧 Setup

### Prerequisites

1. **Strapi is running** with database configured
2. **i18n plugin enabled** with English and French locales
3. **influencers-data.json** exists in project root

### First Time Setup

```bash
# 1. Make sure locales are configured
# Go to: Settings → Internationalization
# Ensure "en" and "fr" locales exist

# 2. Run the import
npm run import:influencers

# 3. Check the results
npm run verify:influencers
```

Expected output:

```
✅ 9/9 validation checks passed
✨ All verification checks passed! ✨
```

---

## 🌐 Production Setup

### Option 1: Automatic Import (Recommended)

Set environment variable in your deployment platform:

```bash
RUN_INFLUENCER_IMPORT=true
```

**Examples:**

```bash
# Docker
ENV RUN_INFLUENCER_IMPORT=true

# Heroku
heroku config:set RUN_INFLUENCER_IMPORT=true

# Railway / Render
# Add in dashboard: RUN_INFLUENCER_IMPORT = true

# .env file
echo "RUN_INFLUENCER_IMPORT=true" >> .env
```

Import runs automatically when Strapi starts.

### Option 2: Manual Import

SSH into your server and run:

```bash
cd /path/to/lucis-cms
npm run import:influencers
npm run verify:influencers
```

---

## ✅ Verification

After import, run the verification script:

```bash
npm run verify:influencers
```

### What It Checks

1. ✅ Total entries exist (52)
2. ✅ English entries (26)
3. ✅ French entries (26)
4. ✅ Counts match
5. ✅ Required fields populated
6. ✅ All 4 bullet points present
7. ✅ Metadata exists
8. ✅ Localizations linked
9. ✅ DocumentIds match

### Success Output

```
📊 Database Statistics:
   Total entries: 52
   English (en): 26
   French (fr): 26

✅ All 4 bullet points populated
✅ French localization exists
✅ DocumentIds match (EN/FR)

📊 Results: 9/9 checks passed
✨ All verification checks passed! ✨
```

---

## 🔄 Common Tasks

### Update Influencer Data

```bash
# 1. Edit influencers-data.json
# 2. Clean existing data
npm run cleanup:influencers
# Type "DELETE" to confirm

# 3. Re-import
npm run import:influencers

# 4. Verify
npm run verify:influencers
```

### Add New Influencer

```bash
# 1. Add new entry to influencers-data.json
# 2. Run import (only new ones will be imported)
npm run import:influencers

# Existing entries are skipped automatically
```

### Reset Everything

```bash
# Delete all influencers
npm run cleanup:influencers

# Fresh import
npm run import:influencers
```

---

## 🛡️ Safety Features

### Duplicate Detection

The import script checks if an influencer already exists (by slug):

```
[1/26] Processing: Unchained (unchained)
  ⚠️  Already exists (ID: 853), skipping...
```

**This means:**

- ✅ Safe to run multiple times
- ✅ Won't create duplicates
- ✅ Existing data is preserved

### Dry Run Mode

Test before making changes:

```bash
npm run import:influencers:dry
```

Shows what would happen without modifying the database.

---

## 🐛 Troubleshooting

### "No influencer entries found"

**Cause:** Import hasn't run yet or failed

**Fix:**

```bash
npm run import:influencers
```

### "Locale 'en' or 'fr' not found"

**Cause:** i18n locales not configured

**Fix:**

1. Go to Strapi Admin → Settings → Internationalization
2. Add English (en) and French (fr) locales
3. Re-run import

### "BulletPoints are null"

**Cause:** Old version of bootstrap.js

**Fix:**

- ✅ Already fixed in current version
- Clean and re-import:

```bash
npm run cleanup:influencers
npm run import:influencers
```

### "Already exists, skipping" for all entries

**Cause:** Data already imported (this is normal!)

**Action:**

- If you want to update: clean first, then import
- If data is correct: no action needed

### Import fails with errors

**Debug mode:**

```bash
DEBUG=true npm run import:influencers
```

Check the detailed error messages and fix accordingly.

---

## 📁 Files Reference

### Scripts

- `scripts/import-influencers.js` - Main import script
- `scripts/verify-influencers.js` - Verification tool
- `scripts/cleanup-influencers.js` - Cleanup utility
- `scripts/test-import.sh` - Automated test

### Data

- `influencers-data.json` - Source data (26 influencers)

### Code

- `src/bootstrap.js` - Auto-import on startup (if env var set)
- `src/api/influencer/content-types/influencer/schema.json` - Schema definition

---

## 💡 Tips

### Development Workflow

```bash
# Always test first
npm run import:influencers:dry

# Then import
npm run import:influencers

# Always verify
npm run verify:influencers
```

### Production Workflow

```bash
# Set once in your platform
RUN_INFLUENCER_IMPORT=true

# Deploy normally
# Import happens automatically

# Verify after deployment
npm run verify:influencers
```

### Updating Data

1. Edit `influencers-data.json`
2. Clean existing: `npm run cleanup:influencers`
3. Re-import: `npm run import:influencers`
4. Verify: `npm run verify:influencers`

---

## ❓ FAQ

**Q: How many influencers are there?**  
A: 26 influencers, resulting in 52 database entries (26 EN + 26 FR)

**Q: Can I run import multiple times?**  
A: Yes! Duplicate detection prevents re-importing existing entries.

**Q: When does automatic import run?**  
A: During Strapi startup (bootstrap phase) if `RUN_INFLUENCER_IMPORT=true` is set.

**Q: Do I need to set the env var permanently?**  
A: Yes, keep it set. The script skips existing entries, so it's safe.

**Q: Can I import only English or only French?**  
A: The script imports both. To skip French, you'd need to modify the script.

**Q: What if I add a new influencer to the JSON?**  
A: Just run the import again. Only the new one will be imported.

**Q: How do I know if import was successful?**  
A: Run `npm run verify:influencers` - should show "9/9 checks passed"

---

## 📊 Import Statistics

After each import, you'll see:

```
======================================================================
📊 Import Summary
======================================================================
Total processed:       26
✓ Successfully imported: 26
⚠️  Skipped (existing):   0
✗ Failed:               0
======================================================================

🔍 Verifying import...
✓ Total entries in database: 52
✓ English entries: 26
✓ French entries: 26
✓ Entries with localizations: 26

✨ Import completed successfully!
```

---

## 🎓 Understanding the Data Structure

### BulletPoints Mapping

**JSON (array):**

```json
"bulletItems": [
  "Point 1",
  "Point 2",
  "Point 3",
  "Point 4"
]
```

**Strapi (individual fields):**

```javascript
{
  bulletPoint1: "Point 1",
  bulletPoint2: "Point 2",
  bulletPoint3: "Point 3",
  bulletPoint4: "Point 4"
}
```

### i18n Linking

Both English and French entries share the same `documentId`:

```javascript
// English
{ id: 983, documentId: "abc123", locale: "en", ... }

// French (linked)
{ id: 984, documentId: "abc123", locale: "fr", ... }
```

This allows Strapi to know they're translations of each other.

---

## ✨ Summary

**For Development:**

```bash
npm run import:influencers:dry  # Test
npm run import:influencers      # Import
npm run verify:influencers      # Verify
```

**For Production:**

```bash
# Just set this environment variable:
RUN_INFLUENCER_IMPORT=true

# Import happens automatically on startup!
```

**Need Help?**

- Check verification: `npm run verify:influencers`
- Enable debug mode: `DEBUG=true npm run import:influencers`
- Review this guide for troubleshooting steps

---

**Last Updated:** November 19, 2025  
**Import Count:** 26 influencers (52 entries with translations)  
**Status:** ✅ Production Ready
