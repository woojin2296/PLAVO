import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/session";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  res.cookies.set("user_id", "", {
    maxAge: 0,
    path: "/",
  });
  return res;
}
