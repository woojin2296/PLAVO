import { ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { ProjectInfo } from "@/lib/types";

export function ProjectListSection() {
  const data = [
    {
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
    },
    {
      id: "2",
      name: "메타버스 경진대회",
      description: "가상 회의 공간에서의 사용자 몰입도 향상 기술",
      due_date: "2025-05-25",
      goal_time: 10,
      practice_count: 2,
      total_score: 47,
      speed_score: 20,
      pose_score: 25,
      qna_score: 22,
      pronunciation_score: 28,
      created_at: "2023-02-01",
      completed_at: "2023-11-01",
      last_practiced_at: "2023-11-01",
    },
    {
      id: "3",
      name: "산학협력 프로젝트",
      description: " 제조 현장을 위한 AI 불량 탐지 솔루션",
      due_date: "2025-05-30",
      goal_time: 15,
      practice_count: 8,
      total_score: 52,
      speed_score: 21,
      pose_score: 24,
      qna_score: 25,
      pronunciation_score: 27,
      created_at: "2023-03-01",
      completed_at: "2023-11-01",
      last_practiced_at: "2023-11-01",
    },
    {
      id: "4",
      name: "AI 경진대회",
      description: "AI 기반의 실시간 발표 분석 시스템",
      due_date: "2025-06-01",
      goal_time: 20,
      practice_count: 12,
      total_score: 92,
      speed_score: 24,
      pose_score: 27,
      qna_score: 30,
      pronunciation_score: 29,
      created_at: "2025-06-03",
      completed_at: "2023-11-01",
      last_practiced_at: "2023-11-01",
    },
    {
      id: "5",
      name: "기계학습 프로젝트",
      description: "딥러닝을 활용한 손글씨 인식 시스템 구현",
      due_date: "2025-06-05",
      goal_time: 12,
      practice_count: 9,
      total_score: 84,
      speed_score: 22,
      pose_score: 25,
      qna_score: 28,
      pronunciation_score: 26,
      created_at: "2025-06-10",
      completed_at: "2023-11-01",
      last_practiced_at: "2023-11-01",
    },
    {
      id: "6",
      name: "UX 해커톤",
      description: "사용자 행동 분석을 통한 UI 개선 실험",
      due_date: "2025-06-13",
      goal_time: 6,
      practice_count: 4,
      total_score: 67,
      speed_score: 20,
      pose_score: 23,
      qna_score: 25,
      pronunciation_score: 24,
      created_at: "2023-06-01",
      completed_at: "2023-11-01",
      last_practiced_at: "2023-11-01",
    },
    {
      id: "7",
      name: "공공데이터 공모전",
      description: "서울시 교통 데이터를 활용한 혼잡도 예측 시스템",
      due_date: "2025-06-15",
      goal_time: 8,
      practice_count: 5,
      total_score: 73,
      speed_score: 22,
      pose_score: 24,
      qna_score: 26,
      pronunciation_score: 25,
      created_at: "2023-07-01",
      completed_at: "2023-10-01",
      last_practiced_at: "2023-10-01",
    },
  ]
  return (
    <div className="flex flex-col gap-4">
      {
        data.length != 0 ? data.map((project) => (
          <Link key={project.id} href={`/project/${project.id}`}>
            <ProjectCard key={project.id} data={project} />
          </Link>
        )) : (
            <div className="text-center text-2xl text-text_sub">진행중인 프로젝트가 없습니다.</div>
        )
      }
    </div>
  )
}

export function ProjectCard({ data }: { data: ProjectInfo }) {
  return (
    <Card>
      <Link key={data.id} href={`/project/${data.id}`}>
        <CardHeader className="flex flex-row pt-6 pb-4 pr-0 items-center">
          <div className="flex flex-col w-full">
            <div className="flex">
              <div className="w-1/2">
                <CardTitle className="text-3xl text-text_default">{data.name}</CardTitle>
                <CardDescription className="text-xl text-text_sub">{data.description}</CardDescription>
              </div>
              <div className="flex w-1/2 items-center justify-center text-center">
                <div className="w-1/3">
                  <span className="text-[#848792]">제한시간</span>
                  <CardTitle className="text-3xl text-color_main2">{data.goal_time}분</CardTitle>
                </div>
                <Separator orientation="vertical" />
                <div className="w-1/3">
                  <span className="text-[#848792]">연습횟수</span>
                  <CardTitle className="text-3xl text-color_main1">{data.practice_count}번</CardTitle>
                </div>
                <Separator orientation="vertical" />
                <div className="w-1/3">
                  <span className="text-[#848792]">발표점수</span>
                  <CardTitle className="text-3xl text-color_main3">{data.total_score}점</CardTitle>
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-row gap-4 mb-0 text-text_sub items-center p-0 h-8">
              <div className="w-1/3 flex items-center justify-center">
                프로젝트 생성일 : {data.created_at}
              </div>
              <Separator orientation="vertical" />
              <div className="w-1/3 flex items-center justify-center">
                마지막 연습일 : {data.last_practiced_at}
              </div>
              <Separator orientation="vertical" />
              <div className="w-1/3 flex items-center justify-center">
                <span className="text-text_sub">프로젝트 완료까지&nbsp;</span>
                <span className="text-color_main1">{Math.floor((new Date(data.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}일</span>
                <span className="text-text_sub">&nbsp;남음</span>
              </div>
            </div>
          </div>
          <ChevronRight className="mx-4 w-12 h-12 text-icon_default" />
        </CardHeader>
      </Link>
    </Card>
  )
}