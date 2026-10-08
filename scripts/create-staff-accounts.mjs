import fs from 'node:fs';
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

// Reads credentials safely from .env.local or process.env
let supabaseUrl = process.env.VITE_SUPABASE_URL || '';
let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  for (const line of envContent.split('\n')) {
    const urlMatch = line.match(/^\s*VITE_SUPABASE_URL\s*=\s*"?([^"\r\n]*)"?\s*$/);
    if (urlMatch && urlMatch[1]) supabaseUrl = urlMatch[1].trim();
    const serviceMatch = line.match(/^\s*SUPABASE_SERVICE_ROLE_KEY\s*=\s*"?([^"\r\n]*)"?\s*$/);
    if (serviceMatch && serviceMatch[1]) serviceRoleKey = serviceMatch[1].trim();
  }
}

if (!supabaseUrl || !serviceRoleKey) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY required.');
  process.exit(1);
}

const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

/**
 * Secure invitation-based staff onboarding.
 * Usage: node scripts/create-staff-accounts.mjs <email> <role: OWNER|ADMIN|EDITOR|RESEARCHER> <full_name>
 */
async function inviteStaff(email, role, fullName) {
  if (!email || !role || !fullName) {
    console.log('Usage: node scripts/create-staff-accounts.mjs <email> <role> <full_name>');
    console.log('Allowed roles: OWNER, ADMIN, EDITOR, RESEARCHER');
    return;
  }

  const validRoles = ['OWNER', 'ADMIN', 'EDITOR', 'RESEARCHER'];
  if (!validRoles.includes(role)) {
    console.error(`Invalid role: ${role}. Must be one of ${validRoles.join(', ')}`);
    process.exit(1);
  }

  console.log(`Sending secure invitation to ${email} for role ${role}...`);
  const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
    data: { role, full_name: fullName }
  });

  if (error) {
    console.error(`Invitation failed: ${error.message}`);
    process.exit(1);
  }

  const userId = data.user.id;
  await adminClient.from('profiles').upsert({
    id: userId,
    email,
    full_name: fullName,
    role,
    updated_at: new Date().toISOString()
  });

  console.log(`Invitation sent successfully. Profile created with role ${role}.`);
}

const [,, targetEmail, targetRole, targetName] = process.argv;
if (targetEmail) {
  inviteStaff(targetEmail, targetRole, targetName).catch(console.error);
} else {
  console.log('Administrative Onboarding Tool: Ready. Pass arguments to invite authorized staff.');
}
