// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const session = await verifySessionToken(req.cookies.get(AUTH_COOKIE_NAME)?.value);

  if (!session) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/menu", "/project/:path*", "/practice/:path*"],
};
