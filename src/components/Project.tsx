"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ChevronRight } from "lucide-react";
import { Separator } from "./ui/separator";
import React from "react";
import Link from "next/link";
import { QnAInfo } from "@/types/types";

export function RecentQnASection() {
  const data = []
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
            <div className="text-center text-2xl text-text_sub my-16">아직 질의응답 연습을 하지 않았습니다.</div>
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
          <CardTitle className="text-4xl">{Math.round(speed_score)}</CardTitle>
        </div>
        <div className="flex items-center justify-between pr-8">
          <CardDescription className="text-xl py-4">발음 정확도</CardDescription>
          <CardTitle className="text-4xl">{Math.round(speed_score)}</CardTitle>
        </div>
        <div className="flex items-center justify-between pr-8">
          <CardDescription className="text-xl py-4">제스처 일치도</CardDescription>
          <CardTitle className="text-4xl">{Math.round(pose_score)}</CardTitle>
        </div>
        <div className="flex items-center justify-between pr-8">
          <CardDescription className="text-xl py-4">질의응답 정확도</CardDescription>
          <CardTitle className="text-4xl">{Math.round(qna_score)}</CardTitle>
        </div>
      </div>
    </>
  )
}

