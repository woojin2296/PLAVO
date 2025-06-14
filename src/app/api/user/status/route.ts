import { NextResponse } from "next/server";
import db from "@/lib/db";
import { ProjectInfo } from "@/domain/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sub = searchParams.get("sub");

  if (!sub) {
    return NextResponse.json({ error: "Missing sub" }, { status: 400 });
  }

  try {
    const projects = db.prepare(`
      SELECT * FROM projects 
      WHERE user_id = ? ORDER BY last_practiced_at DESC
    `).all(sub) as ProjectInfo[];

    const practices = db.prepare(`
      SELECT * FROM practices 
      WHERE user_id = ? ORDER BY created_at DESC
    `).all(sub);

    return NextResponse.json({
      name: sub,
      rank: 0,
      total_projects: projects.length,
      completed_projects: 0,
      practice_counts: practices.length,
      total_score: projects.reduce((sum, project) => sum + (project.total_score || 0), 0),
      speed_score: projects.reduce((sum, project) => sum + (project.speed_score || 0), 0),
      pronunciation_score: projects.reduce((sum, project) => sum + (project.pronunciation_score || 0), 0),
      pose_score: projects.reduce((sum, project) => sum + (project.pose_score || 0), 0),
      qna_score: projects.reduce((sum, project) => sum + (project.qna_score || 0), 0),
    }, { status: 200 });

  } catch (e) {
    return NextResponse.json({ error: "DB Error", detail: String(e) }, { status: 500 });
  }
}