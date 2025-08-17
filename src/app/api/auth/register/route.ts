import { createUser } from "@/lib/users";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  try {
    const result = await createUser({ email, password, name });
    
    const res = NextResponse.json({ ok: true });

    res.cookies.set("user_id", String(result), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
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