import fs from 'node:fs';
import { execSync, spawnSync } from 'node:child_process';

const EXPECTED_ACCOUNT_ID = 'f542683e97458480452b0b8ef37a898a';
const EXPECTED_SUBDOMAIN = '8002salman.workers.dev';

console.log('=====================================================');
console.log('SIGNAL DESK SECURE DEPLOYMENT PIPELINE');
console.log('=====================================================');

// 1. Preflight guard: wrangler.jsonc pinned
const wranglerContent = fs.readFileSync('wrangler.jsonc', 'utf8');
if (!wranglerContent.includes(`"account_id": "${EXPECTED_ACCOUNT_ID}"`)) {
  console.error(`FATAL GUARD ERROR: wrangler.jsonc does not have pinned account_id: "${EXPECTED_ACCOUNT_ID}"`);
  process.exit(1);
}
console.log(`[PASS] Config check: wrangler.jsonc pinned to ${EXPECTED_ACCOUNT_ID}`);

// 2. Load token from .env.local
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
  console.error('FATAL GUARD ERROR: No CLOUDFLARE_API_TOKEN found.');
  process.exit(1);
}

// 3. Preflight identity verification with Wrangler
console.log('Verifying authenticated Cloudflare identity with Wrangler...');
const whoami = execSync('npx wrangler whoami', {
  env: { ...process.env, CLOUDFLARE_API_TOKEN: token },
  encoding: 'utf8',
  stdio: ['pipe', 'pipe', 'pipe']
});

if (!whoami.includes(EXPECTED_ACCOUNT_ID)) {
  console.error(`FATAL GUARD ERROR: Authenticated Cloudflare account does NOT match target Account ID: ${EXPECTED_ACCOUNT_ID}`);
  process.exit(1);
}

console.log(`[PASS] Account identity verified: ${EXPECTED_ACCOUNT_ID} (${EXPECTED_SUBDOMAIN})`);
console.log('Starting deployment to target Cloudflare account...\n');

// 4. Execute wrangler deploy with target environment
const args = process.argv.slice(2);
const deployResult = spawnSync('npx', ['wrangler', 'deploy', ...args], {
  env: { ...process.env, CLOUDFLARE_API_TOKEN: token },
  stdio: 'inherit',
  shell: true
});

if (deployResult.status !== 0) {
  console.error(`Deployment failed with exit code: ${deployResult.status}`);
  process.exit(deployResult.status || 1);
}

console.log('\n=====================================================');
console.log(`[PASS] Signal Desk successfully deployed to ${EXPECTED_SUBDOMAIN}`);
console.log('=====================================================');
