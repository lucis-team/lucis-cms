/**
 * Verify Influencers Script
 *
 * This script verifies that influencer data was imported correctly,
 * checking bulletPoints mapping and i18n setup.
 *
 * Usage:
 *   node scripts/verify-influencers.js
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const verify = async () => {
  let strapi;

  try {
    console.log('\n🔍 Influencer Data Verification\n');
    console.log('='.repeat(70));

    // Initialize Strapi
    console.log('🚀 Initializing Strapi...');
    const appContext = await compileStrapi();
    strapi = await createStrapi(appContext).load();
    strapi.log.level = 'error';
    console.log('✓ Strapi loaded\n');

    // Get total counts
    const totalCount = await strapi.db.query('api::influencer.influencer').count();
    const enCount = await strapi.db.query('api::influencer.influencer').count({
      where: { locale: 'en' },
    });
    const frCount = await strapi.db.query('api::influencer.influencer').count({
      where: { locale: 'fr' },
    });

    console.log('📊 Database Statistics:');
    console.log(`   Total entries: ${totalCount}`);
    console.log(`   English (en): ${enCount}`);
    console.log(`   French (fr): ${frCount}`);
    console.log('');

    // Get a sample influencer to check structure
    const sampleInfluencer = await strapi.db.query('api::influencer.influencer').findOne({
      where: { slug: 'unchained', locale: 'en' },
      populate: ['localizations', 'metadata'],
    });

    if (!sampleInfluencer) {
      console.log('⚠️  No sample influencer found. Database might be empty.');
      return;
    }

    console.log('🔍 Sample Entry Verification (Unchained - English):');
    console.log('='.repeat(70));
    console.log(`Name: ${sampleInfluencer.name}`);
    console.log(`Slug: ${sampleInfluencer.slug}`);
    console.log(`Locale: ${sampleInfluencer.locale}`);
    console.log(`Document ID: ${sampleInfluencer.documentId}`);
    console.log(`\nDiscount:`);
    console.log(`   Code: ${sampleInfluencer.code}`);
    console.log(`   Percentage: ${sampleInfluencer.percentage}%`);
    console.log(`\nLocalized Content:`);
    console.log(`   Short Bio: ${sampleInfluencer.shortBio?.substring(0, 60)}...`);
    console.log(`   Hero Text: ${sampleInfluencer.heroText}`);
    console.log(`   Hero Description: ${sampleInfluencer.heroDescription?.substring(0, 60)}...`);
    console.log(`   Link: ${sampleInfluencer.link}`);
    
    console.log(`\n✅ Bullet Points (Individual Fields):`);
    console.log(`   1. ${sampleInfluencer.bulletPoint1}`);
    console.log(`   2. ${sampleInfluencer.bulletPoint2}`);
    console.log(`   3. ${sampleInfluencer.bulletPoint3}`);
    console.log(`   4. ${sampleInfluencer.bulletPoint4}`);

    if (sampleInfluencer.metadata) {
      console.log(`\n📝 Metadata (SEO Component):`);
      console.log(`   Title: ${sampleInfluencer.metadata.metaTitle}`);
      console.log(`   Description: ${sampleInfluencer.metadata.metaDescription?.substring(0, 60)}...`);
    }

    console.log(`\n🌍 Localizations: ${sampleInfluencer.localizations?.length || 0} found`);

    // Check French version
    const frInfluencer = await strapi.db.query('api::influencer.influencer').findOne({
      where: { slug: 'unchained', locale: 'fr' },
    });

    if (frInfluencer) {
      console.log('\n🔍 French Localization Verification:');
      console.log('='.repeat(70));
      console.log(`Document ID: ${frInfluencer.documentId} (should match EN)`);
      console.log(`Short Bio: ${frInfluencer.shortBio?.substring(0, 60)}...`);
      console.log(`\n✅ French Bullet Points:`);
      console.log(`   1. ${frInfluencer.bulletPoint1}`);
      console.log(`   2. ${frInfluencer.bulletPoint2}`);
      console.log(`   3. ${frInfluencer.bulletPoint3}`);
      console.log(`   4. ${frInfluencer.bulletPoint4}`);
    }

    // Validation checks
    console.log('\n\n🧪 Validation Checks:');
    console.log('='.repeat(70));

    const checks = {
      'Total entries exist': totalCount > 0,
      'English entries exist': enCount > 0,
      'French entries exist': frCount > 0,
      'EN and FR counts match': enCount === frCount,
      'Sample has all required fields': !!(
        sampleInfluencer.slug &&
        sampleInfluencer.name &&
        sampleInfluencer.code &&
        sampleInfluencer.percentage &&
        sampleInfluencer.heroText &&
        sampleInfluencer.heroDescription &&
        sampleInfluencer.link
      ),
      'All 4 bullet points populated': !!(
        sampleInfluencer.bulletPoint1 &&
        sampleInfluencer.bulletPoint2 &&
        sampleInfluencer.bulletPoint3 &&
        sampleInfluencer.bulletPoint4
      ),
      'Metadata component exists': !!sampleInfluencer.metadata,
      'French localization exists': !!frInfluencer,
      'DocumentIds match (EN/FR)': sampleInfluencer.documentId === frInfluencer?.documentId,
    };

    let passedChecks = 0;
    let failedChecks = 0;

    for (const [check, passed] of Object.entries(checks)) {
      const icon = passed ? '✅' : '❌';
      console.log(`${icon} ${check}`);
      if (passed) passedChecks++;
      else failedChecks++;
    }

    console.log('\n' + '='.repeat(70));
    console.log(`📊 Results: ${passedChecks}/${Object.keys(checks).length} checks passed`);
    console.log('='.repeat(70));

    if (failedChecks === 0) {
      console.log('\n✨ All verification checks passed! ✨\n');
      return { success: true, checks };
    } else {
      console.log(`\n⚠️  ${failedChecks} check(s) failed. Review above for details.\n`);
      return { success: false, checks };
    }

  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    throw error;

  } finally {
    if (strapi) {
      console.log('🧹 Cleaning up...');
      await strapi.destroy();
    }
  }
};

// Execute verification
if (require.main === module) {
  verify()
    .then((result) => {
      process.exit(result?.success ? 0 : 1);
    })
    .catch(() => {
      console.error('❌ Verification script failed!');
      process.exit(1);
    });
}

module.exports = verify;

