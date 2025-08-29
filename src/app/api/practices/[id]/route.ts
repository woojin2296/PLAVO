import { getErrorMessage, isUnauthorizedError, requireUserId } from "@/lib/apiAuth";
import { getPracticesByProjectId, Practice } from "@/lib/practices";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    
    try {
        const userId = await requireUserId();
        const result = await getPracticesByProjectId(Number(id), userId) as Practice[];
        return NextResponse.json({ practices: result }, { status: 200 });
    
    } catch (error: unknown) {
    
        if (isUnauthorizedError(error)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const message = getErrorMessage(error);
    
        if (message === "Missing project ID") {
            return NextResponse.json({ error: "Missing project ID" }, { status: 400 });
        }
        else if (message.startsWith("Database error")) {
            return NextResponse.json({ error: "Database error", detail: String(error) }, { status: 500 });
        } 
        else {
            return NextResponse.json({ error: "Internal server error", detail: String(error) }, { status: 500 });
        }
    }
    }
