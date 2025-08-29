"use client";

import {
  Card,
} from "@/components/ui/card";
import { Practice } from "@/lib/practices";
import { Project } from "@/lib/projects";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const [projectData, setProjectData] = useState<Project>();
  const [practiceData, setPracticeData] = useState<Practice[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/projects/${params.id}`);
      const result = await res.json() as { project: Project };
      setProjectData(result.project);
    };

    const fetchPracticeData = async () => {
      const res = await fetch(`/api/practices/${params.id}`);
      const result = await res.json();
      setPracticeData(result.practices);
      console.log("Practice data:", result.practices);
    };

    fetchData();
    fetchPracticeData();
  }, [params.id]);

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
        <Link className="flex items-center py-2" href={`/project/${params.id}/practice/create`}>
          <div className="mr-4 w-icon_box h-icon_box flex items-center justify-center bg-background rounded-xl">
            <Plus className="w-icon h-icon text-text_sub" />
          </div>
          <span className="text-lg font-bold text-text_sub">New Practice</span>
          <ChevronRight className="w-icon h-icon text-icon_default ml-auto" />
        </Link>

        <Card className="flex flex-col shadow-none border-none px-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center h-component_height text-sm font-bold">Practices</div>
            <div className="text-sm">
              All <ChevronDown className="w-4 h-4 inline" />
            </div>
          </div>
          
          {
            practiceData.length == 0 ?
              <div className="flex items-center h-component_height flex-col justify-center">
                <span className="font-bold text-base text-text_sub">No practices available!</span>
                <span className="font-bold text-xs text-text_sub">Start a new practice!</span>
              </div>
              :
              <div className="flex flex-col">
                {
                  practiceData.map((practice : Practice) => (
                    <Link key={practice.id} href={`/project/${params.id}/practice/${practice.id}`}>
                      <div className="flex h-component_height items-center justify-left gap-4">

                        <div className={`w-main h-main items-center justify-center rounded-xl ${practice.type === "Speech" ? "bg-color_main1" : "bg-color_main3"}`}>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-base font-bold text-text_default">
                            {practice.type}
                          </span>
                          <span className="text-xs text-text_sub">
                            {practice.created_at}
                          </span>
                        </div>
                        <span className={`${practice.type === "Speech" ? "text-color_main1" : "text-color_main3"} font-bold ml-auto`}>
                          {String(Math.floor(practice.duration / 60)).padStart(2, '0')}:{String(practice.duration % 60).padStart(2, '0')}
                        </span>
                        <ChevronRight className="w-icon h-icon text-icon_default" />
                      </div>
                    </Link>
                  ))
                }
              </div>
          }
        </Card>
      </div>
    </div>
  );
}
