import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const practice_id = searchParams.get("id");

    if (!practice_id) {
        return NextResponse.json({ error: "Missing practice ID" }, { status: 400 });
    }

    try {
        const practice = db
            .prepare("SELECT * FROM practices WHERE id = ?")
            .get(practice_id);

        if (!practice) {
            return NextResponse.json({ error: "Practice not found" }, { status: 404 });
        }

        return NextResponse.json({ practice }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ error: "DB Error", detail: String(e) }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const body = await req.json();
    const { project_id, user_id, practice_id, total_score, speed_score, pose_score, pronunciation_score, speaking_speed_analysis_average_speed, speaking_speed_analysis_speed_by_time_slot, speaking_speed_analysis_speed_variation, improvements_and_feedback_areas_for_improvement_speaking_speed, improvements_and_feedback_areas_for_improvement_presentation_content, improvements_and_feedback_strengths_speaking_speed, improvements_and_feedback_strengths_presentation_content, additional_practice_recommendations_for_improvement_pronunciation_practice_materials, additional_practice_recommendations_for_improvement_speed_control_practice, recommended_next_steps_set_next_goals, content_feedback_feedback_and_improvements_on_content, pose_list } = body;
    
    if (!project_id || !user_id || !practice_id || total_score === undefined || speed_score === undefined || pose_score === undefined || pronunciation_score === undefined || speaking_speed_analysis_average_speed === undefined || speaking_speed_analysis_speed_by_time_slot === undefined || speaking_speed_analysis_speed_variation === undefined || improvements_and_feedback_areas_for_improvement_speaking_speed === undefined || improvements_and_feedback_areas_for_improvement_presentation_content === undefined || improvements_and_feedback_strengths_speaking_speed === undefined || improvements_and_feedback_strengths_presentation_content === undefined || additional_practice_recommendations_for_improvement_pronunciation_practice_materials === undefined || additional_practice_recommendations_for_improvement_speed_control_practice === undefined || recommended_next_steps_set_next_goals === undefined || content_feedback_feedback_and_improvements_on_content === undefined || pose_list === undefined) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const result = db.prepare(`
            INSERT INTO practices (id, user_id, project_id, total_score, speed_score, pose_score, pronunciation_score, speaking_speed_analysis_average_speed, speaking_speed_analysis_speed_by_time_slot, speaking_speed_analysis_speed_variation, improvements_and_feedback_areas_for_improvement_speaking_speed, improvements_and_feedback_areas_for_improvement_presentation_content, improvements_and_feedback_strengths_speaking_speed, improvements_and_feedback_strengths_presentation_content, additional_practice_recommendations_for_improvement_pronunciation_practice_materials, additional_practice_recommendations_for_improvement_speed_control_practice, recommended_next_steps_set_next_goals, content_feedback_feedback_and_improvements_on_content, pose_list)
            VALUES (?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
            .run(practice_id, user_id, project_id, total_score, speed_score, pose_score, pronunciation_score, speaking_speed_analysis_average_speed, speaking_speed_analysis_speed_by_time_slot, speaking_speed_analysis_speed_variation, improvements_and_feedback_areas_for_improvement_speaking_speed, improvements_and_feedback_areas_for_improvement_presentation_content, improvements_and_feedback_strengths_speaking_speed, improvements_and_feedback_strengths_presentation_content, additional_practice_recommendations_for_improvement_pronunciation_practice_materials, additional_practice_recommendations_for_improvement_speed_control_practice, recommended_next_steps_set_next_goals, content_feedback_feedback_and_improvements_on_content, pose_list);
        console.log("Practice created with ID:", result);
        const practice = db
            .prepare("SELECT * FROM practices WHERE id = ?")
            .get(practice_id);
        return NextResponse.json({ practice }, { status: 201 });
    }
    catch (e) {
        console.error("DB Error:", e);
        return NextResponse.json({ error: "DB Error", detail: String(e) }, { status: 500 });
    }
}