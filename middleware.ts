import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtected = createRouteMatcher([
  "/onboarding(.*)",
  "/dashboard(.*)",
  "/projects(.*)",
  "/analytics(.*)",
  "/team(.*)"
])

export default clerkMiddleware(async (auth, req) => {
    // Get the auth object
    const { userId } = await auth();
    
    // If the route is protected and user is not authenticated, redirect to sign in
    if (isProtected(req) && !userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};