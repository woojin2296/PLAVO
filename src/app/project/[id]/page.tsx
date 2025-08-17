"use client";

import { RecentQnASection } from "@/components/Project";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { Project } from "@/lib/projects";
import {
  ChartPie,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ScrollText,
  Settings,
  SquarePlus,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CartesianGrid, LabelList, Line, LineChart } from "recharts";

export default function Page({ params }: { params: { id: string } }) {
  const [projectData, setProjectData] = useState<Project>();
  const [practiceData, setPracticeData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/projects/${params.id}`);
      const result = await res.json() as { project: Project };
      setProjectData(result.project);
    };

    const fetchPracticeData = async () => {
      const res = await fetch(`/api/practice/list?project_id=${params.uuid}`);
      const result = await res.json();
      setPracticeData(result.practices || []);
      console.log("Practice data:", result);
    };

    fetchData();
    // fetchPracticeData();
  }, []);

  return (
    <div className="px-sub">

      <header className="flex items-center justify-between fixed top-0 left-0 px-toolbar_inner w-full h-component_height z-50 bg-background">
        <Link href={"/"}><ChevronLeft className="w-icon h-icon text-icon_default" /></Link>
        <span className="text-xl font-bold text-icon_default">Project</span>
        <Link href={"/"}><Settings className="w-icon h-icon text-icon_default" /></Link>
      </header>

      <div className="flex flex-col pt-component_height gap-2">

        <div className="p-2 flex flex-col gap-2">
          <span className="font-extrabold text-sm text-red-500">
            D
            {Math.floor(
              (new Date().getTime() - new Date(String(projectData?.due_date)).getTime()) /
              (1000 * 60 * 60 * 24)
            )}
          </span>
          <span className="text-xl font-bold text-text_default">
            {projectData?.name}
          </span>
          <span className="text-sm font-bold text-text_sub">
            {projectData?.description}
          </span>
        </div>

        <Card className="flex flex-col mt-2 px-4 py-2 shadow-none border-none">
          <Link className="flex items-center" href={"/project/create"}>
            <div className="mr-4 w-icon_box h-icon_box flex items-center justify-center bg-background rounded-xl">
              <SquarePlus className="w-icon h-icon text-color_main1" />
            </div>
            <span className="text-lg font-bold text-color_main1">New Practice</span>
            <ChevronRight className="w-icon h-icon text-icon_default ml-auto" />
          </Link>
        </Card>

        <div className="px-2 pt-4">
            <div className="text-sm">
              All <ChevronDown className="w-4 h-4 inline" />
            </div>
        </div>

        <Card className="flex flex-col gap-0 text-text_default">
          {/* <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-end gap-2 text-4xl">
                {projectData?.name}
              </CardTitle>
              <CardDescription className="text-xl text-text_sub">
                {projectData?.description}
              </CardDescription>
            </div>
            <div className="text-3xl">
              <span className="text-text_sub">프로젝트 완료까지&nbsp;</span>
              <span className="text-color_main1">
                {Math.floor(
                  (new Date(projectData?.due_date).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )}
                일
              </span>
              <span className="text-text_sub">&nbsp;남음</span>
            </div>
          </CardHeader> */}
          <Separator />
          {/* {data.practice_count == 0 ? (
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
                <PracticeScoreChart data={practiceData} />
              </div>
            </CardContent>
          )} */}
          {/* <Separator />
          <CardContent className="flex items-center p-0 h-20 text-text_sub text-center text-xl">
            <Link
              href={""}
              className="h-full w-1/3 flex items-center justify-center"
            >
              <ScrollText className="w-8 h-8 text-icon_default mx-2" />
              발표 스크립트 보러가기
            </Link>
            <Separator orientation="vertical" />
            <Link
              href={""}
              className="h-full w-1/3 flex items-center justify-center"
            >
              <ChartPie className="w-8 h-8 text-icon_default mx-2" />
              발표 평가 보고서 보러가기
            </Link>
            <Separator orientation="vertical" />
            <Link
              href={""}
              className="w-1/3 flex items-center justify-center"
            >
              <Settings className="w-8 h-8 text-icon_default mx-2" />
              프로젝트 설정 변경하기
            </Link>
          </CardContent>
          <Separator /> */}
          {/* <CardContent className="flex items-center p-0 h-20 text-text_sub text-center text-xl">
            <Link
              href={`/project/${data.uuid}/practice/create`}
              className="h-full w-1/2 text-color_main1 flex items-center justify-center"
            >
              <SquarePlus className="w-8 h-8 text-color_main1 mx-2" />
              새 발표 연습 시작하기
            </Link>
            <Separator orientation="vertical" />
            <Link
              href={`/project/${data.uuid}/qna/create`}
              className="h-full w-1/2 text-color_main1 flex items-center justify-center"
            >
              <MessageCirclePlus className="w-8 h-8 text-color_main1 mx-2" />
              새 질의응답 연습 시작하기
            </Link>
          </CardContent> */}
        </Card>

        {/* <div className="flex items-end justify-between text-4xl pt-8 p-4 text-bold text-text_default">
          최근 발표 연습 결과
          <Link href={"/project/list"} className="flex items-center">
            <span className="text-xl text-text_sub">전체보기</span>
            <ChevronRight className="w-8 h-8 text-icon_default" />
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {Array.isArray(practiceData) && practiceData.length > 0 ? (
            practiceData.map((practice, index) => (
              <Link
                key={practice.id}
                href={`/project/${params.projectId}/practice/${practice.id}`}
              >
                <RecentPracticeCard data={practice} index={index} />
              </Link>
            ))
          ) : (
            <div className="text-center text-2xl text-text_sub my-16">
              아직 발표 연습을 하지 않았습니다.
            </div>
          )}
        </div> */}

        {/* <RecentQnASection /> */}
      </div>
    </div>
  );
}

function RecentPracticeCard({
  data,
  index,
}: {
  data: any;
  index: number;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-6 pr-0">
        <CardTitle className="text-2xl text-text_default w-1/5">
          {index + 1}번째 연습
        </CardTitle>
        <div className="flex flex-row w-4/5">
          <div className="flex flex-col items-center w-1/5">
            <span className="text-[#848792]">최종점수</span>
            <CardTitle className="text-3xl text-color_main2">
              {data.total_score}점
            </CardTitle>
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col items-center w-1/5">
            <span className="text-[#848792]">속도점수</span>
            <CardTitle className="text-3xl text-color_main1">
              {data.speed_score}점
            </CardTitle>
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col items-center w-1/5">
            <span className="text-[#848792]">자세점수</span>
            <CardTitle className="text-3xl text-color_main1">
              {data.pose_score}점
            </CardTitle>
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col items-center w-1/5">
            <span className="text-[#848792]">발음점수</span>
            <CardTitle className="text-3xl text-color_main3">
              {data.pronunciation_score}점
            </CardTitle>
          </div>
        </div>
        <ChevronRight className="mx-4 w-12 h-12 text-icon_default" />
      </CardHeader>
    </Card>
  );
}

function PracticeScoreChart({ data }: { data: any[] }) {
  const chartData = [
    { practice_id: "1", score: data[5]?.total_score || 0 },
    { practice_id: "2", score: data[4]?.total_score || 0 },
    { practice_id: "3", score: data[3]?.total_score || 0 },
    { practice_id: "4", score: data[2]?.total_score || 0 },
    { practice_id: "5", score: data[1]?.total_score || 0 },
    { practice_id: "6", score: data[0]?.total_score || 0 },
  ];

  const chartConfig = {
    score: {
      label: "Total Score",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

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
  );
}