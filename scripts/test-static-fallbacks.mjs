import { articleRepository } from '../src/services/database/supabase.ts';

console.log('=====================================================');
console.log('SIGNAL DESK — STATIC FALLBACK REMOVAL VERIFICATION');
console.log('=====================================================');

let passed = 0;
let failed = 0;

function assert(cond, name) {
  if (cond) {
    console.log(`[PASS] ${name}`);
    passed++;
  } else {
    console.error(`[FAIL] ${name}`);
    failed++;
  }
}

async function run() {
  // 1. Missing slug must return null, NOT static demo fallback
  const missingSlug = 'completely-non-existent-slug-12345';
  const resMissing = await articleRepository.getBySlug(missingSlug);
  assert(resMissing === null, 'Missing slug returns null instead of falling back to static articles');

  // 2. Missing ID must return null, NOT static demo fallback
  const missingId = '00000000-0000-0000-0000-000000000000';
  const resId = await articleRepository.getById(missingId);
  assert(resId === null, 'Missing ID returns null instead of falling back to static articles');

  // 3. Unpublished article query simulation
  const draftSlug = 'unpublished-draft-story';
  const resDraft = await articleRepository.getBySlug(draftSlug);
  assert(resDraft === null, 'Unpublished slug returns null');

  // 4. Query with filter that yields 0 records returns { data: [], count: 0 }, not full static fallback array
  const emptyFilterRes = await articleRepository.list({ category: 'non-existent-category-filter' });
  assert(Array.isArray(emptyFilterRes.data), 'Returns an array of articles');
  assert(emptyFilterRes.data.length === 0, `Returns empty array [] (got length ${emptyFilterRes.data.length})`);
  assert(emptyFilterRes.count === 0, `Count is 0 (got ${emptyFilterRes.count})`);

  console.log('=====================================================');
  console.log(`TOTAL STATIC FALLBACK TESTS: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log('=====================================================');

  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
