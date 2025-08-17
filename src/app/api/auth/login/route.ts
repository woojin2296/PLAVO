import { User, varifyUser } from "@/lib/users";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {

    const user = await varifyUser(email, password) as User;
    
    const res = NextResponse.json({ ok: true });

    res.cookies.set("user_id", String(user.id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;

  } catch (error: any) {

    if (error.message === "Missing email or password") {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }
    else if (error.message === "Invalid credentials") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    else if (error.message === "Database error") {
      return NextResponse.json({ error: "Database error", detail: String(error) }, { status: 500 });
    }
    else {
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

  }
}