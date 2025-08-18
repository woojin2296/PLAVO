import { getPracticesByProjectId, Practice } from "@/lib/practices";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    
    try {
        const result = await getPracticesByProjectId(Number(id)) as Practice[];
        return NextResponse.json({ practices: result }, { status: 200 });
    
    } catch (error: any) {
    
        if (error.message === "Missing project ID") {
            return NextResponse.json({ error: "Missing project ID" }, { status: 400 });
        }
        else if (error.message.startsWith("Database error")) {
            return NextResponse.json({ error: "Database error", detail: String(error) }, { status: 500 });
        } 
        else {
            return NextResponse.json({ error: "Internal server error", detail: String(error) }, { status: 500 });
        }
    }
    }