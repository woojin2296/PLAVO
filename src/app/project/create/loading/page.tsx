"use client";

import { ChevronLeft, House } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const uuid = sessionStorage.getItem("project_uuid");
      console.log("Project UUID:", uuid);
      const res = await fetch("http://soboroo.tplinkdns.com:8000/transcribe/" + uuid, { method: "POST" });
      const result = await res.json();
      
      const re2 = await fetch("/api/project", {
        method: "POST",
        body: JSON.stringify({
          uuid: sessionStorage.getItem("project_uuid"),
          user_id: sessionStorage.getItem("user_sub"),
          name: sessionStorage.getItem("project_name"),
          description: sessionStorage.getItem("project_description"),
          goal_time: sessionStorage.getItem("project_goal_time"),
          due_date: sessionStorage.getItem("project_due_date"),
          script: result.text,
        })
      });
      console.log("Project created:", await re2.json());

      router.push("/project/" + uuid);

      sessionStorage.removeItem("project_uuid");
      sessionStorage.removeItem("project_name");
      sessionStorage.removeItem("project_description");
      sessionStorage.removeItem("project_goal_time");
      sessionStorage.removeItem("project_due_date");
    }

    setTimeout(() => {
      fetchData();
    }, 1000);
  }, []);
  
  return (
    <div className="flex flex-col">
      <ProjectCreateHeader />
      <div className="pt-20 flex flex-col items-center justify-center h-[1500px]">
        <div className="flex items-end justify-between text-4xl pt-8 p-4 text-text_default">
          프로젝트를 생성하는 중입니다!
        </div>
        <div className="flex items-end justify-between text-4xl pt-8 p-4 text-text_default">
          잠시만 기다려주세요.
        </div>
        <div className="flex items-end justify-between text-4xl pt-8 p-4 text-text_sub">
          파일을 준비하는 중...
        </div>
        <div className="flex items-end justify-between text-4xl pt-8 p-4 text-text_sub">
          파일을 서버로 보내는 중...
        </div>
        <div className="flex items-end justify-between text-4xl pt-8 p-4 text-text_sub">
          파일을 처리하는 중...
        </div>
        <div className="flex items-end justify-between text-4xl pt-8 p-4 text-text_sub">
          데이터베이스에 저장하는 중...
        </div>
        <div className="flex items-end justify-between text-4xl pt-8 p-4 text-text_sub">
          프로젝트를 생성하는 중...
        </div>
      </div>
    </div>
  );
}

function ProjectCreateHeader() {
  return (
    <header className="fixed top-0 left-0 px-8 py-4 w-full h-24 z-50 bg-[#F3F4F6] flex items-center justify-between">
      <Link href={"/"}><ChevronLeft className="w-8 h-8 text-icon_default" /></Link>
      <span className="text-2xl text-icon_default">프로젝트 생성</span>
      <Link href={"/"}><House className="w-8 h-8 text-icon_default" /></Link>
    </header>
  );
}