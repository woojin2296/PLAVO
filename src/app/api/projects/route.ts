import { NextResponse } from "next/server";
import { createProject, getOngoingProjectsByUserId, getProjectsByUserId } from "@/lib/projects";
import { isUnauthorizedError, requireUserId } from "@/lib/apiAuth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const isOngoing = searchParams.get("ongoing");

  try {
    const userId = await requireUserId();

    if (isOngoing === "true") {
      const projects = await getOngoingProjectsByUserId(userId);
      return NextResponse.json({ projects }, { status: 200 });
    }
    else {
      const projects = await getProjectsByUserId(userId);
      return NextResponse.json({ projects }, { status: 200 });
    }
    
  } catch (error: any) {
    if (isUnauthorizedError(error)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error.message === "Missing user ID") {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    } 
    else if (error.message === "Database error") {
      return NextResponse.json({ error: "Database error", detail: String(error) }, { status: 500 });
    } 
    else {
      return NextResponse.json({ error: "Internal server error", detail: String(error) }, { status: 500 });
    }

  }

}

export async function POST(req: Request) {
  const { name, description, due_date, goal_time } = await req.json();

  try {
    const user_id = await requireUserId();

    const result = await createProject({ user_id, name, description, due_date, goal_time });

    return NextResponse.json({ project_id : result }, { status: 201 });

  } catch (error: any) {
    if (isUnauthorizedError(error)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
