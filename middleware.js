import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/forum(.*)',
]);

function isClerkRedirectArtifact(err) {
  if (!err) return false;
  if (err instanceof Error && typeof err.message === 'string' && err.message.includes('NEXT_REDIRECT')) return true;
  if (typeof err === 'string' && err.includes('NEXT_REDIRECT')) return true;
  if (typeof err === 'object') {
    const probe = err?.digest || err?.clerk_digest || err?.message || '';
    if (typeof probe === 'string' && (probe.includes('NEXT_REDIRECT') || probe.includes('NEXT_HTTP_ERROR_FALLBACK'))) return true;
  }
  return false;
}

export default clerkMiddleware(async (auth, req) => {
  try {
    if (isProtectedRoute(req)) {
      // await so thrown redirect/fallback is caught by try/catch
      await auth.protect();
    }
  } catch (err) {
    if (isClerkRedirectArtifact(err)) {
      // ignore dev-time redirect/fallback noise
      return;
    }
    throw err;
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};