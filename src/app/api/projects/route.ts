import { NextResponse } from "next/server";
import db from "@/lib/database";
import { createProject, Project } from "@/lib/projects";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing project ID" }, { status: 400 });
  }

  try {
    const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(id) as Project;

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "DB Error", detail: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { user_id, name, description, due_date, goal_time } = await req.json();

  try {

    const result = createProject({ user_id, name, description, due_date, goal_time });

    return NextResponse.json({ project_id : result }, { status: 201 });

  } catch (error: any) {
    if (error.message === "Missing fields") {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    else if (error.message === "Failed to create project") {
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
    else {
      return NextResponse.json({ error: "Internal server error", detail: String(error) }, { status: 500 });
    }
  }
}