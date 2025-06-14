"use client";

import { ProjectHeader } from "@/components/Header";
import { PracticeScoreChart } from "@/components/Project";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChartPie, MessageCirclePlus, ScrollText, Settings, SquarePlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/practice?id=${params.id}`, {
        method: "GET",
      });
      const result = await res.json();
      setData(result.practice);
      console.log("Project data:", result);
    };
    fetchData();
    console.log(data);
  }, [params.id]);

  return (
    <div className="flex flex-col">
      <ProjectHeader />
      <div className="flex flex-col pt-20 gap-4">
        <ProjectInfoSection data={data} />
        <Card className="flex flex-col gap-0 text-text_default">
          <CardContent className="flex items-center">
            <div className="w-full pr-4">
              <div className="flex items-center gap-2">
                <CardDescription className="text-4xl py-8">연습 점수는</CardDescription>
                <CardTitle className="text-4xl text-color_main2">{data.total_score}점</CardTitle>
                <CardDescription className="text-4xl py-4">입니다.</CardDescription>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-8 pr-8">
                  <CardDescription className="text-xl py-4">발화 속도</CardDescription>
                  <CardTitle className="text-4xl">{data.speed_score}</CardTitle>
                </div>
                <div className="flex items-center gap-8 pr-8">
                  <CardDescription className="text-xl py-4">발음 정확도</CardDescription>
                  <CardTitle className="text-4xl">{data.speed_score}</CardTitle>
                </div>
                <div className="flex items-center gap-8 pr-8">
                  <CardDescription className="text-xl py-4">제스처 점수</CardDescription>
                  <CardTitle className="text-4xl">{data.pose_score}</CardTitle>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ProjectInfoSection({ data }: { data: any }) {
  return (
    <Card className="flex flex-col gap-0 text-text_default">
      <CardContent className="flex items-center">
        <div className="w-full pr-4">
          <div className="flex items-center gap-2">
            <CardDescription className="text-4xl py-8">연습 점수는</CardDescription>
            <CardTitle className="text-4xl text-color_main2">{data.total_score}점</CardTitle>
            <CardDescription className="text-4xl py-4">입니다.</CardDescription>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-8 pr-8">
              <CardDescription className="text-xl py-4">발화 속도</CardDescription>
              <CardTitle className="text-4xl">{data.speed_score}</CardTitle>
            </div>
            <div className="flex items-center gap-8 pr-8">
              <CardDescription className="text-xl py-4">발음 정확도</CardDescription>
              <CardTitle className="text-4xl">{data.speed_score}</CardTitle>
            </div>
            <div className="flex items-center gap-8 pr-8">
              <CardDescription className="text-xl py-4">제스처 점수</CardDescription>
              <CardTitle className="text-4xl">{data.pose_score}</CardTitle>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}