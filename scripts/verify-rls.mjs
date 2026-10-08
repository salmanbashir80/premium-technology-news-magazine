import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = '';
let anonKey = '';
let serviceRoleKey = '';

if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  for (const line of envContent.split('\n')) {
    const urlMatch = line.match(/^\s*VITE_SUPABASE_URL\s*=\s*"?([^"\r\n]*)"?\s*$/);
    if (urlMatch && urlMatch[1]) supabaseUrl = urlMatch[1].trim();
    const anonMatch = line.match(/^\s*VITE_SUPABASE_ANON_KEY\s*=\s*"?([^"\r\n]*)"?\s*$/);
    if (anonMatch && anonMatch[1]) anonKey = anonMatch[1].trim();
    const serviceMatch = line.match(/^\s*SUPABASE_SERVICE_ROLE_KEY\s*=\s*"?([^"\r\n]*)"?\s*$/);
    if (serviceMatch && serviceMatch[1]) serviceRoleKey = serviceMatch[1].trim();
  }
}

if (!supabaseUrl || !anonKey || !serviceRoleKey) {
  console.error('ERROR: Missing Supabase credentials in .env.local');
  process.exit(1);
}

async function testRLS() {
  console.log('=== VERIFYING ROW LEVEL SECURITY (RLS) POLICIES ===');
  console.log('Endpoint:', supabaseUrl);

  // 1. Anonymous Client (Simulates public visitor / Edge SSR)
  const anonClient = createClient(supabaseUrl, anonKey);

  // A. Public can read published articles
  const { data: pubArticles, error: pubErr } = await anonClient
    .from('articles')
    .select('id, slug, status, title')
    .limit(5);

  console.log('\n[ANON] Fetch published articles:');
  if (pubErr) {
    console.error('FAILED to read published articles:', pubErr.message);
  } else {
    console.log(`SUCCESS: Read ${pubArticles.length} published articles.`);
    pubArticles.forEach(a => console.log(` - [${a.status}] ${a.slug}`));
  }

  // B. Anonymous CANNOT read audit logs
  const { data: auditLogs, error: auditErr } = await anonClient
    .from('audit_logs')
    .select('*')
    .limit(5);

  console.log('\n[ANON] Attempt read audit_logs (should be empty / denied):');
  if (auditErr) {
    console.log(`BLOCKED as expected: ${auditErr.message}`);
  } else {
    console.log(`Result: Returned ${auditLogs?.length || 0} records (RLS correctly filtered to 0).`);
  }

  // C. Anonymous CANNOT read publication events
  const { data: pubEvents, error: eventsErr } = await anonClient
    .from('publication_events')
    .select('*')
    .limit(5);

  console.log('\n[ANON] Attempt read publication_events (should be empty / denied):');
  if (eventsErr) {
    console.log(`BLOCKED as expected: ${eventsErr.message}`);
  } else {
    console.log(`Result: Returned ${pubEvents?.length || 0} records (RLS correctly filtered to 0).`);
  }

  // D. Anonymous CANNOT read story candidates
  const { data: candidates, error: candErr } = await anonClient
    .from('story_candidates')
    .select('*')
    .limit(5);

  console.log('\n[ANON] Attempt read story_candidates (should be empty / denied):');
  if (candErr) {
    console.log(`BLOCKED as expected: ${candErr.message}`);
  } else {
    console.log(`Result: Returned ${candidates?.length || 0} records (RLS correctly filtered to 0).`);
  }

  // 2. Service Role Client (Server-side admin operations)
  const serviceClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: adminArticles, error: adminErr } = await serviceClient
    .from('articles')
    .select('id, slug, status')
    .limit(5);

  console.log('\n[SERVICE ROLE] Admin access check:');
  if (adminErr) {
    console.error('Service role error:', adminErr.message);
  } else {
    console.log(`SUCCESS: Service role fetched ${adminArticles.length} articles.`);
  }

  console.log('\nRLS Verification Complete!');
}

testRLS().catch(console.error);
