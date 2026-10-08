import fs from 'node:fs';
import https from 'node:https';
import { createServer } from 'vite';

let token = '';
let projectId = '';

if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  for (const line of envContent.split('\n')) {
    const tokenMatch = line.match(/^\s*SUPABASE_ACCESS_TOKEN\s*=\s*"?([^"\r\n]*)"?\s*$/);
    if (tokenMatch && tokenMatch[1]) token = tokenMatch[1].trim();
    const projectMatch = line.match(/^\s*SUPABASE_PROJECT_ID\s*=\s*"?([^"\r\n]*)"?\s*$/);
    if (projectMatch && projectMatch[1]) projectId = projectMatch[1].trim();
  }
}

if (!token || !projectId) {
  console.error('ERROR: Missing credentials in .env.local');
  process.exit(1);
}

function runQuery(sql) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ query: sql });
    const req = https.request({
      hostname: 'api.supabase.com',
      path: `/v1/projects/${projectId}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'User-Agent': 'SignalDesk-Seeder'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function escapeJson(obj) {
  if (obj === null || obj === undefined) return "'[]'::jsonb";
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

function escapeArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return "'{}'::text[]";
  const items = arr.map(s => `"${String(s).replace(/"/g, '\\"')}"`).join(',');
  return `'{${items}}'::text[]`;
}

