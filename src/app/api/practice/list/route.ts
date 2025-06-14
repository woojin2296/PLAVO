import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const project_id = searchParams.get("project_id");
    if (!project_id) {
        return NextResponse.json({ error: "Missing project_id" }, { status: 400 });
    }
    try {
        const practices = db.prepare(`
            SELECT * FROM practices WHERE project_id = ?
        `).all(project_id);

        if (practices.length === 0) {
            return NextResponse.json({ error: "No practices found" }, { status: 404 });
        }

        return NextResponse.json({ practices }, { status: 200 });
    }
    catch (e) {
        return NextResponse.json({ error: "DB Error", detail: String(e) }, { status: 500 });
    }
}
