import { AUTH_COOKIE_NAME, createSessionToken, SESSION_TTL_SECONDS } from "@/lib/session";
import { verifyUser } from "@/lib/users";
import { NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/apiAuth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {

    const user = await verifyUser(email, password);
    const token = await createSessionToken({ userId: user.id, email: user.email });
    
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

    if (message === "Missing email or password") {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }
    else if (message === "Invalid credentials") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    else if (message.startsWith("Database error")) {
      return NextResponse.json({ error: "Database error", detail: String(error) }, { status: 500 });
    }
    else {
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

  }
}
