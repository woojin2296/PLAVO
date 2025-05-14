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
import { ChevronRight, Pin } from "lucide-react";
import { Separator } from "./ui/separator";
import React from "react";

export function ProfileStatusSection({ name, rank, total_projects, completed_projects, practice_counts, total_score, speed_score, pose_score, qna_score }: { name: string, rank: number, total_projects: number, completed_projects: number, practice_counts: number[], total_score: number, speed_score: number, pose_score: number, qna_score: number }) {
  return (
    <Card className="flex flex-col gap-0 text-[#333C4B]">
      <CardHeader className="flex flex-col gap-2 pb-4">
        <CardTitle className="text-4xl">
          <span className="text-[#01477E]">{name} 님</span>
          <span className="text-2xl">의 발표 등급은 </span>
          <span className="text-[#A8C66C]">상위 {rank}%</span>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex items-center">
        <div className="w-1/4">
          <ProjectCountChart total={total_projects} completed={completed_projects} />
        </div>
        <div className="w-1/4">
          <PracticeCountChart data={practice_counts} />
        </div>
        <div className="w-2/4 px-4">
          <ProfileScoreChart
            total_score={total_score}
            speed_score={speed_score}
            pose_score={pose_score}
            qna_score={qna_score}
          />
        </div>
      </CardContent>
      <CardContent className="flex items-center justify-center h-[350px]">
        여기 그래프 같은거 하나 더 들어가면 비율상 이쁠 것 같은데
      </CardContent>
    </Card>
  );
}

export function ProjectPinSection() {
  return (
    <>
      <div className="text-4xl p-4 pt-8 text-bold text-[#28303F]">고정된 프로젝트</div>
      <div className="grid grid-cols-2 gap-4">
        <PinedProjectCard
          name="졸업작품"
          description="실시간 발표 분석을 통한 AI 피드백 플랫폼 개발"
          score={88}
          practice_count={17}
          time={5}
        />
        <PinedProjectCard
          name="메타버스 경진대회"
          description="가상 회의 공간에서의 사용자 몰입도 향상 기술"
          score={47}
          practice_count={2}
          time={10}
        />
        <PinedProjectCard
          name="산학협력 프로젝트"
          description=" 제조 현장을 위한 AI 불량 탐지 솔루션"
          score={52}
          practice_count={8}
          time={15}
        />
      </div>
    </>
  )
}
export function PinedProjectCard({ name, description, score, practice_count, time }: { name: string, description: string, score: number, practice_count: number, time: number }) {
  return (
    <Card className="relative flex flex-col">
      <Pin
        color="#B1B9C2"
        fill="#B1B9C2"
        className="absolute top-6 right-4 w-8 h-8 rotate-45"
      />
      <CardHeader className="py-6">
        <CardTitle className="text-3xl text-[#28303F]">{name}</CardTitle>
        <CardDescription className="text-xl">{description}</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex items-center justify-center text-center py-6 px-0">
        <div className="w-1/3">
          <span className="text-[#848792]">제한시간</span>
          <CardTitle className="text-3xl text-[#01477E]">{time}분</CardTitle>
        </div>
        <Separator orientation="vertical" />
        <div className="w-1/3">
          <span className="text-[#848792]">연습횟수</span>
          <CardTitle className="text-3xl text-[#3182F7]">{practice_count}번</CardTitle>
        </div>
        <Separator orientation="vertical" />
        <div className="w-1/3">
          <span className="text-[#848792]">발표점수</span>
          <CardTitle className="text-3xl text-[#A8C66C]">{score}점</CardTitle>
        </div>
        <ChevronRight
          color="#B1B9C2"
          className="mx-4 w-8 h-8"
        />
      </CardContent>
    </Card>
  )
}

export function RecentProjectSection() {
  return (
    <>
      <div className="text-4xl pt-8 p-4 text-bold text-[#28303F]">
        최근 프로젝트
        <span className="text-xl pl-4 text-[#848792]">(최근 10개의 프로젝트를 보여줍니다.)</span>
      </div>
      <div className="flex flex-col gap-4">
        <RecentProjectCard
          name="졸업작품"
          description="실시간 발표 분석을 통한 AI 피드백 플랫폼 개발"
          score={88}
          practice_count={5}
          time={5}
        />
        <RecentProjectCard
          name="메타버스 경진대회"
          description="가상 회의 공간에서의 사용자 몰입도 향상 기술"
          score={56}
          practice_count={3}
          time={10}
        />
        <RecentProjectCard
          name="산학협력 프로젝트"
          description=" 제조 현장을 위한 AI 불량 탐지 솔루션"
          score={52}
          practice_count={8}
          time={15}
        />
        <RecentProjectCard
          name="AI 경진대회"
          description="AI 기반의 실시간 발표 분석 시스템"
          score={92}
          practice_count={12}
          time={20}
        />
        <RecentProjectCard
          name="기계학습 프로젝트"
          description="딥러닝을 활용한 손글씨 인식 시스템 구현"
          score={84}
          practice_count={9}
          time={12}
        />
        <RecentProjectCard
          name="UX 해커톤"
          description="사용자 행동 분석을 통한 UI 개선 실험"
          score={67}
          practice_count={4}
          time={6}
        />
        <RecentProjectCard
          name="공공데이터 공모전"
          description="서울시 교통 데이터를 활용한 혼잡도 예측 시스템"
          score={73}
          practice_count={5}
          time={8}
        />
      </div>
    </>
  )
}
export function RecentProjectCard({ name, description, score, practice_count, time }: { name: string, description: string, score: number, practice_count: number, time: number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between py-6 pr-0">
        <div className="w-1/2">
          <CardTitle className="text-3xl text-[#28303F]">{name}</CardTitle>
          <CardDescription className="text-xl">{description}</CardDescription>
        </div>
        <div className="flex w-1/2 items-center justify-center text-center">
          <div className="w-1/3">
            <span className="text-[#848792]">제한시간</span>
            <CardTitle className="text-3xl text-[#01477E]">{time}분</CardTitle>
          </div>
          <Separator orientation="vertical" />
          <div className="w-1/3">
            <span className="text-[#848792]">연습횟수</span>
            <CardTitle className="text-3xl text-[#3182F7]">{practice_count}번</CardTitle>
          </div>
          <Separator orientation="vertical" />
          <div className="w-1/3">
            <span className="text-[#848792]">발표점수</span>
            <CardTitle className="text-3xl text-[#A8C66C]">{score}점</CardTitle>
          </div>
          <ChevronRight
            color="#B1B9C2"
            className="mx-4 w-12 h-12"
          />
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
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={90 + (completed / total) * 360}
        innerRadius={80}
        outerRadius={110}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-#F3F4F6"
          polarRadius={[86, 74]}
        />
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
        <CardTitle className="text-4xl text-[#01477E]">{total_score}점</CardTitle>
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