'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { fetchAdminProfile } from '@/lib/auth/admin';
import { STORE } from '@/lib/constants';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(
    searchParams.get('error') === 'unauthorized'
      ? 'Access denied. Admin privileges required.'
      : ''
  );
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError('Sign-in succeeded but no user was returned.');
      setLoading(false);
      return;
    }

    // Session is written to cookies by @supabase/ssr — refresh before profile check.
    await supabase.auth.getSession();

    const { profile, error: profileError } = await fetchAdminProfile(supabase, data.user.id);

    if (profileError) {
      await supabase.auth.signOut();
      setError(profileError);
      setLoading(false);
      return;
    }

    if (!profile?.is_admin) {
      await supabase.auth.signOut();
      setError(
        'Access denied. Your profile exists but is_admin is false. Confirm the UUID in public.profiles matches your auth user.'
      );
      setLoading(false);
      return;
    }

    router.push(searchParams.get('redirect') || '/admin');
    router.refresh();
  };

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-black/10 bg-white p-8 shadow-glow">
      <div className="mb-6 text-center">
        <Lock size={32} className="mx-auto text-ember" />
        <h1 className="mt-4 text-2xl font-black text-charcoal">{STORE.name} Admin</h1>
        <p className="mt-1 text-sm text-charcoal/60">Sign in with your administrator credentials</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-charcoal/60">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-ember"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-charcoal/60">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-ember"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-charcoal py-3 font-bold uppercase tracking-wider text-white transition hover:bg-ember disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
