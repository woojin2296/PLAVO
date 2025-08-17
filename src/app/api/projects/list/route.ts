import db from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sub = searchParams.get("sub");

  if (!sub) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  try {
    // 오늘 날짜 문자열: YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    const projects = db
      .prepare(
        `SELECT * FROM projects 
         WHERE user_id = ? 
         AND due_date >= ? 
         ORDER BY due_date ASC`
      )
      .all(sub, today);

    console.log("Valid projects for user:", sub, "Count:", projects.length);
    return NextResponse.json({ projects }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "DB Error", detail: String(e) }, { status: 500 });
  }
}