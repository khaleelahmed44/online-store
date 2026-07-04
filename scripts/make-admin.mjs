/**
 * Promotes a user to admin by email.
 * Usage: node scripts/make-admin.mjs ahmedkhaleel0313@gmail.com
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/make-admin.mjs <email>');
  process.exit(1);
}

function loadEnvLocal() {
  const envPath = resolve(root, '.env.local');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    const val = trimmed.slice(eq + 1);
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const url = process.env.DATABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function viaPostgres() {
  const { default: pg } = await import('pg');
  const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const userRes = await client.query(
    `SELECT id, email FROM auth.users WHERE email = $1 LIMIT 1`,
    [email]
  );

  if (!userRes.rows.length) {
    throw new Error(`No auth user found for ${email}. Sign up in the app first.`);
  }

  const { id, email: foundEmail } = userRes.rows[0];

  await client.query(
    `INSERT INTO public.profiles (id, full_name, is_admin)
     VALUES ($1, $2, true)
     ON CONFLICT (id) DO UPDATE SET is_admin = true`,
    [id, foundEmail.split('@')[0]]
  );

  const check = await client.query(
    `SELECT id, full_name, is_admin FROM public.profiles WHERE id = $1`,
    [id]
  );

  await client.end();
  return check.rows[0];
}

async function viaServiceRole() {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) throw listError;

  const user = users.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error(`No auth user found for ${email}. Sign up in the app first.`);
  }

  const { error: upsertError } = await supabase.from('profiles').upsert(
    { id: user.id, full_name: email.split('@')[0], is_admin: true },
    { onConflict: 'id' }
  );
  if (upsertError) throw upsertError;

  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('id, full_name, is_admin')
    .eq('id', user.id)
    .single();
  if (fetchError) throw fetchError;
  return profile;
}

try {
  let profile;
  if (url && !url.includes('[YOUR-PASSWORD]')) {
    console.log('Using DATABASE_URL…');
    profile = await viaPostgres();
  } else if (serviceKey) {
    console.log('Using SUPABASE_SERVICE_ROLE_KEY…');
    profile = await viaServiceRole();
  } else {
    console.log('\nCannot run automatically — add one of these to .env.local:\n');
    console.log('  DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.czmpnjjmwtnxumjgryyw.supabase.co:5432/postgres');
    console.log('  SUPABASE_SERVICE_ROLE_KEY=eyJ...\n');
    console.log('Or paste this in Supabase SQL Editor:\n');
    console.log(`INSERT INTO public.profiles (id, full_name, is_admin)
SELECT id, split_part(email, '@', 1), true
FROM auth.users
WHERE email = '${email}'
ON CONFLICT (id) DO UPDATE SET is_admin = true;`);
    process.exit(1);
  }

  console.log('\n✅ Admin granted successfully:');
  console.log(profile);
  console.log(`\nLog in at http://localhost:3000/admin/login with ${email}`);
} catch (err) {
  console.error('\n❌', err.message);
  process.exit(1);
}
