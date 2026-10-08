import fs from 'node:fs';
import { execSync } from 'node:child_process';

// Load .env.local safely
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envFile.split('\n')) {
  const match = line.match(/^\s*([\w]+)\s*=\s*"?([^"\r\n]*)"?\s*$/);
  if (match) {
    env[match[1]] = match[2];
  }
}

const token = env.CLOUDFLARE_API_TOKEN;
const expectedAccountId = env.CLOUDFLARE_ACCOUNT_ID || 'f542683e97458480452b0b8ef37a898a';

if (!token) {
  console.error('ERROR: No CLOUDFLARE_API_TOKEN found in .env.local');
  process.exit(1);
}

console.log('Running wrangler whoami with Signal Desk token...');
try {
  const output = execSync('npx wrangler whoami', {
    env: { ...process.env, CLOUDFLARE_API_TOKEN: token },
    encoding: 'utf8'
  });

  // Sanitize any potential token prints in output if any
  const sanitized = output.replace(/cfat_[a-zA-Z0-9_-]+/g, '[REDACTED_TOKEN]');
  console.log(sanitized);

  if (output.includes(expectedAccountId)) {
    console.log(`SUCCESS: Authenticated account matches expected Account ID: ${expectedAccountId}`);
  } else {
    console.error(`FATAL: Authenticated account does NOT match expected Account ID ${expectedAccountId}`);
    process.exit(1);
  }
} catch (err) {
  console.error('Failed to run wrangler whoami:', err.message);
  process.exit(1);
}
