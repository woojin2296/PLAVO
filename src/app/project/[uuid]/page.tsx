"use client";

import { ProjectHeader } from "@/components/Header";
import { PracticeScoreChart, ProfileScoreChart, RecentPracticeSection, RecentQnASection } from "@/components/Project";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChartPie, MessageCirclePlus, ScrollText, Settings, SquarePlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { uuid: string } }) {
  const [data, setData] = useState<any>({});
  const [practiceData, setPracticeData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/project?uuid=${params.uuid}`, {
        method: "GET",
      });
      const result = await res.json();
      setData(result.project);
      console.log("Project data:", result);
    };
    fetchData();

    const fetchPracticeData = async () => {
      const res = await fetch(`/api/practice?project_id=${params.uuid}`, {
        method: "GET",
      });
      const result = await res.json();
      setPracticeData(result.practices);
      console.log("Practice data:", result);
    }
  }, [params.uuid]);

  return (
    <div className="flex flex-col">
      <ProjectHeader />
      <div className="pt-20">
        <ProjectInfoSection data={data} />
        <RecentPracticeSection data={practiceData}/>
        <RecentQnASection />
      </div>
    </div>
  );
}

export function ProjectInfoSection({ data }: { data: any }) {
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
      {
        data.practice_count == 0 ? (
          <CardContent className="flex items-center justify-center text-2xl text-text_sub my-12 py-14">
            아직 연습을 진행하지 않았습니다. 프로젝트를 생성하고 연습을 시작해보세요!
          </CardContent>
        ) : (
          <CardContent className="flex items-center">
            <div className="w-1/2 pr-4">
              <ProfileScoreChart
                total_score={data.total_score}
                speed_score={data.speed_score}
                pose_score={data.pose_score}
                qna_score={data.qna_score}
              />
            </div>
            <div className="text-xl text-text_sub w-1/2">
              연습별 점수 변화
              <PracticeScoreChart />
            </div>
          </CardContent>
        )
      }
      <Separator />
      <CardContent className="flex items-center p-0 h-20 text-text_sub text-center text-xl">
        <Link href={""} className="h-full w-1/3 flex items-center justify-center">
          <ScrollText className="w-8 h-8 text-icon_default mx-2" />
          발표 스크립트 보러가기
        </Link>
        <Separator orientation="vertical" />
        <Link href={""} className="h-full w-1/3 flex items-center justify-center">
          <ChartPie className="w-8 h-8 text-icon_default mx-2" />
          발표 평가 보고서 보러가기
        </Link>
        <Separator orientation="vertical" />
        <Link href={""} className="w-1/3 flex items-center justify-center">
          <Settings className="w-8 h-8 text-icon_default mx-2" />
          프로젝트 설정 변경하기
        </Link>
      </CardContent>
      <Separator />
      <CardContent className="flex items-center p-0 h-20 text-text_sub text-center text-xl">
        <Link href={`/project/${data.uuid}/practice/create`} className="h-full w-1/2 text-color_main1 flex items-center justify-center">
          <SquarePlus className="w-8 h-8 text-color_main1 mx-2" />
          새 발표 연습 시작하기
        </Link>
        <Separator orientation="vertical" />
        <Link href={`/project/${data.uuid}/qna/create`}  className="h-full w-1/2 text-color_main1 flex items-center justify-center">
          <MessageCirclePlus className="w-8 h-8 text-color_main1 mx-2" />
          새 질의응답 연습 시작하기
        </Link>
      </CardContent>
    </Card>
  );
}
