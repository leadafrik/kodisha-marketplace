import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client for auth check
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Get current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes that require authentication
  const protectedRoutes = [
    '/host/dashboard',
    '/listing/create',
    '/booking',
    '/messages',
    '/profile',
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // If accessing protected route without session, redirect to login
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Admin-only routes
  const adminRoutes = ['/admin'];
  const isAdminRoute = adminRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAdminRoute && !session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // TODO: Add admin role check if needed
  // if (isAdminRoute && session && !isAdmin(session.user)) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  return response;
}

export const config = {
  matcher: [
    // Protected routes
    '/host/:path*',
    '/listing/create',
    '/booking/:path*',
    '/messages/:path*',
    '/profile/:path*',
    '/admin/:path*',
    // Auth routes
    '/auth/:path*',
  ],
};
