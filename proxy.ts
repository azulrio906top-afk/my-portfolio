import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export default auth((request) => {
  const { pathname } = request.nextUrl;

  const isAdminRoute =
    pathname === '/admin' ||
    pathname.startsWith('/admin/');

  const isLoginRoute =
    pathname === '/admin/login';

  if (!isAdminRoute || isLoginRoute) {
    return NextResponse.next();
  }

  if (!request.auth?.user) {
    const loginUrl = new URL(
      '/admin/login',
      request.url,
    );

    loginUrl.searchParams.set(
      'callbackUrl',
      pathname,
    );

    return NextResponse.redirect(loginUrl);
  }

  const user = request.auth.user;

  const role =
    "role" in user &&
      typeof user.role === "string"
      ? user.role
      : undefined;

  if (role !== "admin") {
    return NextResponse.redirect(
      new URL("/", request.url),
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};