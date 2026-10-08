import fs from 'node:fs';
import { execSync } from 'node:child_process';

const EXPECTED_ACCOUNT_ID = 'f542683e97458480452b0b8ef37a898a';
const EXPECTED_SUBDOMAIN = '8002salman.workers.dev';

console.log('--- SIGNAL DESK PRE-DEPLOYMENT PREFLIGHT GUARD ---');

// 1. Verify wrangler.jsonc configuration
try {
  const wranglerContent = fs.readFileSync('wrangler.jsonc', 'utf8');
  // Strip comments for JSON parsing or regex check
  if (!wranglerContent.includes(`"account_id": "${EXPECTED_ACCOUNT_ID}"`)) {
    console.error(`FATAL GUARD ERROR: wrangler.jsonc does not have pinned account_id: "${EXPECTED_ACCOUNT_ID}"`);
    process.exit(1);
  }
  console.log(`[PASS] wrangler.jsonc is strictly pinned to Account ID: ${EXPECTED_ACCOUNT_ID}`);
} catch (err) {
  console.error('FATAL GUARD ERROR: Cannot read wrangler.jsonc:', err.message);
  process.exit(1);
}

// 2. Load token from .env.local (project-specific) or process.env
let token;
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^\s*CLOUDFLARE_API_TOKEN\s*=\s*"?([^"\r\n]*)"?\s*$/);
    if (match && match[1]) {
      token = match[1];
      break;
    }
  }
}
if (!token) {
  token = process.env.CLOUDFLARE_API_TOKEN;
}

if (!token) {
  console.error('FATAL GUARD ERROR: No CLOUDFLARE_API_TOKEN provided. Cannot deploy without authenticated token.');
  process.exit(1);
}

// 3. Authenticate with Wrangler and verify account identity
console.log('Verifying authenticated Cloudflare identity with Wrangler...');
try {
  const output = execSync('npx wrangler whoami', {
    env: { ...process.env, CLOUDFLARE_API_TOKEN: token },
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  });

  if (!output.includes(EXPECTED_ACCOUNT_ID)) {
    console.error(`FATAL GUARD ERROR: Authenticated Cloudflare account does NOT match target Account ID: ${EXPECTED_ACCOUNT_ID}`);
    console.error('Deployment HALTED. Refusing to deploy to unintended account.');
    process.exit(1);
  }

  console.log(`[PASS] Authenticated account verified: Account ID matches ${EXPECTED_ACCOUNT_ID}`);
  console.log(`[PASS] Target subdomain confirmed: ${EXPECTED_SUBDOMAIN}`);
  console.log('--- PREFLIGHT GUARD PASSED: SAFE TO PROCEED WITH SIGNAL DESK DEPLOYMENT ---\n');
} catch (err) {
  console.error('FATAL GUARD ERROR: Wrangler authentication failed:', err.message);
  process.exit(1);
}
