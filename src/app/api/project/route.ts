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

export async function PATCH(req: Request) {
    const { practice_count, total_score, speed_score, pose_score, pronunciation_score } = await req.json();
    
    const { searchParams } = new URL(req.url);
    const uuid = searchParams.get("project_uuid");

    if (!uuid) {
        console.error("Missing project_uuid in request");
        return NextResponse.json({ error: "Missing project_uuid" }, { status: 400 });
    }

    if (practice_count === undefined || total_score === undefined || speed_score === undefined || pose_score === undefined || pronunciation_score === undefined) {
        console.error("Missing required fields in request body");
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    try {
        const project_pre : any= db.prepare("SELECT * FROM projects WHERE uuid = ?").get(uuid);
        if (!project_pre) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const change_total_score = (project_pre.total_score * project_pre.practice_count + total_score) / (project_pre.practice_count + 1);
        const change_speed_score = (project_pre.speed_score * project_pre.practice_count + speed_score) / (project_pre.practice_count + 1);
        const change_pose_score = (project_pre.pose_score * project_pre.practice_count + pose_score) / (project_pre.practice_count + 1);

        const result = db.prepare(`
            UPDATE projects
            SET practice_count = practice_count + 1,
                total_score = ?,
                speed_score = ?,
                pose_score = ?,
                pronunciation_score = ?
            WHERE uuid = ?
        `).run(change_total_score, change_speed_score, change_pose_score, pronunciation_score, uuid);

        if (result.changes === 0) {
            return NextResponse.json({ error: "Project not found or no changes made" }, { status: 404 });
        }

        const project = db
            .prepare("SELECT * FROM projects WHERE uuid = ?")
            .get(uuid);

        return NextResponse.json({ project }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ error: "DB Error", detail: String(e) }, { status: 500 });
    }
}