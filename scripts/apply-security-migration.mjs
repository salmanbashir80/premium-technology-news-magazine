import fs from 'node:fs';
import https from 'node:https';

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
  console.error('ERROR: SUPABASE_ACCESS_TOKEN or SUPABASE_PROJECT_ID missing in .env.local');
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
        'User-Agent': 'SignalDesk-SecurityMigration'
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

async function main() {
  console.log(`=== RUNNING PHASE 3.1 SECURITY HARDENING MIGRATION ===`);
  console.log(`Target Project: ${projectId}`);

  const migrationFile = 'supabase/migrations/20261008000002_security_hardening.sql';
  if (!fs.existsSync(migrationFile)) {
    console.error(`Migration file not found: ${migrationFile}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationFile, 'utf8');
  console.log(`Loaded security migration SQL (${sql.length} characters). Executing...`);

  const res = await runQuery(sql);
  console.log('API Response Status:', res.status);
  if (res.status === 200 || res.status === 201) {
    console.log('[PASS] Security migration executed successfully!');
  } else {
    console.error('Migration failed with status:', res.status);
    console.error('Details:', res.json || res.raw);
    process.exit(1);
  }

  // Verify is_demo column and triggers
  const verifyRes = await runQuery(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'articles' AND column_name = 'is_demo';
  `);
  console.log('is_demo column verification:', verifyRes.json);

  const trgRes = await runQuery(`
    SELECT trigger_name, event_manipulation, event_object_table
    FROM information_schema.triggers
    WHERE event_object_table IN ('profiles', 'articles');
  `);
  console.log('Active Triggers:', trgRes.json);
}

main().catch(err => {
  console.error('Execution error:', err);
  process.exit(1);
});
