import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { isUserAdmin } from '@/lib/auth/admin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (not the login page).
  if (!pathname.startsWith('/admin') || pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  const { supabase, user, supabaseResponse } = await updateSession(request);

  if (!user) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const admin = await isUserAdmin(supabase, user.id);

  if (!admin) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('error', 'unauthorized');
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin', '/admin/((?!login).*)'],
};
