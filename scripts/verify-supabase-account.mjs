import fs from 'node:fs';
import https from 'node:https';

// 1. Read token safely from .env.local
let token;
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^\s*SUPABASE_ACCESS_TOKEN\s*=\s*"?([^"\r\n]*)"?\s*$/);
    if (match && match[1]) {
      token = match[1];
      break;
    }
  }
}

if (!token) {
  console.error('ERROR: No SUPABASE_ACCESS_TOKEN found in .env.local');
  process.exit(1);
}

function supabaseApi(endpoint) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.supabase.com',
      path: endpoint,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'SignalDesk-Verification'
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
    req.end();
  });
}

async function run() {
  console.log('=== VERIFYING SUPABASE ACCOUNT & ORGANIZATIONS ===');

  // List Organizations
  const orgsRes = await supabaseApi('/v1/organizations');
  console.log('Organizations API Status:', orgsRes.status);
  if (orgsRes.status !== 200) {
    console.error('Failed to fetch organizations:', orgsRes);
    process.exit(1);
  }

  const orgs = orgsRes.json;
  console.log(`Found ${orgs.length} organization(s):`);
  for (const org of orgs) {
    console.log(`- Org Name: "${org.name}", ID: "${org.id}", Plan: "${org.plan || 'N/A'}"`);
  }

  // List Projects
  const projectsRes = await supabaseApi('/v1/projects');
  console.log('\nProjects API Status:', projectsRes.status);
  if (projectsRes.status !== 200) {
    console.error('Failed to fetch projects:', projectsRes);
    process.exit(1);
  }

  const projects = projectsRes.json;
  console.log(`Found ${projects.length} project(s):`);
  for (const p of projects) {
    console.log(`- Project: "${p.name}", ID: "${p.id}", Org ID: "${p.organization_id}", Region: "${p.region}", Status: "${p.status}"`);
  }
}

run().catch(err => {
  console.error('Error during Supabase verification:', err);
  process.exit(1);
});
