"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

type ProjectForm = {
  projectName: string;
  projectDescription: string;
  dueDate: string;
  goalTime: number;
};

export default function Page() {
  const [inputValue, setInputValue] = useState<ProjectForm>({
    projectName: "",
    projectDescription: "",
    dueDate: "",
    goalTime: 0,
  });

  // sessionStorage → state 로드
  useEffect(() => {
    if (typeof window !== "undefined") {
      setInputValue({
        projectName: sessionStorage.getItem("project_name") || "",
        projectDescription: sessionStorage.getItem("project_description") || "",
        dueDate: sessionStorage.getItem("project_due_date") || "",
        goalTime: parseInt(sessionStorage.getItem("project_goal_time") || "0"),
        file: sessionStorage.getItem("project_file") || "",
      });
    }
  }, []);

  // state → sessionStorage 저장
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("project_name", inputValue.projectName);
      sessionStorage.setItem("project_description", inputValue.projectDescription);
      sessionStorage.setItem("project_due_date", inputValue.dueDate);
      sessionStorage.setItem("project_goal_time", String(inputValue.goalTime));
      sessionStorage.setItem("project_file", inputValue.file);
    }
  }, [inputValue]);

  return (
    <div className="px-sub">
      <header className="flex items-center gap-6 fixed top-0 left-0 px-toolbar_inner w-full h-component_height z-50 bg-background">
        <Link href={"/"}>
          <ArrowLeft className="w-icon h-icon text-text_default" />
        </Link>
        <span className="text-xl text-text_default font-bold">Create Project</span>
      </header>

      <div className="flex flex-col pt-component_height gap-2">
        <div className="flex items-end justify-between font-bold text-2xl text-text_default pt-component_height">
          Please enter your project information!
        </div>

        <div className="flex flex-col">
          {/* Project Name */}
          <div className="text-text_default font-bold text-xs pt-8">Project Name</div>
          <input
            className="border-b-2 border-icon_default font-bold text-xl bg-transparent h-component_height rounded-none focus:outline-none focus:border-color_main1"
            placeholder="Project Name"
            value={inputValue.projectName}
            onChange={(e) =>
              setInputValue((prev) => ({ ...prev, projectName: e.target.value }))
            }
          />

          {/* Project Description */}
          <div className="text-text_default font-bold text-xs pt-8">Project Description</div>
          <input
            className="border-b-2 border-icon_default font-bold text-xl bg-transparent h-component_height rounded-none focus:outline-none focus:border-color_main1"
            placeholder="Project Description"
            value={inputValue.projectDescription}
            onChange={(e) =>
              setInputValue((prev) => ({ ...prev, projectDescription: e.target.value }))
            }
          />

          {/* Goal Time */}
          <div className="text-text_default font-bold text-xs pt-8">Goal Time</div>
          <input
            className="border-b-2 border-icon_default font-bold text-xl bg-transparent h-component_height rounded-none focus:outline-none focus:border-color_main1"
            placeholder="Goal Time (in minutes)"
            type="number"
            value={inputValue.goalTime === 0 ? "" : String(inputValue.goalTime)}
            onChange={(e) =>
              setInputValue((prev) => ({
                ...prev,
                goalTime: Number.isNaN(parseInt(e.target.value))
                  ? 0
                  : parseInt(e.target.value),
              }))
            }
            min={0}
          />

          {/* Due Date */}
          <div className="text-text_default font-bold text-xs pt-8">Due Date</div>
          <input
            type="date"
            lang="en"
            value={inputValue.dueDate}
            onChange={(e) =>
              setInputValue((prev) => ({ ...prev, dueDate: e.target.value }))
            }
            className={`border-b-2 border-icon_default font-bold text-xl bg-transparent h-component_height rounded-none focus:outline-none focus:border-color_main1 ${
              inputValue.dueDate ? "text-text_default" : "text-text_sub"
            }`}
          />

          <Link href={"/project/create/loading"} className="pt-8">
            <Card className="flex items-center justify-center text-white font-bold bg-color_main1 h-component_height">
              Create
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}