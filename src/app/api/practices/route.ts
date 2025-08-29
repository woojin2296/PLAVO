import { createPractice, getPracticeById, updatePracticeVideoUrlById } from "@/lib/practices";
import { getErrorMessage, isUnauthorizedError, requireUserId } from "@/lib/apiAuth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { project_id, type, duration, video_url } = await req.json();

  try {
    const user_id = await requireUserId();
    const result = await createPractice({ project_id, user_id, type, duration, video_url });

    return new Response(JSON.stringify({ practice_id: result }), { status: 201 });

  } catch (error: unknown) {
    if (isUnauthorizedError(error)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const message = getErrorMessage(error);

    if (message === "Missing fields") {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    } 
    else if (message.startsWith("Project not found")) {
      return new Response(JSON.stringify({ error: "Project not found" }), { status: 404 });
    }
    else if (message.startsWith("Failed to create practice")) {
      return new Response(JSON.stringify({ error: "Failed to create practice" }), { status: 500 });
    }
    else if (message.startsWith("Database error")) {
      return new Response(JSON.stringify({ error: "Database error", detail: String(error) }), { status: 500 });
    } 
    else {
      return new Response(JSON.stringify({ error: "Internal server error", detail: String(error) }), { status: 500 });
    }
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const practiceId = searchParams.get("practice_id");

  try {
    const userId = await requireUserId();
    const practice = await getPracticeById(Number(practiceId), userId);
    return new Response(JSON.stringify({ practice }), { status: 200 });

  } catch (error: unknown) {
    if (isUnauthorizedError(error)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const message = getErrorMessage(error);

    if (message === "Missing practice ID") {
      return new Response(JSON.stringify({ error: "Missing practice ID" }), { status: 400 });
    }
    else if (message === "Practice not found") {
      return new Response(JSON.stringify({ error: "Practice not found" }), { status: 404 });
    } 
    else if (message.startsWith("Database error")) {
      return new Response(JSON.stringify({ error: "Database error", detail: String(error) }), { status: 500 });
    } 
    else {
      return new Response(JSON.stringify({ error: "Internal server error", detail: String(error) }), { status: 500 });
    }
  }
}

export async function PATCH(req: Request) {
  const { id, video_url } = await req.json();

  try {
    const userId = await requireUserId();
    
    const result = await updatePracticeVideoUrlById(Number(id), userId, video_url);
    return NextResponse.json({ success: result }, { status: 200 });

  } catch (error: unknown) {
    if (isUnauthorizedError(error)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const message = getErrorMessage(error);

    if (message === "Missing practice ID or video URL") {
      return new Response(JSON.stringify({ error: "Missing practice ID or video URL" }), { status: 400 });
    }
    else {
      return new Response(JSON.stringify({ error: "Database error", detail: String(error) }), { status: 500 });
    }
  }
}