async function main() {
  console.log('=== SEEDING SUPABASE DATABASE ===');
  console.log(`Target Project: ${projectId}`);

  // 1. Load data via Vite SSR runner
  const viteServer = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    configFile: false
  });

  const categoriesMod = await viteServer.ssrLoadModule('./src/data/categories.ts');
  const authorsMod = await viteServer.ssrLoadModule('./src/data/authors.ts');
  const articlesMod = await viteServer.ssrLoadModule('./src/data/articles.ts');
  const adminMod = await viteServer.ssrLoadModule('./src/data/admin.ts');
  await viteServer.close();

  const categories = categoriesMod.categories;
  const authors = authorsMod.authors;
  const articles = articlesMod.publishedArticles;
  const adminItems = adminMod.initialAdminItems;
  const mediaItems = adminMod.mediaLibrary;
  const automationJobs = adminMod.automationJobs;

  console.log(`Loaded:
  - ${categories.length} categories
  - ${authors.length} authors
  - ${articles.length} articles
  - ${adminItems.length} queue items
  - ${mediaItems.length} media assets
  - ${automationJobs.length} automation jobs`);

  // 2. Insert Categories
  console.log('\n1. Inserting Categories...');
  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    const sql = `
      INSERT INTO public.categories (slug, name, kicker, description, display_order)
      VALUES (${escapeSql(c.slug)}, ${escapeSql(c.name)}, ${escapeSql(c.kicker)}, ${escapeSql(c.description)}, ${i + 1})
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        kicker = EXCLUDED.kicker,
        description = EXCLUDED.description,
        display_order = EXCLUDED.display_order;
    `;
    const res = await runQuery(sql);
    if (res.status >= 300) console.error(`Error inserting category ${c.slug}:`, res);
  }

  // Fetch category UUID map
  const catRes = await runQuery('SELECT id, slug FROM public.categories;');
  const catMap = {};
  const catRows = Array.isArray(catRes.json) ? catRes.json : [];
  catRows.forEach(r => catMap[r.slug] = r.id);

  // 3. Insert Authors
  console.log('\n2. Inserting Authors...');
  for (const a of authors) {
    const sql = `
      INSERT INTO public.authors (slug, name, role, location, bio, expertise, image_url, email, social_x, social_linkedin)
      VALUES (
        ${escapeSql(a.slug)},
        ${escapeSql(a.name)},
        ${escapeSql(a.role)},
        ${escapeSql(a.location)},
        ${escapeSql(a.bio)},
        ${escapeArray(a.expertise)},
        ${escapeSql(a.image)},
        ${escapeSql(a.email)},
        ${escapeSql(a.social?.x || null)},
        ${escapeSql(a.social?.linkedin || null)}
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        bio = EXCLUDED.bio,
        image_url = EXCLUDED.image_url;
    `;
    const res = await runQuery(sql);
    if (res.status >= 300) console.error(`Error inserting author ${a.slug}:`, res);
  }

  // Fetch author UUID map
  const authRes = await runQuery('SELECT id, slug FROM public.authors;');
  const authMap = {};
  const authRows = Array.isArray(authRes.json) ? authRes.json : [];
  authRows.forEach(r => authMap[r.slug] = r.id);

  // 4. Insert Articles
  console.log('\n3. Inserting Articles...');
  let articleCount = 0;
  for (const a of articles) {
    const catId = catMap[a.category];
    const authorId = authMap[a.authorId];
    if (!catId || !authorId) {
      console.warn(`Skipping article ${a.slug}: Missing category (${a.category}) or author (${a.authorId})`);
      continue;
    }

    const sql = `
      INSERT INTO public.articles (
        slug, title, dek, summary, body, featured_image, featured_image_caption, featured_image_credit,
        category_id, author_id, status, is_featured, is_breaking, is_editors_pick, is_trending,
        key_takeaways, reading_time, seo_title, meta_description, canonical_url, published_at
      )
      VALUES (
        ${escapeSql(a.slug)},
        ${escapeSql(a.title)},
        ${escapeSql(a.dek)},
        ${escapeSql(a.excerpt)},
        ${escapeJson(a.body)},
        ${escapeSql(a.featuredImage)},
        ${escapeSql(a.featuredImageCaption || '')},
        ${escapeSql(a.featuredImageCredit || '')},
        ${escapeSql(catId)},
        ${escapeSql(authorId)},
        'published',
        ${Boolean(a.isFeatured)},
        ${Boolean(a.isBreaking)},
        ${Boolean(a.isEditorsPick)},
        ${Boolean(a.isTrending)},
        ${escapeArray(a.keyTakeaways || [])},
        ${Number(a.readingTime || 5)},
        ${escapeSql(`${a.title} — Signal Desk`)},
        ${escapeSql(a.dek || a.excerpt)},
        ${escapeSql(`https://premium-technology-news-magazine.8002salman.workers.dev/${a.category}/${a.slug}`)},
        ${escapeSql(a.publishedAt || new Date().toISOString())}
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        dek = EXCLUDED.dek,
        summary = EXCLUDED.summary,
        body = EXCLUDED.body,
        featured_image = EXCLUDED.featured_image,
        is_featured = EXCLUDED.is_featured,
        is_breaking = EXCLUDED.is_breaking,
        is_editors_pick = EXCLUDED.is_editors_pick,
        is_trending = EXCLUDED.is_trending,
        key_takeaways = EXCLUDED.key_takeaways;
    `;
    const res = await runQuery(sql);
    if (res.status >= 300) {
      console.error(`Error inserting article ${a.slug}:`, res);
    } else {
      articleCount++;
    }
  }
  console.log(`Successfully seeded ${articleCount} articles.`);

  // 5. Insert Story Candidates (Discovery Queue)
  console.log('\n4. Inserting Story Candidates...');
  for (const item of adminItems) {
    const sql = `
      INSERT INTO public.story_candidates (title, source, relevance_score, status, raw_data, discovered_at)
      VALUES (
        ${escapeSql(item.headline)},
        ${escapeSql(item.source)},
        ${(item.score / 100).toFixed(2)},
        ${escapeSql(item.status === 'discovered' ? 'discovered' : 'evaluating')},
        ${escapeJson({ notes: item.notes, category: item.category, assignee: item.assignee })},
        ${escapeSql(item.discoveredAt)}
      );
    `;
    await runQuery(sql);
  }

  // 6. Insert Automation Jobs
  console.log('\n5. Inserting Automation Jobs...');
  const jobTypeMap = {
    'Hermes Research': 'hermes_research',
    'Fact-Check Pipeline': 'fact_check',
    'RSS Scan': 'rss_scan',
    'Social Syndicate': 'social_syndicate',
    'Newsletter Digest': 'newsletter_digest'
  };
  for (const job of automationJobs) {
    const jt = jobTypeMap[job.name] || 'hermes_research';
    const statusMap = {
      'healthy': 'completed',
      'degraded': 'running',
      'paused': 'pending',
      'failed': 'failed'
    };
    const js = statusMap[job.status] || 'pending';
    const sql = `
      INSERT INTO public.automation_jobs (job_type, status, payload, result, started_at, completed_at)
      VALUES (
        ${escapeSql(jt)},
        ${escapeSql(js)},
        ${escapeJson({ name: job.name, system: job.system, note: job.note })},
        ${escapeJson({ lastRun: job.lastRun, nextRun: job.nextRun })},
        ${escapeSql(job.lastRun)},
        ${escapeSql(job.lastRun)}
      );
    `;
    await runQuery(sql);
  }

  // 7. Verify Counts
  console.log('\n=== VERIFYING SEEDED DATABASE COUNTS ===');
  const countsRes = await runQuery(`
    SELECT 'categories' as tbl, count(*) from public.categories
    UNION ALL SELECT 'authors', count(*) from public.authors
    UNION ALL SELECT 'articles', count(*) from public.articles
    UNION ALL SELECT 'story_candidates', count(*) from public.story_candidates
    UNION ALL SELECT 'automation_jobs', count(*) from public.automation_jobs;
  `);

  const counts = Array.isArray(countsRes.json) ? countsRes.json : [];
  counts.forEach(c => console.log(` - ${c.tbl.padEnd(18)} : ${c.count} records`));
  console.log('\nSeeding completed successfully!');
}

main().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
