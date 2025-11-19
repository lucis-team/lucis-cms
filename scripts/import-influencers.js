/**
 * Influencer Data Import Script
 *
 * This script imports influencer data with full internationalization support
 * from influencers-data.json into Strapi CMS.
 *
 * Usage:
 *   node scripts/import-influencers.js
 *
 * Features:
 *   - Full i18n support (English/French)
 *   - Duplicate detection
 *   - Component mapping (bulletPoints, metadata)
 *   - Comprehensive error handling
 *   - Import statistics
 *   - Dry run mode (set DRY_RUN=true)
 *
 * Data Mappings:
 *   - translations.en/fr.influencerSection.bulletItems[] → bulletPoint1, bulletPoint2, bulletPoint3, bulletPoint4
 *   - metadata → SEO component (metaTitle, metaDescription)
 *   - discount → code, percentage fields
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  DEFAULT_LOCALE: 'en',
  SECONDARY_LOCALE: 'fr',
  JSON_FILE: path.join(__dirname, '../influencers-data.json'),
  DRY_RUN: process.env.DRY_RUN === 'true',
  AUTO_PUBLISH: false,
};

/**
 * Main import function
 */
const importInfluencers = async () => {
  let strapi;

  try {
    // Initialize Strapi
    console.log('🚀 Initializing Strapi...\n');
    const appContext = await compileStrapi();
    strapi = await createStrapi(appContext).load();
    strapi.log.level = 'error'; // Reduce noise
    console.log('✓ Strapi loaded successfully\n');

    // Dry run check
    if (CONFIG.DRY_RUN) {
      console.log('⚠️  DRY RUN MODE - No data will be written\n');
    }

    // Step 1: Load and validate JSON
    console.log('📖 Reading influencers data...');
    if (!fs.existsSync(CONFIG.JSON_FILE)) {
      throw new Error(`File not found: ${CONFIG.JSON_FILE}`);
    }

    const rawData = fs.readFileSync(CONFIG.JSON_FILE, 'utf-8');
    const { influencers } = JSON.parse(rawData);

    if (!Array.isArray(influencers) || influencers.length === 0) {
      throw new Error('Invalid data: "influencers" array is empty or missing');
    }

    console.log(`✓ Loaded ${influencers.length} influencers\n`);

    // Step 2: Verify locales exist
    console.log('🌍 Verifying locales...');
    const locales = await strapi.plugins.i18n.services.locales.find();
    const localeMap = new Map(locales.map(l => [l.code, l]));

    if (!localeMap.has(CONFIG.DEFAULT_LOCALE)) {
      throw new Error(`Default locale "${CONFIG.DEFAULT_LOCALE}" not found in Strapi!`);
    }

    const hasSecondaryLocale = localeMap.has(CONFIG.SECONDARY_LOCALE);
    if (!hasSecondaryLocale) {
      console.warn(`⚠️  Secondary locale "${CONFIG.SECONDARY_LOCALE}" not found - will skip French translations`);
    }

    console.log(`✓ Available locales: ${Array.from(localeMap.keys()).join(', ')}\n`);

    // Step 3: Import statistics
    const stats = {
      total: influencers.length,
      imported: 0,
      skipped: 0,
      failed: 0,
      errors: [],
    };

    // Step 4: Process each influencer
    console.log('=' .repeat(70));
    console.log('Starting Import Process');
    console.log('='.repeat(70) + '\n');

    for (const [index, influencerData] of influencers.entries()) {
      const progress = `[${index + 1}/${influencers.length}]`;

      try {
        console.log(`${progress} Processing: ${influencerData.name} (${influencerData.slug})`);

        // Validate required fields
        if (!influencerData.slug || !influencerData.name) {
          throw new Error('Missing required fields: slug or name');
        }

        if (!influencerData.translations || !influencerData.translations.en) {
          throw new Error('Missing English translation');
        }

        // Check if already exists
        const existing = await strapi.db.query('api::influencer.influencer').findOne({
          where: { slug: influencerData.slug },
          populate: ['localizations'],
        });

        if (existing) {
          console.log(`  ⚠️  Already exists (ID: ${existing.id}), skipping...`);
          stats.skipped++;
          continue;
        }

        if (CONFIG.DRY_RUN) {
          console.log('  [DRY RUN] Would create entries');
          stats.imported++;
          continue;
        }

        // Create default locale entry (English)
        const enData = influencerData.translations.en;

        // Map bulletItems array to individual text fields
        const bulletItems = enData.influencerSection?.bulletItems || [];

        const defaultData = {
          // Core non-localized fields
          slug: influencerData.slug,
          name: influencerData.name,
          code: influencerData.discount?.code || '',
          percentage: influencerData.discount?.percentage || 0,

          // Localized fields (English)
          shortBio: enData.shortBio || '',
          heroText: enData.heroText || '',
          heroDescription: enData.heroDescription || '',
          link: enData.influencerSection?.ctaLink || '',

          // Bullet points as individual fields - localized
          bulletPoint1: bulletItems[0] || '',
          bulletPoint2: bulletItems[1] || '',
          bulletPoint3: bulletItems[2] || '',
          bulletPoint4: bulletItems[3] || '',

          // Metadata (SEO component) - localized
          metadata: influencerData.metadata ? {
            metaTitle: influencerData.metadata.title || influencerData.name,
            metaDescription: influencerData.metadata.description || enData.shortBio || '',
            // Note: shareImage would need file upload handling, skipping for now
          } : null,

          // System fields
          locale: CONFIG.DEFAULT_LOCALE,
          publishedAt: CONFIG.AUTO_PUBLISH ? new Date() : null,
        };

        const defaultEntry = await strapi.documents('api::influencer.influencer').create({
          data: defaultData,
          locale: CONFIG.DEFAULT_LOCALE,
        });

        console.log(`  ✓ Created ${CONFIG.DEFAULT_LOCALE} entry (ID: ${defaultEntry.documentId})`);

        // Create French localization using direct DB query (workaround for Strapi v5 bug)
        if (hasSecondaryLocale && influencerData.translations.fr) {
          const frData = influencerData.translations.fr;

          // Map French bulletItems to individual text fields
          const frBulletItems = frData.influencerSection?.bulletItems || [];

          const frEntry = await strapi.db.query('api::influencer.influencer').create({
            data: {
              documentId: defaultEntry.documentId, // Same documentId for linking
              locale: CONFIG.SECONDARY_LOCALE,
              // Core fields (same as EN)
              slug: influencerData.slug,
              name: influencerData.name,
              code: influencerData.discount?.code || '',
              percentage: influencerData.discount?.percentage || 0,
              // Localized fields (French)
              shortBio: frData.shortBio || '',
              heroText: frData.heroText || '',
              heroDescription: frData.heroDescription || '',
              link: frData.influencerSection?.ctaLink || '',
              // Bullet points as individual fields - localized (French)
              bulletPoint1: frBulletItems[0] || '',
              bulletPoint2: frBulletItems[1] || '',
              bulletPoint3: frBulletItems[2] || '',
              bulletPoint4: frBulletItems[3] || '',
              // Metadata (SEO component) - localized
              metadata: influencerData.metadata ? {
                metaTitle: influencerData.metadata.title || influencerData.name,
                metaDescription: influencerData.metadata.description || frData.shortBio || '',
              } : null,
              publishedAt: CONFIG.AUTO_PUBLISH ? new Date() : null,
            },
          });

          console.log(`  ✓ Created ${CONFIG.SECONDARY_LOCALE} localization (same documentId: ${frEntry.documentId})`);
        }

        stats.imported++;
        console.log(`  ✅ Success!\n`);

      } catch (error) {
        stats.failed++;
        const errorMsg = `${progress} ${influencerData.name}: ${error.message}`;
        stats.errors.push(errorMsg);

        console.error(`  ❌ Failed: ${error.message}`);
        if (process.env.DEBUG) {
          console.error(`     ${error.stack}`);
        }
        console.log('');
      }
    }

    // Step 5: Print summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 Import Summary');
    console.log('='.repeat(70));
    console.log(`Total processed:       ${stats.total}`);
    console.log(`✓ Successfully imported: ${stats.imported}`);
    console.log(`⚠️  Skipped (existing):   ${stats.skipped}`);
    console.log(`✗ Failed:               ${stats.failed}`);
    console.log('='.repeat(70));

    if (stats.errors.length > 0) {
      console.log('\n❌ Errors:');
      stats.errors.forEach(err => console.log(`   - ${err}`));
    }

    // Step 6: Verification
    if (!CONFIG.DRY_RUN) {
      console.log('\n🔍 Verifying import...');

      const totalCount = await strapi.db.query('api::influencer.influencer').count();
      console.log(`✓ Total entries in database: ${totalCount}`);

      const enCount = await strapi.db.query('api::influencer.influencer').count({
        where: { locale: CONFIG.DEFAULT_LOCALE },
      });
      console.log(`✓ English entries: ${enCount}`);

      if (hasSecondaryLocale) {
        const frCount = await strapi.db.query('api::influencer.influencer').count({
          where: { locale: CONFIG.SECONDARY_LOCALE },
        });
        console.log(`✓ French entries: ${frCount}`);
      }

      const withLocalizations = await strapi.db.query('api::influencer.influencer').findMany({
        where: { locale: CONFIG.DEFAULT_LOCALE },
        populate: ['localizations'],
      });
      const localizationCount = withLocalizations.filter(i => i.localizations?.length > 0).length;
      console.log(`✓ Entries with localizations: ${localizationCount}`);
    }

    console.log('\n✨ Import completed successfully!\n');

    // Return stats for testing
    return stats;

  } catch (error) {
    console.error('\n❌ Fatal error during import:');
    console.error(`   ${error.message}`);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    throw error;

  } finally {
    // Cleanup
    if (strapi) {
      console.log('🧹 Cleaning up...');
      await strapi.destroy();
      console.log('✓ Strapi instance destroyed\n');
    }
  }
};

// Execute import
if (require.main === module) {
  console.log('\n' + '='.repeat(70));
  console.log('Influencer Data Import Script');
  console.log('='.repeat(70) + '\n');

  importInfluencers()
    .then((stats) => {
      if (stats && stats.failed === 0) {
        console.log('✅ All operations completed successfully!');
        process.exit(0);
      } else {
        console.log('⚠️  Completed with some errors. Check logs above.');
        process.exit(stats.failed > 0 ? 1 : 0);
      }
    })
    .catch((error) => {
      console.error('❌ Import script failed!');
      process.exit(1);
    });
}

module.exports = importInfluencers;
