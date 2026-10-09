import fs from 'node:fs';
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

// 1. Read configuration safely from .env.local
let supabaseUrl = '';
let serviceRoleKey = '';

if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  for (const line of envContent.split('\n')) {
    const urlMatch = line.match(/^\s*VITE_SUPABASE_URL\s*=\s*"?([^"\r\n]*)"?\s*$/);
    if (urlMatch && urlMatch[1]) supabaseUrl = urlMatch[1].trim();
    const serviceMatch = line.match(/^\s*SUPABASE_SERVICE_ROLE_KEY\s*=\s*"?([^"\r\n]*)"?\s*$/);
    if (serviceMatch && serviceMatch[1]) serviceRoleKey = serviceMatch[1].trim();
  }
}

if (!supabaseUrl || !serviceRoleKey) {
  console.error('ERROR: Missing Supabase credentials in .env.local');
  process.exit(1);
}

const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log('=====================================================');
  console.log('SIGNAL DESK — CRITICAL STAFF CREDENTIAL ROTATION');
  console.log('=====================================================');

  // 1. List existing users in Supabase Auth
  const { data: usersData, error: listErr } = await adminClient.auth.admin.listUsers();
  if (listErr) {
    console.error('Failed to list Auth users:', listErr.message);
    process.exit(1);
  }

  const users = usersData.users || [];
  console.log(`Auditing ${users.length} authenticated users in Supabase...`);

  // Target verified owner email: dudeme46@gmail.com
  const verifiedOwnerEmail = 'dudeme46@gmail.com';
  let verifiedOwnerId = null;

  for (const user of users) {
    const email = (user.email || '').toLowerCase();

    // Check if this is the verified owner
    if (email === verifiedOwnerEmail) {
      console.log(`[VERIFIED OWNER] Found verified account: ${email} (ID: ${user.id})`);
      verifiedOwnerId = user.id;

      // Rotate owner password to cryptographically strong random secret
      const secureOwnerPass = crypto.randomBytes(32).toString('base64url') + '!A1';
      await adminClient.auth.admin.updateUserById(user.id, {
        password: secureOwnerPass,
        email_confirm: true,
        user_metadata: { role: 'OWNER', full_name: 'Basco (Owner)' },
      });

      // Ensure profile is OWNER
      await adminClient.from('profiles').upsert({
        id: user.id,
        email: verifiedOwnerEmail,
        full_name: 'Basco (Owner)',
        role: 'OWNER',
        updated_at: new Date().toISOString(),
      });
      console.log(`[PASS] Verified owner credentials rotated and confirmed as OWNER.`);
      continue;
    }

    // If it's one of the fictional / compromised test accounts
    if (email.endsWith('@signaldesk.news')) {
      console.log(`[DEACTIVATE] Decommissioning compromised/fictional account: ${email}`);

      // Delete from Auth users so old sessions and credentials cannot be used
      const { error: delErr } = await adminClient.auth.admin.deleteUser(user.id);
      if (delErr) {
        console.warn(`Could not delete ${email}: ${delErr.message}. Rotating password to disable access.`);
        const unguessable = crypto.randomBytes(48).toString('hex') + '!X9';
        await adminClient.auth.admin.updateUserById(user.id, {
          password: unguessable,
          ban_duration: '876000h', // 100 years
        });
      } else {
        console.log(`[PASS] Deleted compromised auth account: ${email}`);
      }

      // Remove or neutralize profile
      await adminClient.from('profiles').delete().eq('id', user.id);
    }
  }

  // 2. Ensure verified owner account exists if not already present
  if (!verifiedOwnerId) {
    console.log(`\nCreating verified owner account for ${verifiedOwnerEmail}...`);
    const secureOwnerPass = crypto.randomBytes(32).toString('base64url') + '!A1';
    const { data: newOwner, error: createErr } = await adminClient.auth.admin.createUser({
      email: verifiedOwnerEmail,
      password: secureOwnerPass,
      email_confirm: true,
      user_metadata: { role: 'OWNER', full_name: 'Basco (Owner)' },
    });

    if (createErr) {
      console.error(`Error creating verified owner: ${createErr.message}`);
    } else {
      verifiedOwnerId = newOwner.user.id;
      console.log(`[PASS] Created verified owner: ${verifiedOwnerId}`);

      await adminClient.from('profiles').upsert({
        id: verifiedOwnerId,
        email: verifiedOwnerEmail,
        full_name: 'Basco (Owner)',
        role: 'OWNER',
        updated_at: new Date().toISOString(),
      });
    }
  }

  // 3. Ensure test accounts for isolated integration tests use dynamic secure tokens,
  // not hardcoded publicly exposed passwords.
  // Create an invitation-ready dedicated test staff account with a fresh random secret
  const testStaffEmail = 'test.editor@signaldesk.internal';
  const secureTestPass = crypto.randomBytes(24).toString('base64url') + '!T1';
  
  // Upsert test staff
  const existingTestUser = (await adminClient.auth.admin.listUsers()).data.users.find(u => u.email === testStaffEmail);
  let testUserId = existingTestUser?.id;

  if (existingTestUser) {
    await adminClient.auth.admin.updateUserById(existingTestUser.id, {
      password: secureTestPass,
      email_confirm: true,
      user_metadata: { role: 'EDITOR', full_name: 'Automated Test Editor' },
    });
  } else {
    const { data: testUser } = await adminClient.auth.admin.createUser({
      email: testStaffEmail,
      password: secureTestPass,
      email_confirm: true,
      user_metadata: { role: 'EDITOR', full_name: 'Automated Test Editor' },
    });
    testUserId = testUser.user.id;
  }

  if (testUserId) {
    await adminClient.from('profiles').upsert({
      id: testUserId,
      email: testStaffEmail,
      full_name: 'Automated Test Editor',
      role: 'EDITOR',
      updated_at: new Date().toISOString(),
    });
    // Write dynamic test credential to gitignored local env file for test suites
    let localEnv = fs.readFileSync('.env.local', 'utf8');
    localEnv = localEnv.replace(/TEST_STAFF_EMAIL=.*\n/g, '').replace(/TEST_STAFF_PASSWORD=.*\n/g, '');
    localEnv += `\nTEST_STAFF_EMAIL=${testStaffEmail}\nTEST_STAFF_PASSWORD=${secureTestPass}\n`;
    fs.writeFileSync('.env.local', localEnv, 'utf8');
    console.log(`[PASS] Configured isolated test staff credentials in gitignored .env.local.`);
  }

  // 4. Verify remaining active profiles
  console.log('\n=== VERIFYING ACTIVE AUTHORIZED STAFF PROFILES ===');
  const { data: remainingProfiles } = await adminClient.from('profiles').select('*');
  (remainingProfiles || []).forEach(p => {
    console.log(` - Role: [${p.role.padEnd(8)}] Email: ${p.email} (${p.full_name})`);
  });

  console.log('\n[PASS] Credential scrub and account rotation complete.');
}

main().catch(console.error);
