import { NextResponse } from "next/server";
import db from "@/lib/database";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

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