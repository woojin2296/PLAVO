import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sub = searchParams.get("sub");
    if (!sub) {
        return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    try {
        const projects = db
            .prepare("SELECT * FROM projects WHERE user_id = ? ORDER BY due_date ASC")
            .all(sub);
        console.log("Projects fetched for user:", sub, "Count:", projects.length);
        return NextResponse.json({ projects }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ error: "DB Error", detail: String(e) }, { status: 500 });
    }
}
