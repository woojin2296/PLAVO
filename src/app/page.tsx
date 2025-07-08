"use client";

import Image from "next/image";
import { PracticeCountChart, ProjectCountChart, ProjectPinSection, UpcomingProjectSection } from "@/components/Home";
import React, { useEffect, useState } from "react";
import { UserStatus } from "@/domain/types";
import { useRouter } from "next/navigation";
import { ChartPie, CircleUserRound, ListChecks, SquarePlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Page() {
  const router = useRouter();

  const [user_name, setUserName] = useState("");
  const [UserStatusData, setUserStatusData] = useState<UserStatus>({
    name: "",
    rank: 0,
    total_projects: 0,
    completed_projects: 0,
    practice_counts: 0,
    total_score: 0,
    speed_score: 0,
    pronunciation_score: 0,
    pose_score: 0,
    qna_score: 0,
  });

  const [PinedProjectData] = useState([]);
  const [UpcomingProjectData, setUpcomingProjectData] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const userSub = sessionStorage.getItem("user_sub");
    const name = sessionStorage.getItem("user_name");

    if (!userSub || !name) {
      router.push("/login");
      return;
    }

    setUserName(name);

    fetch(`/api/user/status?sub=${userSub}`)
      .then(res => res.json())
      .then((data: UserStatus) => {
        setUserStatusData(data);
      })
      .catch(console.error);

    fetch(`/api/project/list?sub=${userSub}`)
      .then(res => res.json())
      .then((data) => {
        setUpcomingProjectData(data.projects);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col">
      <HomeHeader />
      <div className="pt-20">
        <Card className="flex flex-col gap-0 text-text_default">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-end gap-2 text-4xl">
              <span className="text-color_main2">{user_name} 님</span>
              <span className="text-2xl">의 발표 등급은 </span>
              <span className="text-color_main3">
                {
                  UserStatusData.total_projects == 0 ?
                    "아직 알 수 없습니다." :
                    `상위 ${UserStatusData.rank}%`
                }
              </span>
            </CardTitle>
          </CardHeader>
          <Separator />
          {
            UserStatusData.total_projects == 0 ?
              <CardContent className="flex items-center justify-center text-2xl text-text_sub my-16 py-14">
                아직 발표를 진행하지 않았습니다. 프로젝트를 생성하고 발표를 시작해보세요!
              </CardContent>
              :
              <CardContent className="flex items-center">
                <div className="w-2/4 pr-4">
                  <div className="flex items-center gap-2">
                    <CardDescription className="text-4xl py-4">평균 점수는</CardDescription>
                    <CardTitle className="text-4xl text-color_main2">{Math.round(UserStatusData.total_score)}점</CardTitle>
                    <CardDescription className="text-4xl py-4">입니다.</CardDescription>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="flex items-center justify-between pr-8">
                      <CardDescription className="text-xl py-4">발화 속도</CardDescription>
                      <CardTitle className="text-4xl">{Math.round(UserStatusData.speed_score)}</CardTitle>
                    </div>
                    <div className="flex items-center justify-between pr-8">
                      <CardDescription className="text-xl py-4">발음 정확도</CardDescription>
                      <CardTitle className="text-4xl">{Math.round(UserStatusData.pronunciation_score)}</CardTitle>
                    </div>
                    <div className="flex items-center justify-between pr-8">
                      <CardDescription className="text-xl py-4">제스처 일치도</CardDescription>
                      <CardTitle className="text-4xl">{Math.round(UserStatusData.pose_score)}</CardTitle>
                    </div>
                    <div className="flex items-center justify-between pr-8">
                      <CardDescription className="text-xl py-4">질의응답 정확도</CardDescription>
                      <CardTitle className="text-4xl">{Math.round(UserStatusData.qna_score)}</CardTitle>
                    </div>
                  </div>
                </div>
                <div className="w-1/4">
                  <ProjectCountChart total={UserStatusData.total_projects} completed={UserStatusData.completed_projects} />
                </div>
                <div className="w-1/4">
                  <PracticeCountChart data={UserStatusData.practice_counts} />
                </div>
              </CardContent>
          }
          <Separator />
          <CardContent className="flex items-center p-0 h-20 text-text_sub text-center text-xl">
            <Link className="h-full w-1/3 flex items-center justify-center" href={""}>
              <ChartPie className="w-8 h-8 text-icon_default mx-2" />
              나의 발표 평가 보러가기
            </Link>
            <Separator orientation="vertical" />
            <Link className="h-full w-1/3 flex items-center justify-center" href={""}>
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
        <ProjectPinSection data={PinedProjectData} />
        <UpcomingProjectSection data={UpcomingProjectData} />
      </div>
    </div>
  );
}

function HomeHeader() {
  return (
    <header className="fixed top-0 left-0 px-8 py-4 w-full h-24 z-50 bg-[#F3F4F6] flex items-center justify-between">
      <Image src="/logo-sm.svg" alt="Logo" width={45} height={45} />
      <span className="text-2xl text-icon_default">PLAVO</span>
      <Link href={"/login"}><CircleUserRound className="w-8 h-8 text-icon_default" /></Link>
    </header>
  );
}