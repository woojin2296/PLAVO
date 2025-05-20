"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
} from "recharts"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { ChartPie, ChevronRight, FileQuestion, Pin, Presentation, Settings, SquarePlus, TrendingUp } from "lucide-react";
import { Separator } from "./ui/separator";
import React from "react";
import Link from "next/link";
import { PracticeInfo, ProjectInfo, QnAInfo } from "@/lib/types";

export function ProjectInfoSection({ data }: { data: ProjectInfo }) {
  return (
    <Card className="flex flex-col gap-0 text-text_default">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-end gap-2 text-4xl">
            {data.name}
          </CardTitle>
          <CardDescription className="text-xl text-text_sub">
            {data.description}
          </CardDescription>
        </div>
        <div className="text-3xl">
          <span className="text-text_sub">프로젝트 완료까지&nbsp;</span>
          <span className="text-color_main1">{Math.floor((new Date(data.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}일</span>
          <span className="text-text_sub">&nbsp;남음</span>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex items-center">
        <div className="w-1/2 pr-4">
          <ProfileScoreChart
            total_score={data.total_score}
            speed_score={10}
            pose_score={20}
            qna_score={30}
          />
        </div>
        <div className="text-xl text-text_sub w-1/2">
          연습별 점수 변화
          <PracticeScoreChart />
        </div>
      </CardContent>
      <Separator />
      <CardContent className="flex items-center p-0 h-20 text-text_sub text-center text-xl">
        <div className="w-1/3 flex items-center justify-center">
          <Settings className="w-8 h-8 text-icon_default mx-2" />
          프로젝트 설정 변경하기
        </div>
        <Separator orientation="vertical" />
        <div className="h-full w-1/3 flex items-center justify-center">
          <ChartPie className="w-8 h-8 text-icon_default mx-2" />
          나의 발표 평가 보고서 보러가기
        </div>
        <Separator orientation="vertical" />
        <Dialog>
          <DialogTrigger className="h-full w-1/3 text-color_main1 flex items-center justify-center">
            <SquarePlus className="w-8 h-8 text-color_main1 mx-2" />
            새 연습 시작하기
          </DialogTrigger>
          <DialogContent className="p-8">
            <DialogHeader>
              <DialogTitle className="text-4xl pb-4">연습 종류를 선택하세요</DialogTitle>
            </DialogHeader>
            <Link className="h-full" href={`/project/testproject`}>
              <Card>
                <CardContent className="mt-6">
                  <CardTitle className="text-3xl text-text_default flex flex-row items-center justify-between py-8">
                    <Presentation className="mx-8 w-12 h-12 text-icon_default" />
                      발표 연습
                    <ChevronRight className="mx-8 w-12 h-12 text-icon_default" />
                  </CardTitle>
                </CardContent>
              </Card>
            </Link>
            <Link className="h-full" href={`/project/testproject`}>
              <Card>
                <CardContent className="mt-6">
                  <CardTitle className="text-3xl text-text_default flex flex-row items-center justify-between py-8">
                    <FileQuestion className="mx-8 w-12 h-12 text-icon_default" />
                    질의응답 연습
                    <ChevronRight className="mx-8 w-12 h-12 text-icon_default" />
                  </CardTitle>
                </CardContent>
              </Card>
            </Link>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export function RecentPracticeSection() {
  const data = [
    {
      id: "1",
      project_id: "1",
      practice_count_id: 3,
      practice_time: 12,
      score: 78,
      speed_score: 23,
      pose_score: 26,
      qna_score: 28,
      pronunciation_score: 30,
      created_at: "2023-01-01",
    },
    {
      id: "2",
      project_id: "1",
      practice_count_id: 2,
      practice_time: 10,
      score: 56,
      speed_score: 56,
      pose_score: 52,
      qna_score: 28,
      pronunciation_score: 30,
      created_at: "2023-01-01",
    },
    {
      id: "3",
      project_id: "1",
      practice_count_id: 1,
      practice_time: 13,
      score: 23,
      speed_score: 52,
      pose_score: 52,
      qna_score: 28,
      pronunciation_score: 30,
      created_at: "2023-01-01",
    },
  ]
  return (
    <>
      <div className="flex items-end justify-between text-4xl pt-8 p-4 text-bold text-text_default">
        최근 발표 연습 결과
        <Link href={"/project/list"} className="flex items-center">
          <span className="text-xl text-text_sub">전체보기</span>
          <ChevronRight className="w-8 h-8 text-icon_default" />
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        {
          data.length != 0 ? data.map((practice) => (
            <Link key={practice.id} href={`/project/testproject`}>
              <RecentPracticeCard key={practice.id} data={practice} />
            </Link>
          )) : (
            <div className="text-center text-2xl text-text_sub">진행중인 프로젝트가 없습니다.</div>
          )
        }
      </div>
    </>
  )
}
export function RecentPracticeCard({ data }: { data: PracticeInfo }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-6 pr-0">
        <CardTitle className="text-2xl text-text_default">{data.practice_count_id}번째 연습</CardTitle>
        <div className="flex flex-row w-4/5">
          <div className="flex flex-col items-center w-1/5">
            <span className="text-[#848792]">소요시간</span>
            <CardTitle className="text-3xl text-color_main2">{data.practice_time}분</CardTitle>
          </div>
          <div className="flex flex-col items-center w-1/5">
            <span className="text-[#848792]">최종점수</span>
            <CardTitle className="text-3xl text-color_main2">{data.score}점</CardTitle>
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col items-center w-1/5">
            <span className="text-[#848792]">속도점수</span>
            <CardTitle className="text-3xl text-color_main1">{data.speed_score}점</CardTitle>
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col items-center w-1/5">
            <span className="text-[#848792]">자세점수</span>
            <CardTitle className="text-3xl text-color_main1">{data.pose_score}점</CardTitle>
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col items-center w-1/5">
            <span className="text-[#848792]">발음점수</span>
            <CardTitle className="text-3xl text-color_main3">{data.pronunciation_score}점</CardTitle>
          </div>
        </div>
        <ChevronRight className="mx-4 w-12 h-12 text-icon_default" />
      </CardHeader>
    </Card>
  )
}

export function RecentQnASection() {
  const data = [
    {
      id: "1",
      project_id: "1",
      qna_count_id: 3,
      qna_time: 12,
      score: 78,
      perfect_answer_count: 5,
      good_answer_count: 2,
      bad_answer_count: 3,
      created_at: "2023-01-01",
    },
    {
      id: "2",
      project_id: "1",
      qna_count_id: 2,
      qna_time: 10,
      score: 56,
      perfect_answer_count: 4,
      good_answer_count: 3,
      bad_answer_count: 3,
      created_at: "2023-01-01",
    },
    {
      id: "3",
      project_id: "1",
      qna_count_id: 1,
      qna_time: 13,
      score: 23,
      perfect_answer_count: 2,
      good_answer_count: 4,
      bad_answer_count: 4,
      created_at: "2023-01-01",
    },
  ]
  return (
    <>
      <div className="flex items-end justify-between text-4xl pt-8 p-4 text-bold text-text_default">
        최근 질의응답 연습 결과
        <Link href={"/project/list"} className="flex items-center">
          <span className="text-xl text-text_sub">전체보기</span>
          <ChevronRight className="w-8 h-8 text-icon_default" />
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        {
          data.length != 0 ? data.map((practice) => (
            <Link key={practice.id} href={`/project/testproject`}>
              <RecentQnACard data={practice} />
            </Link>
          )) : (
            <div className="text-center text-2xl text-text_sub">진행중인 프로젝트가 없습니다.</div>
          )
        }
      </div>
    </>
  )
}
export function RecentQnACard({ data }: { data: QnAInfo }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-6 pr-0">
        <CardTitle className="text-2xl text-text_default">{data.qna_count_id}번째 연습</CardTitle>
        <div className="flex flex-row w-4/5">
          <div className="flex flex-col items-center w-1/5">
            <span className="text-[#848792]">소요시간</span>
            <CardTitle className="text-3xl text-color_main2">{data.qna_time}분</CardTitle>
          </div>
          <div className="flex flex-col items-center w-1/5">
            <span className="text-[#848792]">최종점수</span>
            <CardTitle className="text-3xl text-color_main2">{data.score}점</CardTitle>
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col items-center w-1/5">
            <span className="text-[#848792]">훌륭함</span>
            <CardTitle className="text-3xl text-color_main1">{data.perfect_answer_count}개</CardTitle>
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col items-center w-1/5">
            <span className="text-[#848792]">적절함</span>
            <CardTitle className="text-3xl text-color_main1">{data.good_answer_count}개</CardTitle>
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col items-center w-1/5">
            <span className="text-[#848792]">미흡함</span>
            <CardTitle className="text-3xl text-color_main3">{data.bad_answer_count}개</CardTitle>
          </div>
        </div>
        <ChevronRight className="mx-4 w-12 h-12 text-icon_default" />
      </CardHeader>
    </Card>
  )
}

export function ProfileScoreChart({ total_score, speed_score, pose_score, qna_score }: { total_score: number, speed_score: number, pose_score: number, qna_score: number }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <CardDescription className="text-4xl py-4">최종 점수는</CardDescription>
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

export function PracticeScoreChart() {
  const chartData = [
    { practice_id: "1", score: 23 },
    { practice_id: "2", score: 31 },
    { practice_id: "3", score: 43 },
    { practice_id: "4", score: 65 },
    { practice_id: "5", score: 80 },
    { practice_id: "6", score: 98 },
  ]
  const chartConfig = {
    score: {
      label: "Total Score",
      color: "hsl(var(--chart-1))",
    }
  } satisfies ChartConfig
  return (
    <ChartContainer config={chartConfig} className="h-[120px] w-full">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 30,
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <Line
          dataKey="score"
          type="natural"
          stroke="var(--color-score)"
          strokeWidth={4}
          dot={{
            fill: "var(--color-score)",
          }}
          activeDot={{
            r: 6,
          }}
        >
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={16}
          />
        </Line>
      </LineChart>
    </ChartContainer>
  )
}