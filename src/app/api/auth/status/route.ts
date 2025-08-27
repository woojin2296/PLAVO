import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/session";

export async function GET() {
  const session = await verifySessionToken(cookies().get(AUTH_COOKIE_NAME)?.value);

  if (!session) {
    return NextResponse.json({ ok: false }, {
      status: 401,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return NextResponse.json(
    { ok: true, userId: session.userId, email: session.email },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}
