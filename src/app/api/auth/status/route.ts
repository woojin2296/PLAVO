import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const sid = cookies().get("user_id")?.value;

  if (!sid) {
    return NextResponse.json({ ok: false }, {
      status: 401,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return NextResponse.json(
    { ok: true, userId: sid },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}
