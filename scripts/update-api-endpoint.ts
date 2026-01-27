/**
 * Update API Endpoint Script
 *
 * This script updates all configurations that use the old API endpoint
 * (api.jiuwanliguoxue.com) to the new recommended endpoint (api.aicodewith.com).
 *
 * Usage:
 *   npx tsx scripts/update-api-endpoint.ts
 *
 * This will update all openrouter_base_url configs that contain
 * api.jiuwanliguoxue.com to api.aicodewith.com while preserving the path.
 */

import { and, eq, like } from 'drizzle-orm';

import { db } from '@/core/db';
import { config } from '@/config/db/schema';

const OLD_ENDPOINT = 'api.jiuwanliguoxue.com';
const NEW_ENDPOINT = 'api.aicodewith.com';
const CONFIG_NAME = 'openrouter_base_url';

async function updateApiEndpoint() {
  console.log('🚀 Starting API endpoint update...\n');

  try {
    // Find all configs with the old endpoint
    const oldConfigs = await db()
      .select()
      .from(config)
      .where(
        and(
          eq(config.name, CONFIG_NAME),
          like(config.value, `%${OLD_ENDPOINT}%`)
        )
      );

    if (oldConfigs.length === 0) {
      console.log('✅ No configurations found with the old endpoint.');
      console.log(`   Searched for: ${OLD_ENDPOINT}\n`);
      return;
    }

    console.log(`📝 Found ${oldConfigs.length} configuration(s) to update:\n`);

    let updatedCount = 0;

    for (const oldConfig of oldConfigs) {
      const oldValue = oldConfig.value || '';
      console.log(`   Current: ${oldValue}`);

      // Replace the old endpoint with the new one, preserving the path
      const newValue = oldValue.replace(
        new RegExp(OLD_ENDPOINT.replace(/\./g, '\\.'), 'gi'),
        NEW_ENDPOINT
      );

      if (oldValue === newValue) {
        console.log(`   ⚠️  No change needed (already updated or pattern mismatch)\n`);
        continue;
      }

      console.log(`   New:     ${newValue}`);

      // Update the config
      await db()
        .update(config)
        .set({ value: newValue })
        .where(eq(config.id, oldConfig.id));

      updatedCount++;
      console.log(`   ✅ Updated\n`);
    }

    console.log('✅ API endpoint update completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Configurations found: ${oldConfigs.length}`);
    console.log(`   - Configurations updated: ${updatedCount}`);
    console.log(`\n💡 Next steps:`);
    console.log(`   1. The cache will be automatically invalidated`);
    console.log(`   2. Restart your application if needed`);
    console.log(`   3. Test the new endpoint to ensure it works correctly\n`);
  } catch (error) {
    console.error('\n❌ Error during API endpoint update:', error);
    process.exit(1);
  }
}

// Run the update
updateApiEndpoint()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
