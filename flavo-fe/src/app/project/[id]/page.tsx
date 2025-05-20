import { ProjectHeader } from "@/components/Header";
import { ProjectInfoSection, RecentPracticeSection, RecentQnASection } from "@/components/Project";

export default function Project() {
  const data = {
    id: "1",
    name: "졸업작품",
    description: "실시간 발표 분석을 통한 AI 피드백 플랫폼 개발",
    due_date: "2025-05-23",
    goal_time: 5,
    practice_count: 17,
    total_score: 88,
    speed_score: 23,
    pose_score: 26,
    qna_score: 28,
    pronunciation_score: 30,
    created_at: "2023-01-01",
    completed_at: "2023-12-01",
    last_practiced_at: "2023-11-01",
  }
  return (
    <div className="flex flex-col">
      <ProjectHeader />
      <div className="pt-20">
        <ProjectInfoSection
          data={data}
        />
        <RecentPracticeSection />
        <RecentQnASection />
      </div>
    </div>
  );
}
