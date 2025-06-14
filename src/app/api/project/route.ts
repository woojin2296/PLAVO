import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const uuid = searchParams.get("uuid");

    if (!uuid) {
        return NextResponse.json({ error: "Missing UUID" }, { status: 400 });
    }

    try {
        const project = db
            .prepare("SELECT * FROM projects WHERE uuid = ?")
            .get(uuid);

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({ project }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ error: "DB Error", detail: String(e) }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const { uuid, user_id, name, description, goal_time, due_date, script } = await req.json();

    if (!uuid || !name || !goal_time || !due_date) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    console.log("Creating project with UUID:", uuid);
    console.log("User ID:", user_id);
    console.log("Project Name:", name);
    console.log("Description:", description);
    console.log("Goal Time:", goal_time);
    console.log("Due Date:", due_date);
    console.log("Script:", script);

    try {
        const result = db.prepare(`
            INSERT INTO projects (uuid, user_id, name, description, goal_time, due_date, script)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(uuid, user_id, name, description, goal_time, due_date, script);

        console.log("Project created with ID:", result);

        const project = db
            .prepare("SELECT * FROM projects WHERE uuid = ?")
            .get(uuid);

        return NextResponse.json({ project }, { status: 201 });
    } catch (e) {
        return NextResponse.json({ error: "DB Error", detail: String(e) }, { status: 500 });
    }
}