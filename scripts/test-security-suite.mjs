import fs from 'node:fs';
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

// 1. Load credentials from .env.local
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

const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const anonClient = createClient(supabaseUrl, anonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log('=====================================================');
  console.log('SIGNAL DESK — AUTOMATED DATABASE SECURITY TEST SUITE');
  console.log('=====================================================');

  let passedCount = 0;
  let failedCount = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failedCount++;
    }
  }

  // --- SUITE 1: ANONYMOUS ACCESS RESTRICTIONS ---
  console.log('\n--- SUITE 1: ANONYMOUS PRIVACY & RLS ENFORCEMENT ---');

  // Test 1.1: Anonymous cannot read audit_logs
  const { data: anonAudit, error: errAudit } = await anonClient.from('audit_logs').select('*').limit(5);
  assert(errAudit !== null || (anonAudit && anonAudit.length === 0), 'Anonymous visitor cannot read audit_logs');

  // Test 1.2: Anonymous cannot read story_candidates
  const { data: anonCand, error: errCand } = await anonClient.from('story_candidates').select('*').limit(5);
  assert(errCand !== null || (anonCand && anonCand.length === 0), 'Anonymous visitor cannot read story_candidates');

  // Test 1.3: Anonymous cannot read unpublished drafts
  const { data: anonDrafts } = await anonClient.from('articles').select('id, status').eq('status', 'draft');
  assert(!anonDrafts || anonDrafts.length === 0, 'Anonymous visitor receives zero draft articles');

  // Test 1.4: Anonymous cannot insert or mutate articles
  const { error: anonInsertErr } = await anonClient.from('articles').insert({
    title: 'Hacked Article',
    slug: 'hacked-article',
    status: 'published'
  });
  assert(anonInsertErr !== null, 'Anonymous visitor cannot insert articles');

  // --- SUITE 2: ROLE ESCALATION DEFENSE ---
  console.log('\n--- SUITE 2: DATABASE ROLE ESCALATION DEFENSE ---');

  // Create temporary researcher user
  const researcherEmail = `test.researcher.${Date.now()}@signaldesk.internal`;
  const researcherPass = crypto.randomBytes(24).toString('base64url') + '!R9';
  const { data: researcherAuth, error: createResErr } = await serviceClient.auth.admin.createUser({
    email: researcherEmail,
    password: researcherPass,
    email_confirm: true,
    user_metadata: { role: 'RESEARCHER', full_name: 'Test Researcher' },
  });
  if (createResErr) throw createResErr;
  const researcherId = researcherAuth.user.id;

  await serviceClient.from('profiles').upsert({
    id: researcherId,
    email: researcherEmail,
    full_name: 'Test Researcher',
    role: 'RESEARCHER',
  });

  // Log in as RESEARCHER
  const researcherClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error: signInResErr } = await researcherClient.auth.signInWithPassword({
    email: researcherEmail,
    password: researcherPass,
  });
  if (signInResErr) throw signInResErr;

  // Test 2.1: Researcher attempts to become OWNER
  const { error: resToOwnerErr } = await researcherClient
    .from('profiles')
    .update({ role: 'OWNER' })
    .eq('id', researcherId);
  assert(resToOwnerErr !== null, 'RESEARCHER cannot escalate self to OWNER (Database trigger/RLS blocks)');

  // Test 2.2: Researcher attempts to become ADMIN
  const { error: resToAdminErr } = await researcherClient
    .from('profiles')
    .update({ role: 'ADMIN' })
    .eq('id', researcherId);
  assert(resToAdminErr !== null, 'RESEARCHER cannot escalate self to ADMIN (Database trigger/RLS blocks)');

  // Test 2.3: Verify role in database remained RESEARCHER
  const { data: currentResProfile } = await serviceClient.from('profiles').select('role').eq('id', researcherId).single();
  assert(currentResProfile?.role === 'RESEARCHER', 'RESEARCHER role remained uncorrupted in PostgreSQL profiles');

  // --- SUITE 3: EDITORIAL WORKFLOW STATE MACHINE ---
  console.log('\n--- SUITE 3: EDITORIAL WORKFLOW & PUBLISHING STATE MACHINE ---');

  // Create a clean test category and author for test articles
  const { data: testCat } = await serviceClient.from('categories').select('id, slug').limit(1).single();
  const { data: testAuth } = await serviceClient.from('authors').select('id, slug').limit(1).single();

  // Create a test draft article via service role
  const testSlug = `sec-test-${Date.now()}`;
  const { data: draftArticle, error: draftCreateErr } = await serviceClient.from('articles').insert({
    slug: testSlug,
    title: 'Security Workflow Test Article',
    dek: 'A dek for testing the state machine.',
    summary: 'Summary for test article.',
    category_id: testCat.id,
    author_id: testAuth.id,
    featured_image: '/images/hero-ai-cluster.jpg',
    status: 'draft',
    is_demo: false,
    body: [{ type: 'p', content: 'Testing paragraph' }],
  }).select().single();
  if (draftCreateErr) throw draftCreateErr;

  // Test 3.1: Direct draft -> published must be BLOCKED
  const { error: directPublishErr } = await researcherClient
    .from('articles')
    .update({ status: 'published' })
    .eq('id', draftArticle.id);
  assert(directPublishErr !== null, 'Direct draft-to-published transition is strictly BLOCKED by trigger');

  // Test 3.2: Researcher cannot approve articles
  const { error: resApproveErr } = await researcherClient
    .from('articles')
    .update({ status: 'approved' })
    .eq('id', draftArticle.id);
  assert(resApproveErr !== null, 'RESEARCHER cannot approve articles (Editorial role check enforced)');

  // Create temporary editor user
  const editorEmail = `test.editor.${Date.now()}@signaldesk.internal`;
  const editorPass = crypto.randomBytes(24).toString('base64url') + '!E9';
  const { data: editorAuth } = await serviceClient.auth.admin.createUser({
    email: editorEmail,
    password: editorPass,
    email_confirm: true,
    user_metadata: { role: 'EDITOR', full_name: 'Test Editor' },
  });
  const editorId = editorAuth.user.id;
  await serviceClient.from('profiles').upsert({
    id: editorId,
    email: editorEmail,
    full_name: 'Test Editor',
    role: 'EDITOR',
  });

  const editorClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  await editorClient.auth.signInWithPassword({
    email: editorEmail,
    password: editorPass,
  });

  // Test 3.3: Editor attempts direct draft -> published without approval -> MUST FAIL
  const { error: editorDirectPublishErr } = await editorClient
    .from('articles')
    .update({ status: 'published' })
    .eq('id', draftArticle.id);
  assert(editorDirectPublishErr !== null, 'EDITOR cannot skip workflow: direct draft-to-published rejected');

  // Test 3.4: Editor attempts self-escalation to OWNER -> MUST FAIL
  const { error: editorToOwnerErr } = await editorClient
    .from('profiles')
    .update({ role: 'OWNER' })
    .eq('id', editorId);
  assert(editorToOwnerErr !== null, 'EDITOR cannot escalate self to OWNER');

  // Test 3.5: Legitimate sequential editorial workflow:
  // draft -> fact_check -> editorial_review -> approved -> published
  const { error: step1Err } = await editorClient
    .from('articles')
    .update({ status: 'fact_check' })
    .eq('id', draftArticle.id);
  assert(step1Err === null, 'Legitimate transition: draft -> fact_check succeeds');

  const { error: step2Err } = await editorClient
    .from('articles')
    .update({ status: 'editorial_review' })
    .eq('id', draftArticle.id);
  assert(step2Err === null, 'Legitimate transition: fact_check -> editorial_review succeeds');

  const { error: step3Err } = await editorClient
    .from('articles')
    .update({ status: 'approved' })
    .eq('id', draftArticle.id);
  if (step3Err) console.error('Step 3 Error Details:', step3Err);
  assert(step3Err === null, 'Legitimate transition: editorial_review -> approved succeeds');

  const { error: step4Err } = await editorClient
    .from('articles')
    .update({ status: 'published' })
    .eq('id', draftArticle.id);
  if (step4Err) console.error('Step 4 Error Details:', step4Err);
  assert(step4Err === null, 'Legitimate transition: approved -> published succeeds');

  // Test 3.6: Verify publication event and audit logs logged the transitions
  const { data: pubEvents } = await serviceClient
    .from('publication_events')
    .select('*')
    .eq('article_id', draftArticle.id);
  assert(pubEvents && pubEvents.length > 0, 'Publication event automatically recorded in publication_events');

  const { data: auditEntries } = await serviceClient
    .from('audit_logs')
    .select('*')
    .eq('record_id', draftArticle.id);
  assert(auditEntries && auditEntries.length > 0, 'All status transitions recorded in immutable audit_logs');

  // --- SUITE 4: AUDIT LOG IMMUTABILITY ---
  console.log('\n--- SUITE 4: AUDIT LOG IMMUTABILITY ---');

  if (auditEntries && auditEntries.length > 0) {
    const auditId = auditEntries[0].id;
    const { error: auditUpdateErr } = await editorClient
      .from('audit_logs')
      .update({ action: 'TAMPERED' })
      .eq('id', auditId);
    assert(auditUpdateErr !== null, 'Authenticated users cannot UPDATE audit logs (immutable)');

    const { error: auditDeleteErr } = await editorClient
      .from('audit_logs')
      .delete()
      .eq('id', auditId);
    assert(auditDeleteErr !== null, 'Authenticated users cannot DELETE audit logs (append-only)');
  }

  // --- CLEANUP TEST FIXTURES ---
  console.log('\n--- CLEANING UP TEMPORARY SECURITY TEST USERS ---');
  await serviceClient.from('articles').delete().eq('id', draftArticle.id);
  await serviceClient.auth.admin.deleteUser(researcherId);
  await serviceClient.auth.admin.deleteUser(editorId);
  await serviceClient.from('profiles').delete().in('id', [researcherId, editorId]);

  console.log('\n=====================================================');
  console.log(`TOTAL SECURITY TESTS: ${passedCount + failedCount}`);
  console.log(`PASSED: ${passedCount}`);
  console.log(`FAILED: ${failedCount}`);
  console.log('=====================================================');

  if (failedCount > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Security test suite fatal error:', err);
  process.exit(1);
});
