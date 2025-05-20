"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Label,
  Pie,
  PieChart,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ChartPie, ChevronRight, ListChecks, Pin, SquarePlus } from "lucide-react";
import { Separator } from "./ui/separator";
import React from "react";
import Link from "next/link";
import { ProjectInfo } from "@/lib/types";

export function ProfileStatusSection({ name, rank, total_projects, completed_projects, practice_counts, total_score, speed_score, pose_score, qna_score }: { name: string, rank: number, total_projects: number, completed_projects: number, practice_counts: number[], total_score: number, speed_score: number, pose_score: number, qna_score: number }) {
  return (
    <Card className="flex flex-col gap-0 text-text_default">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-end gap-2 text-4xl">
          <span className="text-color_main2">{name} 님</span>
          <span className="text-2xl">의 발표 등급은 </span>
          <span className="text-color_main3">상위 {rank}%</span>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex items-center">
        <div className="w-2/4 pr-4">
          <ProfileScoreChart
            total_score={total_score}
            speed_score={speed_score}
            pose_score={pose_score}
            qna_score={qna_score}
          />
        </div>
        <div className="w-1/4">
          <ProjectCountChart total={total_projects} completed={completed_projects} />
        </div>
        <div className="w-1/4">
          <PracticeCountChart data={practice_counts} />
        </div>
      </CardContent>
      <Separator />
      <CardContent className="flex items-center p-0 h-20 text-text_sub text-center text-xl">
        <div className="h-full w-1/3 flex items-center justify-center">
          <ChartPie className="w-8 h-8 text-icon_default mx-2" />
          나의 발표 평가 보러가기
        </div>
        <Separator orientation="vertical" />
        <Link className="h-full w-1/3 flex items-center justify-center" href={"/project/list"}>
          <ListChecks className="w-8 h-8 text-icon_default mx-2" />
          프로젝트 목록 보러가기
        </Link>
        <Separator orientation="vertical" />
        <Link className="h-full w-1/3 text-color_main1 flex items-center justify-center" href={"/project/create"}>
          <SquarePlus className="w-8 h-8 text-color_main1 mx-2" />
          새 프로젝트 시작하기
        </Link>
      </CardContent>
    </Card>
  );
}

