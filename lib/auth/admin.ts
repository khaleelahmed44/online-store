import type { SupabaseClient } from '@supabase/supabase-js';

export type AdminProfile = {
  id: string;
  is_admin: boolean;
  full_name: string | null;
};

/** Query public.profiles for the authenticated user's admin flag. */
export async function fetchAdminProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<{ profile: AdminProfile | null; error: string | null }> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, is_admin, full_name')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    return { profile: null, error: error.message };
  }

  if (!data) {
    return {
      profile: null,
      error: 'No profile row found for this account. Create one in Supabase with your auth user UUID.',
    };
  }

  return { profile: data as AdminProfile, error: null };
}

export async function isUserAdmin(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const { profile } = await fetchAdminProfile(supabase, userId);
  return profile?.is_admin === true;
}
