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
import Link from "next/link";
import { ProjectInfo } from "@/domain/types";


export function ProjectPinSection({ data }: { data: ProjectInfo[] }) {
  return (
    <>
      <div className="text-4xl p-4 pt-8 text-bold text-text_default">고정된 프로젝트</div>
      {
        data.length === 0 ?
          <div className="flex items-center justify-center text-2xl text-text_sub my-8 py-8">
            아직 고정된 프로젝트가 없습니다. 프로젝트를 생성하고 고정해보세요!
          </div>
          :
          <div className="grid grid-cols-2 gap-4">
            {
              data.map((project) => (
                <Link key={project.id} href={`/project/${project.id}`}>
                  <PinedProjectCard data={project} />
                </Link>
              ))
            }
          </div>
      }
    </>
  )
}

export function PinedProjectCard({ data }: { data: ProjectInfo }) {
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

export function UpcomingProjectSection({ data }: { data: ProjectInfo[] }) {
  return (
    <>
      <div className="text-4xl pt-8 p-4 text-bold text-text_default">임박한 프로젝트</div>
      {
        data.length === 0 ?
          <div className="flex items-center justify-center text-2xl text-text_sub my-8 py-8">
            아직 생성된 프로젝트가 없습니다. 프로젝트를 생성해보세요!
          </div>
          :
          <div className="flex flex-col gap-4">
            {
              data.map((project) => (
                <Link key={project.uuid} href={`/project/${project.uuid}`}>
                  <UpcomingProjectCard data={project} />
                </Link>
              ))
            }
          </div>
      }
    </>
  )
}
export function UpcomingProjectCard({ data }: { data: ProjectInfo }) {
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
export function PracticeCountChart({ data }: { data: number }) {
  const chartData = [
    { project_name: "Project1", practice: data, fill: "var(--color-Project1)" },
    { project_name: "Project2", practice: 0, fill: "var(--color-Project2)" },
    { project_name: "Project3", practice: 0, fill: "var(--color-Project3)" },
    { project_name: "Project4", practice: 0, fill: "var(--color-Project4)" },
    { project_name: "other", practice: 1, fill: "var(--color-other)" },
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
    return data
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