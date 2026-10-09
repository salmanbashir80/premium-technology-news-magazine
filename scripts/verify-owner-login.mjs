import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

// Load credentials safely from .env.local
let supabaseUrl = '';
let anonKey = '';
let serviceRoleKey = '';
let ownerEmail = '';
let ownerPassword = '';

if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  for (const line of envContent.split('\n')) {
    const urlMatch = line.match(/^\s*VITE_SUPABASE_URL\s*=\s*"?([^"\r\n]*)"?\s*$/);
    if (urlMatch && urlMatch[1]) supabaseUrl = urlMatch[1].trim();
    const anonMatch = line.match(/^\s*VITE_SUPABASE_ANON_KEY\s*=\s*"?([^"\r\n]*)"?\s*$/);
    if (anonMatch && anonMatch[1]) anonKey = anonMatch[1].trim();
    const serviceMatch = line.match(/^\s*SUPABASE_SERVICE_ROLE_KEY\s*=\s*"?([^"\r\n]*)"?\s*$/);
    if (serviceMatch && serviceMatch[1]) serviceRoleKey = serviceMatch[1].trim();
    const emailMatch = line.match(/^\s*OWNER_EMAIL\s*=\s*"?([^"\r\n]*)"?\s*$/);
    if (emailMatch && emailMatch[1]) ownerEmail = emailMatch[1].trim();
    const passMatch = line.match(/^\s*OWNER_PASSWORD\s*=\s*"?([^"\r\n]*)"?\s*$/);
    if (passMatch && passMatch[1]) ownerPassword = passMatch[1].trim();
  }
}

if (!supabaseUrl || !anonKey || !serviceRoleKey || !ownerEmail || !ownerPassword) {
  console.error('ERROR: Missing required Supabase or Owner credentials in .env.local');
  process.exit(1);
}

const client = createClient(supabaseUrl, anonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  console.log('=====================================================');
  console.log('SIGNAL DESK — OWNER AUTHENTICATION & RECOVERY VERIFICATION');
  console.log('=====================================================');

  // Test 1: Authenticate with Supabase Auth using owner credentials
  console.log(`Authenticating owner account: ${ownerEmail}...`);
  const { data: signInData, error: signInErr } = await client.auth.signInWithPassword({
    email: ownerEmail,
    password: ownerPassword,
  });

  if (signInErr) {
    console.error(`[FAIL] Owner authentication failed: ${signInErr.message}`);
    process.exit(1);
  }

  console.log(`[PASS] Supabase Auth sign-in succeeded for ${ownerEmail}`);
  console.log(`[PASS] Authenticated user ID: ${signInData.user.id}`);

  // Test 2: Verify Profile Role is OWNER via authenticated RLS
  const { data: profile, error: profErr } = await client
    .from('profiles')
    .select('*')
    .eq('id', signInData.user.id)
    .single();

  if (profErr) {
    console.error(`[FAIL] Failed to read owner profile: ${profErr.message}`);
    process.exit(1);
  }

  if (profile.role !== 'OWNER') {
    console.error(`[FAIL] Expected role 'OWNER', found: '${profile.role}'`);
    process.exit(1);
  }

  console.log(`[PASS] Verified profile role: ${profile.role} (${profile.full_name})`);

  // Test 3: Sign out
  await client.auth.signOut();
  console.log('[PASS] Signed out cleanly.');

  // Test 4: Verify Supabase Auth Password Recovery mechanism
  console.log('\nTesting Supabase Auth Password Recovery capability...');
  const { data: recoveryData, error: recoveryErr } = await adminClient.auth.admin.generateLink({
    type: 'recovery',
    email: ownerEmail,
    options: {
      redirectTo: 'https://premium-technology-news-magazine.8002salman.workers.dev/admin',
    },
  });

  if (recoveryErr) {
    console.error(`[FAIL] Password recovery link generation failed: ${recoveryErr.message}`);
    process.exit(1);
  }

  console.log('[PASS] Supabase Auth password recovery mechanism is operational.');
  console.log(`[PASS] Recovery link type: ${recoveryData.properties?.action_link ? 'verified action link' : 'generated link'}`);

  console.log('\n=====================================================');
  console.log('ALL OWNER AUTHENTICATION & RECOVERY CHECKS PASSED');
  console.log('=====================================================');
}

run().catch((err) => {
  console.error('Fatal error during owner verification:', err);
  process.exit(1);
});
