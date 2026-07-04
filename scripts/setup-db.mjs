/**
 * Applies the database schema when DATABASE_URL is set in .env.local
 * Usage: npm run db:setup
 *
 * DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.czmpnjjmwtnxumjgryyw.supabase.co:5432/postgres
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

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
if (!url || url.includes('[YOUR-PASSWORD]')) {
  console.log('\n⚠️  DATABASE_URL not set in .env.local');
  console.log('   Add your Postgres password, then run: npm run db:setup\n');
  console.log('   Or paste supabase/schema.sql into the SQL Editor:');
  console.log('   https://supabase.com/dashboard/project/czmpnjjmwtnxumjgryyw/sql/new\n');
  process.exit(0);
}

const { default: pg } = await import('pg');
const sql = readFileSync(resolve(root, 'supabase/schema.sql'), 'utf8');

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  console.log('Connected to Supabase Postgres…');
  await client.query(sql);
  console.log('✅ Schema applied successfully (tables + seed data).');
} catch (err) {
  console.error('❌ Schema setup failed:', err.message);
  process.exit(1);
} finally {
  await client.end();
}

// Verify via REST
const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const { count, error } = await supabase.from('products').select('*', { count: 'exact', head: true });
if (error) {
  console.log('REST check:', error.message);
} else {
  console.log(`✅ ${count} products visible via API.`);
}
