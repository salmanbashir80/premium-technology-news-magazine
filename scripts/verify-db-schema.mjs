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
        'User-Agent': 'SignalDesk-Verify'
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

async function verify() {
  console.log('=== VERIFYING SUPABASE DATABASE SCHEMA ===');

  const tablesRes = await runQuery(`
    SELECT tablename, rowsecurity 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    ORDER BY tablename;
  `);

  console.log('Tables query status:', tablesRes.status);
  console.log('Tables response structure:', typeof tablesRes.json, Object.keys(tablesRes.json || {}));
  console.log('Tables in public schema:');
  const rows = Array.isArray(tablesRes.json) ? tablesRes.json : (tablesRes.json?.result || tablesRes.json?.data || []);
  rows.forEach(r => {
    console.log(` - Table: ${r.tablename.padEnd(22)} | RLS Enabled: ${r.rowsecurity}`);
  });
  console.log(`Total tables found: ${rows.length}`);
}

verify().catch(console.error);
