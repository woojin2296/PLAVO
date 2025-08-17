import { NextResponse } from "next/server";
import { createProject, getOngoingProjectsByUserId, getProjectsByUserId } from "@/lib/projects";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");
  const isOngoing = searchParams.get("ongoing");

  try {

    if (isOngoing === "true") {
      const projects = await getOngoingProjectsByUserId(Number(userId));
      return NextResponse.json({ projects }, { status: 200 });
    }
    else {
      const projects = await getProjectsByUserId(Number(userId));
      return NextResponse.json({ projects }, { status: 200 });
    }
    
  } catch (error: any) {

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
  const { user_id, name, description, due_date, goal_time } = await req.json();

  try {

    const result = await createProject({ user_id, name, description, due_date, goal_time });

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