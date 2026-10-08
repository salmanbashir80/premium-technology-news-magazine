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
        'User-Agent': 'SignalDesk-StaffInit'
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

async function run() {
  console.log('=== CHECKING AUTH USERS & PROFILES ===');
  const res = await runQuery(`
    SELECT id, email, created_at FROM auth.users;
  `);
  console.log('Auth users:', res.json);

  const profRes = await runQuery(`
    SELECT * FROM public.profiles;
  `);
  console.log('Profiles:', profRes.json);
}

run().catch(console.error);
