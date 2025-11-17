/**
 * Cleanup Influencers Script
 *
 * This script removes all influencer entries from the database.
 * USE WITH CAUTION - This operation cannot be undone!
 *
 * Usage:
 *   node scripts/cleanup-influencers.js
 *   FORCE=true node scripts/cleanup-influencers.js  (skip confirmation)
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');
const readline = require('readline');

const cleanup = async () => {
  let strapi;

  try {
    console.log('\n⚠️  CLEANUP SCRIPT - DANGER ZONE ⚠️\n');

    // Safety check
    if (process.env.FORCE !== 'true') {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      await new Promise((resolve) => {
        rl.question('This will DELETE ALL influencer entries. Type "DELETE" to confirm: ', (answer) => {
          rl.close();
          if (answer !== 'DELETE') {
            console.log('❌ Aborted. (You must type "DELETE" to confirm)');
            process.exit(0);
          }
          resolve();
        });
      });
    }

    console.log('\n🧹 Starting cleanup...\n');

    // Initialize Strapi
    const appContext = await compileStrapi();
    strapi = await createStrapi(appContext).load();
    strapi.log.level = 'error';

    // Get all influencers
    const influencers = await strapi.db.query('api::influencer.influencer').findMany({
      populate: ['localizations'],
    });

    console.log(`Found ${influencers.length} entries to delete\n`);

    if (influencers.length === 0) {
      console.log('✓ No entries to delete. Database is already clean.\n');
      return;
    }

    // Delete each entry
    let deleted = 0;
    for (const influencer of influencers) {
      try {
        await strapi.db.query('api::influencer.influencer').delete({
          where: { id: influencer.id },
        });
        deleted++;
        console.log(`✓ Deleted: ${influencer.name} (ID: ${influencer.id}, locale: ${influencer.locale})`);
      } catch (error) {
        console.error(`✗ Failed to delete ID ${influencer.id}: ${error.message}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✓ Cleanup complete! Deleted ${deleted}/${influencers.length} entries`);
    console.log('='.repeat(60) + '\n');

    // Verify
    const remaining = await strapi.db.query('api::influencer.influencer').count();
    if (remaining === 0) {
      console.log('✅ Database is clean - no influencer entries remain\n');
    } else {
      console.warn(`⚠️  Warning: ${remaining} entries still remain in database\n`);
    }

  } catch (error) {
    console.error('\n❌ Cleanup failed:', error.message);
    throw error;

  } finally {
    if (strapi) {
      await strapi.destroy();
    }
  }
};

// Execute cleanup
if (require.main === module) {
  cleanup()
    .then(() => {
      console.log('✅ Cleanup script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Cleanup script failed');
      process.exit(1);
    });
}

module.exports = cleanup;
