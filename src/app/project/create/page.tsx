"use client";

import Link from "next/link";
import React, { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [goalTime, setGoalTime] = useState(0);
  const [loading, setLoading] = useState(false);

  const isFormValid =
    projectName.trim() !== "" &&
    projectDescription.trim() !== "" &&
    goalTime > 0 &&
    dueDate.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName,
          description: projectDescription,
          due_date: dueDate,
          goal_time: goalTime,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating project:", errorData);
        return;
      }
      const data = await response.json();
      console.log("Project created successfully:", data);
      router.push(`/project/${data.project_id}`);
      
    } catch (error) {
      console.error("Error creating project:", error);
    }
    setLoading(false);
  };

  return (
    <div className="px-sub">
      <header className="flex items-center justify-between text-text_sub gap-6 fixed top-0 left-0 px-toolbar_inner w-full h-component_height z-50 bg-background">
        <Link href={"/"}>
          <ArrowLeft className="w-icon h-icon" />
        </Link>
        <span className="text-xl font-bold">Create Project</span>
        <div className="w-icon"></div>
      </header>

      <div className="flex flex-col pt-component_height gap-2">
        <div className="flex items-end justify-between font-bold text-2xl text-text_default pt-component_height">
          Please enter your project information!
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          {/* Project Name */}
          <div className="text-text_default font-bold text-xs pt-8">Project Name</div>
          <input
            className="border-b-2 border-icon_default font-bold text-xl bg-transparent h-component_height rounded-none focus:outline-none focus:border-color_main1"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          {/* Project Description */}
          <div className="text-text_default font-bold text-xs pt-8">Project Description</div>
          <input
            className="border-b-2 border-icon_default font-bold text-xl bg-transparent h-component_height rounded-none focus:outline-none focus:border-color_main1"
            placeholder="Project Description"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />

          {/* Goal Time */}
          <div className="text-text_default font-bold text-xs pt-8">Goal Time</div>
          <input
            className={`border-b-2 border-icon_default font-bold text-xl bg-transparent h-component_height rounded-none focus:outline-none focus:border-color_main1 ${
              goalTime == 0 ? "text-text_sub" : "text-text_default"
            }`}
            placeholder="Goal Time (in minutes)"
            type="number"
            value={goalTime === 0 ? "" : goalTime}
            onChange={(e) => setGoalTime(Number(e.target.value))}
            min={0}
          />

          {/* Due Date */}
          <div className="text-text_default font-bold text-xs pt-8">Due Date</div>
          <input
            className={`border-b-2 border-icon_default font-bold text-xl bg-transparent h-component_height rounded-none focus:outline-none focus:border-color_main1 ${
              dueDate === "" ? "text-text_sub" : "text-text_default"
            }`}
            type="date"
            lang="en"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`rounded-lg flex items-center justify-center text-white font-bold h-component_height mt-8 ${
              isFormValid && !loading
                ? "bg-color_main1 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