export function ProjectPinSection() {
  const data = [
    {
      id: "1",
      name: "졸업작품",
      description: "실시간 발표 분석을 통한 AI 피드백 플랫폼 개발",
      due_date: "2023-12-31",
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
      due_date: "2023-11-30",
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
      due_date: "2023-11-15",
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
  ]
  return (
    <>
      <div className="text-4xl p-4 pt-8 text-bold text-text_default">고정된 프로젝트</div>
      <div className="grid grid-cols-2 gap-4">
        {
          data.map((project) => (
            <Link key={project.id} href={`/project/${project.id}`}>
              <PinedProjectCard data={project} />
            </Link>
          ))
        }
      </div>
    </>
  )
}
export function PinedProjectCard({data} : { data: ProjectInfo }) {
  return (
    <Card className="relative flex flex-col">
      <Pin className="absolute top-6 right-4 w-8 h-8 rotate-45 text-icon_default fill-icon_default" />
      <CardHeader className="py-6">
        <CardTitle className="text-3xl text-text_default">{data.name}</CardTitle>
        <CardDescription className="text-xl">{data.description}</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex items-center justify-center text-center py-6 px-0">
        <div className="w-1/3">
          <span className="text-text_sub">제한시간</span>
          <CardTitle className="text-3xl text-color_main2">{data.goal_time}분</CardTitle>
        </div>
        <div className="w-1/3">
          <span className="text-text_sub">연습횟수</span>
          <CardTitle className="text-3xl text-color_main1">{data.practice_count}번</CardTitle>
        </div>
        <div className="w-1/3">
          <span className="text-text_sub">발표점수</span>
          <CardTitle className="text-3xl text-color_main3">{data.total_score}점</CardTitle>
        </div>
        <ChevronRight className="mx-4 w-12 h-12 text-icon_default" />
      </CardContent>
    </Card>
  )
}

export function UpcommingProjectSection() {
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
    <>
      <div className="text-4xl pt-8 p-4 text-bold text-text_default">
        임박한 프로젝트
        <span className="text-xl pl-4 text-text_sub">(발표 날짜가 얼마 남지 않은 프로젝트를 보여줍니다.)</span>
      </div>
      <div className="flex flex-col gap-4">
        {
          data.map((project) => (
            <Link key={project.id} href={`/project/${project.id}`}>
              <UpcomingProjectCard data={project} />
            </Link>
          ))
        }
      </div>
    </>
  )
}
export function UpcomingProjectCard({data} : { data: ProjectInfo }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-6 pr-0">
        <div className="text-2xl text-[red] w-24 text-center pr-4">
          D-{Math.floor((new Date(data.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
        </div>
        <div className="w-1/2">
          <CardTitle className="text-3xl text-text_default">{data.name}</CardTitle>
          <CardDescription className="text-xl text-text_sub">{data.description}</CardDescription>
        </div>
        <div className="flex w-1/2 items-center justify-center text-center">
          <div className="w-1/3">
            <span className="text-[#848792]">제한시간</span>
            <CardTitle className="text-3xl text-color_main2">{data.goal_time}분</CardTitle>
          </div>
          <div className="w-1/3">
            <span className="text-[#848792]">연습횟수</span>
            <CardTitle className="text-3xl text-color_main1">{data.practice_count}번</CardTitle>
          </div>
          <div className="w-1/3">
            <span className="text-[#848792]">발표점수</span>
            <CardTitle className="text-3xl text-color_main3">{data.total_score}점</CardTitle>
          </div>
          <ChevronRight className="mx-4 w-12 h-12 text-icon_default" />
        </div>
      </CardHeader>
    </Card>
  )
}

export function ProjectCountChart({ total, completed }: { total: number, completed: number }) {
  const chartData = [
    { label: "completed", total: total, fill: "var(--color-completed)" },
  ]
  const chartConfig = {
    total: {
      label: "개",
    },
    completed: {
      label: "Completed",
      color: "#3182F7",
    },
  } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig} className="aspect-square max-h-[250px]">
      <RadialBarChart data={chartData} startAngle={90} endAngle={90 + (completed / total) * 360} innerRadius={80} outerRadius={110}>
        <PolarGrid gridType="circle" radialLines={false} stroke="none" polarRadius={[86, 74]} className="first:fill-muted last:fill-background" />
        <RadialBar dataKey="total" background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 28} className="fill-muted-foreground" >
                      프로젝트
                    </tspan>
                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-4xl font-bold">
                      {chartData[0].total.toLocaleString()}개
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground" >
                      중 {completed?.toLocaleString()}개 완료
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  )
}
export function PracticeCountChart({ data }: { data: number[] }) {
  const chartData = [
    { project_name: "Project1", practice: data[0], fill: "var(--color-Project1)" },
    { project_name: "Project2", practice: data[1], fill: "var(--color-Project2)" },
    { project_name: "Project3", practice: data[2], fill: "var(--color-Project3)" },
    { project_name: "Project4", practice: data[3], fill: "var(--color-Project4)" },
    { project_name: "other", practice: data[4], fill: "var(--color-other)" },
  ]
  const chartConfig = {
    practice: {
      label: "Visitors",
    },
    Project1: {
      label: "Project1",
      color: "#012E57",
    },
    Project2: {
      label: "Project2",
      color: "#01477E",
    },
    Project3: {
      label: "Project3",
      color: "#1F65B7",
    },
    Project4: {
      label: "Project4",
      color: "#3182F7",
    },
    other: {
      label: "Other",
      color: "#8FBDFE",
    },
  } satisfies ChartConfig

  const totalPractice = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.practice, 0)
  }, [])

  return (
    <ChartContainer config={chartConfig} className="aspect-square max-h-[230px]">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={chartData}
          dataKey="practice"
          nameKey="project_name"
          innerRadius={70}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 28}
                      className="fill-muted-foreground"
                    >
                      총
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-4xl font-bold"
                    >
                      {totalPractice.toLocaleString()}번
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      연습
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
export function ProfileScoreChart({ total_score, speed_score, pose_score, qna_score }: { total_score: number, speed_score: number, pose_score: number, qna_score: number }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <CardDescription className="text-4xl py-4">평균 점수는</CardDescription>
        <CardTitle className="text-4xl text-color_main2">{total_score}점</CardTitle>
        <CardDescription className="text-4xl py-4">입니다.</CardDescription>
      </div>
      <div className="grid grid-cols-2">
        <div className="flex items-center justify-between pr-8">
          <CardDescription className="text-xl py-4">발화 속도</CardDescription>
          <CardTitle className="text-4xl">{speed_score}</CardTitle>
        </div>
        <div className="flex items-center justify-between pr-8">
          <CardDescription className="text-xl py-4">발음 정확도</CardDescription>
          <CardTitle className="text-4xl">{speed_score}</CardTitle>
        </div>
        <div className="flex items-center justify-between pr-8">
          <CardDescription className="text-xl py-4">제스처 일치도</CardDescription>
          <CardTitle className="text-4xl">{pose_score}</CardTitle>
        </div>
        <div className="flex items-center justify-between pr-8">
          <CardDescription className="text-xl py-4">질의응답 정확도</CardDescription>
          <CardTitle className="text-4xl">{qna_score}</CardTitle>
        </div>
      </div>
    </>
  )
}