"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, SquarePlus, Folder, ChevronRight, NotepadText } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  const router = useRouter();

  type ProjectData = {
    id: string;
    name: string;
    description: string;
    due_date: string;
    last_practiced_at: string;
  };

  const [onGoingProjectData, setOngoingProjectData] = useState<ProjectData[]>([]);
  const [projectCount, setProjectCount] = useState(0);
  const [avgScore, setAvgScore] = useState(0);

  useEffect(() => {
    const data = [
      {
        id: "1",
        name: "Graduation Project",
        description: "Development of an AI feedback platform for real-time presentation analysis",
        due_date: "2025-09-20",
        last_practiced_at: "2023-11-01",
      },
      {
        id: "2",
        name: "Metaverse Competition",
        description: "Technology to enhance user immersion in virtual meeting spaces",
        due_date: "2025-09-25",
        last_practiced_at: "2023-11-01",
      },
      {
        id: "3",
        name: "Industry-Academia Collaboration Project",
        description: "AI defect detection solution for manufacturing sites",
        due_date: "2025-09-30",
        last_practiced_at: "2023-11-01",
      },
    ];
    setOngoingProjectData(data);
    setProjectCount(data.length);
    setAvgScore(85);
  }, []);

  return (
    <div className="px-main">
      <header className="flex items-center justify-between fixed top-0 left-0 px-toolbar_inner w-full h-component_height z-50 bg-background">
        <Image src="/logo-sm.svg" alt="Logo" width={22} height={22} />
        <span className="text-xl font-bold text-icon_default">PLAVO</span>
        <Link href={"/login"}><Settings className="w-icon h-icon text-icon_default" /></Link>
      </header>

      <div className="flex flex-col pt-component_height gap-2">

        <Card className="flex flex-col p-4 shadow-none border-none">
          <Link className="flex items-center" href={"/project/create"}>
            <div className="mr-4 w-icon_box h-icon_box flex items-center justify-center bg-background rounded-xl">
              <SquarePlus className="w-icon h-icon text-color_main1" />
            </div>
            <span className="text-lg font-bold text-color_main1">Start New Project</span>
            <ChevronRight className="w-icon h-icon text-icon_default ml-auto" />
          </Link>
        </Card>

        <Card className="flex flex-col shadow-none border-none px-4 pb-4">
          <div className="flex items-center h-component_height text-sm font-bold text-text_sub">Ongoing Projects</div>
          {
            onGoingProjectData.length === 0 ?
              <div className="flex items-center h-component_height flex-col justify-center">
                <span className="font-bold text-base text-text_sub">No ongoing projects!</span>
                <span className="font-bold text-xs text-text_sub">Start a new project!</span>
              </div>
              :
              <div className="flex flex-col">
                {
                  onGoingProjectData.map((project) => (
                    <Link key={project.id} href={`/project/${project.id}`}>
                      <div className="flex h-component_height items-center justify-left gap-4">
                        <div className="w-icon_box h-icon_box flex items-center justify-center bg-background rounded-xl">
                          <span className="font-extrabold text-xs text-red-500">D-10</span>
                        </div>
                        <div className="flex flex-col items-left">
                          <span className="font-bold text-base text-text_default truncate max-w-[20ch]">
                            {project.name}
                          </span>
                          <span className="font-bold text-xs text-text_sub truncate max-w-[30ch]">
                            {project.description}
                          </span></div>
                        <ChevronRight className="w-icon h-icon text-icon_default ml-auto" />
                      </div>
                    </Link>
                  ))
                }
              </div>
          }
        </Card>

        <Card className="flex items-center shadow-none border-none p-4 gap-4">
          <div className="flex items-center justify-center w-icon_box h-icon_box bg-background rounded-xl">
            <Folder className="w-icon h-icon text-color_main1" />
          </div>
          <div className="flex h-component_height flex-col justify-center">
            <div>
              <span className="font-bold text-base text-text_default">Total </span>
              <span className="font-bold text-base text-color_main1">{projectCount}</span>
              <span className="font-bold text-base text-text_default"> projects completed!</span>
            </div>
            <span className="font-bold text-xs text-text_sub">View project list</span>
          </div>
          <ChevronRight className="w-icon h-icon text-icon_default ml-auto" />
        </Card>

        <Card className="flex items-center shadow-none border-none p-4 gap-4">
          <div className="flex items-center justify-center w-icon_box h-icon_box bg-background rounded-xl">
            <NotepadText className="w-icon h-icon text-color_main1" />
          </div>
          <div className="flex h-component_height flex-col justify-center">
            <div>
              <span className="font-bold text-base text-text_default">Average Score is </span>
              <span className="font-bold text-base text-color_main1">{avgScore}</span>
              <span className="font-bold text-base text-text_default"> points!</span>
            </div>
            <span className="font-bold text-xs text-text_sub">View presentation report</span>
          </div>
          <ChevronRight className="w-icon h-icon text-icon_default ml-auto" />
        </Card>
      </div>
    </div>
  );
}