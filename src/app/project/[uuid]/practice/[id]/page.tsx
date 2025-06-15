"use client";

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, House } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { uuid : string, id: string } }) {
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
  }, []);

  return (
    <div className="flex flex-col">
      <ProjectHeader uuid={params.uuid}/>
      {
        data.id ? (
          <div className="flex flex-col pt-20 gap-4">
            <ProjectInfoSection data={data} />
            <Card className="flex flex-col gap-0 text-text_default">
              <CardContent className="flex items-center">
                <div className="w-full">
                  <CardTitle className="text-3xl pt-8 pb-2">발화 속도 분석</CardTitle>
                  <Separator className="my-2" />
                  <div className="flex flex-col">
                    <CardTitle className="text-2xl py-4">평균 속도</CardTitle>
                    <CardDescription className="text-2xl">{data.speaking_speed_analysis_average_speed}</CardDescription>
                    <CardTitle className="text-2xl py-4">속도 변화</CardTitle>
                    <CardDescription className="text-2xl">{data.speaking_speed_analysis_speed_variation}</CardDescription>
                    <CardTitle className="text-2xl py-4">시간대별 속도</CardTitle>
                    <CardDescription className="text-2xl">{data.speaking_speed_analysis_speed_by_time_slot}</CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="flex flex-col gap-0 text-text_default">
              <CardContent className="flex items-center">
                <div className="w-full">
                  <CardTitle className="text-3xl pt-8 pb-2">제스처 분석</CardTitle>
                  <Separator className="my-2" />
                  <div className="flex flex-col">
                    <CardTitle className="text-2xl py-4">잘못된 제스처 수</CardTitle>
                    <CardDescription className="text-2xl">{JSON.parse(data.pose_list).length}</CardDescription>
                    <CardTitle className="text-2xl py-4">잘못된 제스처 목록</CardTitle>
                    <CardDescription className="text-2xl">{JSON.parse(data.pose_list).length == 0 ? data.pose_list : "없음"}</CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="flex flex-col gap-0 text-text_default">
              <CardContent className="flex items-center">
                <div className="w-full">
                  <CardTitle className="text-3xl pt-8 pb-2">개선점 및 피드백</CardTitle>
                  <Separator className="my-2" />
                  <div className="flex flex-col">
                    <CardTitle className="text-2xl py-4">개선이 필요한 부분</CardTitle>
                    <CardDescription className="text-2xl">발화 속도 : {data.improvements_and_feedback_areas_for_improvement_speaking_speed}</CardDescription>
                    <CardDescription className="text-2xl">발표 내용 : {data.improvements_and_feedback_areas_for_improvement_presentation_content}</CardDescription>
                    <CardTitle className="text-2xl py-4">강점</CardTitle>
                    <CardDescription className="text-2xl">발화 속도 : {data.improvements_and_feedback_strengths_speaking_speed}</CardDescription>
                    <CardDescription className="text-2xl">발표 내용 : {data.improvements_and_feedback_strengths_presentation_content}</CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="flex flex-col gap-0 text-text_default">
              <CardContent className="flex items-center">
                <div className="w-full">
                  <CardTitle className="text-3xl pt-8 pb-2">추가 연습 추천</CardTitle>
                  <Separator className="my-2" />
                  <div className="flex flex-col">
                    <CardTitle className="text-2xl py-4">발음 연습 자료</CardTitle>
                    <CardDescription className="text-2xl">{data.additional_practice_recommendations_for_improvement_pronunciation_practice_materials}</CardDescription>
                    <CardTitle className="text-2xl py-4">속도 조절 연습</CardTitle>
                    <CardDescription className="text-2xl">{data.additional_practice_recommendations_for_improvement_speed_control_practice}</CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="flex flex-col gap-0 text-text_default">
              <CardContent className="flex items-center">
                <div className="w-full">
                  <CardTitle className="text-3xl pt-8 pb-2">다음 단계</CardTitle>
                  <Separator className="my-2" />
                  <div className="flex flex-col">
                    <CardTitle className="text-2xl py-4">다음 목표</CardTitle>
                    <CardDescription className="text-2xl">{data.recommended_next_steps_set_next_goals}</CardDescription>
                    <CardTitle className="text-2xl py-4">내용 피드백</CardTitle>
                    <CardDescription className="text-2xl">{data.content_feedback_feedback_and_improvements_on_content}</CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center h-screen text-2xl text-text_sub">
            연습 결과를 불러오는 중입니다...
          </div>
        )
      }
    </div>
  );
}

function ProjectHeader({uuid}: { uuid: string }) {
  return (
    <header className="fixed top-0 left-0 px-8 py-4 w-full h-24 z-50 bg-[#F3F4F6] flex items-center justify-between">
      <Link href={`/project/${uuid}`}><ChevronLeft className="w-8 h-8 text-icon_default" /></Link>
      <span className="text-2xl text-icon_default">프로젝트</span>
      <Link href={"/"}><House className="w-8 h-8 text-icon_default" /></Link>
    </header>
  );
}

function ProjectInfoSection({ data }: { data: any }) {
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