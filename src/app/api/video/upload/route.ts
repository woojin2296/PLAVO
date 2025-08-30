// src/app/api/upload/route.ts
import { getErrorMessage, isUnauthorizedError, requireUserId } from "@/lib/apiAuth";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export async function POST(req: NextRequest) {
  try {
    await requireUserId();

    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "file required" }, { status: 400 });
    if (!ALLOWED_VIDEO_TYPES.has(file.type)) {
      return NextResponse.json({ error: "unsupported video type" }, { status: 415 });
    }
    if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "invalid file size" }, { status: 413 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "video");
    await mkdir(uploadDir, { recursive: true });

    const ext = file.type.includes("mp4") ? "mp4" : "webm";
    const name = `${Date.now()}_${crypto.randomUUID()}.${ext}`;
    const filepath = path.join(uploadDir, name);
    await writeFile(filepath, buffer);

    const video_url = `/video/${name}`;
    return NextResponse.json({ video_url });
  } catch (e: unknown) {
    if (isUnauthorizedError(e)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error(e);
    return NextResponse.json({ error: "upload failed", detail: getErrorMessage(e) }, { status: 500 });
  }
}
