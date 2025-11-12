// find-group-id.ts
import { listGroups } from './mailerlite'; // Adjust path if your file is named differently

async function run() {
  console.log("🔍 Fetching your MailerLite groups...\n");

  const result = await listGroups(true); // true = show debug logs

  if (!result.success) {
    console.error("❌ Failed to fetch groups:", result.message);
    process.exit(1);
  }

  const groups = result.data?.data || [];

  if (groups.length === 0) {
    console.log("⚠️  No groups found in your MailerLite account.");
    console.log("   Go to: https://dashboard.mailerlite.com/subscribers/groups");
    console.log("   Create a group first, then run this again.");
    return;
  }

  console.log("✅ Found", groups.length, "group(s):\n");
  console.table(
    groups.map((g: any) => ({
      ID: g.id,
      Name: g.name,
      Subscribers: g.total,
    }))
  );

  console.log("\n📋 Copy one of the **ID** values above and use it in `addToGroup()`");
  console.log("   Example: groupId: \"123456789\" (not the long number!)");
}

run().catch(err => {
  console.error("Unexpected error:", err);
});