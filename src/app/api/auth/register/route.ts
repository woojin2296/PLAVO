import { createUser } from "@/lib/users";
import { AUTH_COOKIE_NAME, createSessionToken, SESSION_TTL_SECONDS } from "@/lib/session";
import { NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/apiAuth";

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

  } catch (error: unknown) {
    const message = getErrorMessage(error);

    if (message === "Missing fields") {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    else if (message === "User already exists") {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }
    else if (message === "Failed to create user") {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
    else {
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
}
