import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = '';
let serviceRoleKey = '';

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
  console.error('ERROR: Missing Supabase credentials in .env.local');
  process.exit(1);
}

const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const staffToCreate = [
  {
    email: 'editorial.owner@signaldesk.news',
    password: 'SignalDeskOwnerPass2026!',
    role: 'OWNER',
    full_name: 'Basco Editorial Director',
  },
  {
    email: 'admin@signaldesk.news',
    password: 'SignalDeskAdminPass2026!',
    role: 'ADMIN',
    full_name: 'Managing Editor',
  },
  {
    email: 'maya.ellison@signaldesk.news',
    password: 'SignalDeskEditorPass2026!',
    role: 'EDITOR',
    full_name: 'Maya Ellison',
  },
  {
    email: 'researcher@signaldesk.news',
    password: 'SignalDeskResearchPass2026!',
    role: 'RESEARCHER',
    full_name: 'Hermes Research Agent',
  }
];

async function main() {
  console.log('=== INITIALIZING EDITORIAL STAFF ACCOUNTS ===');

  for (const staff of staffToCreate) {
    console.log(`\nCreating staff account: ${staff.email} (${staff.role})...`);
    
    // Check if user exists
    const { data: usersData } = await adminClient.auth.admin.listUsers();
    const existing = usersData?.users?.find(u => u.email === staff.email);

    let userId;
    if (existing) {
      console.log(`User already exists (ID: ${existing.id}). Updating password and metadata...`);
      userId = existing.id;
      await adminClient.auth.admin.updateUserById(userId, {
        password: staff.password,
        user_metadata: { role: staff.role, full_name: staff.full_name },
        email_confirm: true
      });
    } else {
      const { data, error } = await adminClient.auth.admin.createUser({
        email: staff.email,
        password: staff.password,
        email_confirm: true,
        user_metadata: { role: staff.role, full_name: staff.full_name }
      });

      if (error) {
        console.error(`Error creating user ${staff.email}:`, error.message);
        continue;
      }
      userId = data.user.id;
      console.log(`Created Auth User: ${userId}`);
    }

    // Upsert Profile
    const { error: profError } = await adminClient
      .from('profiles')
      .upsert({
        id: userId,
        email: staff.email,
        full_name: staff.full_name,
        role: staff.role,
        updated_at: new Date().toISOString()
      });

    if (profError) {
      console.error(`Profile error for ${staff.email}:`, profError.message);
    } else {
      console.log(`Profile synced: ${staff.email} -> ${staff.role}`);
    }
  }

  // Verify Profiles
  console.log('\n=== VERIFYING PROFILES IN DATABASE ===');
  const { data: profiles, error: pErr } = await adminClient
    .from('profiles')
    .select('*')
    .order('role');

  if (pErr) console.error('Error fetching profiles:', pErr);
  else {
    profiles.forEach(p => console.log(` - [${p.role.padEnd(10)}] ${p.email} (${p.full_name})`));
  }
}

main().catch(console.error);
