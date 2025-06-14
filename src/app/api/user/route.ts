import { NextResponse } from "next/server";
import db from "@/lib/db";

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

export async function POST(req: Request) {
  const { name, sub } = await req.json();

  if (!name || !sub) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    db.prepare(`INSERT INTO users (sub, name) VALUES (?, ?)`).run(sub, name);
    const user = db
      .prepare("SELECT * FROM users WHERE sub = ?")
      .get(sub);

    return NextResponse.json({ user }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "DB Error", detail: String(e) }, { status: 500 });
  }
}