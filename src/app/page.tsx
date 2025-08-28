"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Folder, ChevronRight, Menu, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Project } from "@/lib/projects";

export default function Page() {
  const [onGoingProjectData, setOngoingProjectData] = useState<Project[]>([]);
  const [projectCount, setProjectCount] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const onGoingProjectDataResponse = await fetch("/api/projects?ongoing=true");
      const projectCountResponse = await fetch("/api/projects?ongoing=false");

      if (!onGoingProjectDataResponse.ok) {
        console.error("Failed to fetch ongoing projects");
        return;
      }
      if (!projectCountResponse.ok) {
        console.error("Failed to fetch project count");
        return;
      }

      const onGoingProjectDataJson = await onGoingProjectDataResponse.json();
      setOngoingProjectData(onGoingProjectDataJson.projects);

      const projectCountJson = await projectCountResponse.json();
      console.log("Project Count Data:", projectCountJson);
      setProjectCount(projectCountJson.projects.length);
    }

    fetchData();
      
  }, []);

  return (
    <div className="px-main">
      <header className="flex items-center justify-between fixed top-0 left-0 px-toolbar_inner w-full h-component_height z-50 bg-background">
        <Image src="/logo-sm.svg" alt="Logo" width={22} height={22} />
        <span className="text-xl font-bold text-icon_default">PLAVO</span>
        <Link href={"/menu"}><Menu className="w-icon h-icon text-icon_default" /></Link>
      </header>

      <div className="flex flex-col pt-component_height gap-2">

        <Card className="flex flex-col p-4 shadow-none border-none">
          <Link className="flex items-center" href={"/project/create"}>
            <div className="mr-4 w-icon_box h-icon_box flex items-center justify-center bg-background rounded-xl">
              <Plus className="w-icon h-icon text-color_main1" />
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
                  onGoingProjectData.map((project : Project) => (
                    <Link key={project.id} href={`/project/${project.id}`}>
                      <div className="flex h-component_height items-center justify-left gap-4">
                        <div className="w-icon_box h-icon_box flex items-center justify-center bg-background rounded-xl">
                          <span className="font-extrabold text-xs text-red-500">
                            D
                            {Math.floor(
                              (new Date().getTime() - new Date(project.due_date).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}
                          </span>
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
      </div>
    </div>
  );
}
