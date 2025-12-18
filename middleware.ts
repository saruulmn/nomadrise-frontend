import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';

const locales = ['en', 'mn'] as const;
const defaultLocale = 'mn' as const;

function getLocale(request: NextRequest): string {
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameLocale) return pathnameLocale;
  
  return defaultLocale;
}

export default auth((request) => {
  const pathname = request.nextUrl.pathname;
  
  // Check if the path is for dashboard (protected route)
  if (pathname.startsWith('/dashboard')) {
    if (!request.auth) {
      const locale = getLocale(request);
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }
  
  // Skip locale redirect for API routes only
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`, request.url)
    );
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|favicon.ico).*)'],
};
