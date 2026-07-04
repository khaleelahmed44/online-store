import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isUserAdmin } from '@/lib/auth/admin';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const admin = await isUserAdmin(supabase, user.id);
  if (!admin) {
    redirect('/admin/login?error=unauthorized');
  }

  return <AdminDashboard />;
}
