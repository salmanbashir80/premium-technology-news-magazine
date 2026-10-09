import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/VITE_SUPABASE_URL\s*=\s*"?([^\r\n"]+)"?/)[1].trim();
const anon = env.match(/VITE_SUPABASE_ANON_KEY\s*=\s*"?([^\r\n"]+)"?/)[1].trim();

async function testAuth() {
  const client = createClient(url, anon);

  console.log('Testing authentication for OWNER: editorial.owner@signaldesk.news...');
  const { data, error } = await client.auth.signInWithPassword({
    email: 'editorial.owner@signaldesk.news',
    password: 'SignalDeskOwnerPass2026!'
  });

  if (error) {
    console.error('Sign-in failed:', error.message);
    process.exit(1);
  }

  console.log('Successfully signed in!');
  console.log('User ID:', data.user.id);
  console.log('User Email:', data.user.email);

  // Fetch profile with authenticated session
  const { data: profile, error: pErr } = await client
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (pErr) {
    console.error('Failed to read profile:', pErr.message);
  } else {
    console.log('Fetched Profile via authenticated RLS:');
    console.log(` - Role: ${profile.role}`);
    console.log(` - Full Name: ${profile.full_name}`);
  }

  await client.auth.signOut();
  console.log('Signed out successfully.');
}

testAuth().catch(console.error);
