import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const AUTH_ORIGIN = process.env.NEXT_PUBLIC_QSX_AUTH_ORIGIN || "https://qsxweb.vercel.app";

const isPublicRoute = createRouteMatcher([
  "/",
  "/landing",
  "/pricing",
  "/login",
  "/signin",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
  "/_next(.*)",
  "/favicon.ico",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/robots.txt",
  "/bg-stars.jpg",
]);

export default clerkMiddleware(async (auth, req) => {
  const host = req.headers.get("host") || "";
  const pathname = req.nextUrl.pathname;

  // Custom domain auth redirect: redirect /sign-in and /sign-up to AUTH_ORIGIN
  const isCustomDomain = host.includes("quantscopex.com");
  const isAuthPath = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  if (isCustomDomain && isAuthPath) {
    const currentOrigin = `https://${host}`;
    const redirectUrl = encodeURIComponent(currentOrigin + "/today");
    const targetUrl = `${AUTH_ORIGIN}${pathname}?redirect_url=${redirectUrl}`;
    return NextResponse.redirect(targetUrl, 307);
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
