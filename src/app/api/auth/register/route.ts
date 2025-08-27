import { createUser } from "@/lib/users";
import { AUTH_COOKIE_NAME, createSessionToken, SESSION_TTL_SECONDS } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  try {
    const result = await createUser({ email, password, name });
    const token = await createSessionToken({ userId: Number(result), email });
    
    const res = NextResponse.json({ ok: true });

    res.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });

    return res;

  } catch (error: any) {
    if (error.message === "Missing fields") {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    else if (error.message === "User already exists") {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }
    else if (error.message === "Failed to create user") {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
    else {
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
}
