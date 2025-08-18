// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "file required" }, { status: 400 });

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
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "upload failed" }, { status: 500 });
  }
}