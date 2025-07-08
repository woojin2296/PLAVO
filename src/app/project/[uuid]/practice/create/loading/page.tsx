"use client";

import { ChevronLeft, House } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const project_uuid = sessionStorage.getItem("project_uuid");
      const practice_id = sessionStorage.getItem("practice_id");
      const res = await fetch("http://soboroo.tplinkdns.com:8000/generate_report", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          practice_id: practice_id,
        }) 
      });

      console.log(res.status, res.statusText);
      const result = await res.json();
      
      console.log("Transcription Result:", result);

      const speed_score = Math.round(result.speech_rate_score.predicted_score * 20);
      const pose_score = Math.round(100 - (result.action_report.length * 2));
      const pronunciation_score = Math.round(result.transcription.segments.reduce((sum: number, segment: any) => sum + segment.confidence, 0) / result.transcription.segments.length * 100);
      const total_score = Math.round((speed_score + pose_score + pronunciation_score) / 3);

      const res2 = await fetch("/api/practice", {
        method: "POST",
        body: JSON.stringify({
          project_id: project_uuid,
          user_id: sessionStorage.getItem("user_sub"),
          practice_id: practice_id,
          total_score: total_score,
          speed_score: speed_score,
          pose_score: pose_score,
          pronunciation_score: pronunciation_score,
          speaking_speed_analysis_speed_by_time_slot : result.speech_coaching_report.speaking_speed_analysis.speed_by_time_slot,
          speaking_speed_analysis_average_speed: result.speech_coaching_report.speaking_speed_analysis.average_speed,
          speaking_speed_analysis_speed_variation: result.speech_coaching_report.speaking_speed_analysis.speed_variation,
          improvements_and_feedback_areas_for_improvement_speaking_speed: result.speech_coaching_report.improvements_and_feedback.areas_for_improvement.speaking_speed,
          improvements_and_feedback_areas_for_improvement_presentation_content: result.speech_coaching_report.improvements_and_feedback.areas_for_improvement.presentation_content,
          improvements_and_feedback_strengths_speaking_speed: result.speech_coaching_report.improvements_and_feedback.strengths.speaking_speed,
          improvements_and_feedback_strengths_presentation_content: result.speech_coaching_report.improvements_and_feedback.strengths.presentation_content,
          additional_practice_recommendations_for_improvement_pronunciation_practice_materials: result.speech_coaching_report.additional_practice_recommendations_for_improvement.pronunciation_practice_materials,
          additional_practice_recommendations_for_improvement_speed_control_practice: result.speech_coaching_report.additional_practice_recommendations_for_improvement.speed_control_practice,
          recommended_next_steps_set_next_goals: result.speech_coaching_report.recommended_next_steps.set_next_goals,
          content_feedback_feedback_and_improvements_on_content: result.speech_coaching_report.content_feedback.feedback_and_improvements_on_content,
          pose_list: JSON.stringify(result.action_report)
        })
      });

      console.log("Practice created:", await res2.json());

      const res3 = await fetch("/api/project?project_uuid=" + project_uuid, {
        method: "PATCH",
        body: JSON.stringify({
          practice_count: 1,
          total_score: total_score,
          speed_score: speed_score,
          pose_score: pose_score,
          pronunciation_score: pronunciation_score
        })
      });
      
      console.log("Project updated:", await res3.json());

      router.push("/project/" + project_uuid + "/practice/" + practice_id);
    }

    setTimeout(() => {
      fetchData();
    }, 3000);
  }, []);
  
  return (
    <div className="flex flex-col">
      <ProjectCreateHeader />
      <div className="pt-20 flex flex-col items-center justify-center h-[1500px]">
        <div className="flex items-end justify-between text-4xl pt-8 p-4 text-text_default">
          연습을 생성하는 중입니다!
        </div>
        <div className="flex items-end justify-between text-4xl pt-8 p-4 text-text_default">
          잠시만 기다려주세요.
        </div>
      </div>
    </div>
  );
}

function ProjectCreateHeader() {
  return (
    <header className="fixed top-0 left-0 px-8 py-4 w-full h-24 z-50 bg-[#F3F4F6] flex items-center justify-between">
      <Link href={"/"}><ChevronLeft className="w-8 h-8 text-icon_default" /></Link>
      <span className="text-2xl text-icon_default">프로젝트 생성</span>
      <Link href={"/"}><House className="w-8 h-8 text-icon_default" /></Link>
    </header>
  );
}