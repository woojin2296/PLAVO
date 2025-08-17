import { NextResponse } from "next/server";
import db from "@/lib/database";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sub = searchParams.get("sub");

  if (!sub) {
    return NextResponse.json({ error: "Missing sub" }, { status: 400 });
  }

  try {
    const user = db.prepare("SELECT * FROM users WHERE sub = ?").get(sub);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    else {
      return NextResponse.json({ user }, { status: 200 });
    }

  } catch (e) {
    return NextResponse.json({ error: "DB Error", detail: String(e) }, { status: 500 });
  }
}