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
  Presentation,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="px-sub">

      <header className="flex items-center justify-between fixed top-0 left-0 px-toolbar_inner w-full h-component_height z-50 bg-background">
        <Link href={`/project/${params.id}`}><ChevronLeft className="w-icon h-icon text-icon_default" /></Link>
        <span className="text-xl font-bold text-icon_default">Create Project</span>
        <span className="w-icon h-icon" />
      </header>

      <div className="flex flex-col pt-component_height gap-2">

        <Card className="mt-2 px-3 py-3 shadow-none border-none">
            <Link className="flex items-center py-2" href={`/project/${params.id}/practice/create/speech`}>
            <div className="mr-4 w-icon_box h-icon_box flex items-center justify-center bg-background rounded-xl">
                <Plus className="w-icon h-icon text-text_sub" />
            </div>
            <span className="text-lg font-bold text-text_sub">Speech Practice</span>
            <ChevronRight className="w-icon h-icon text-icon_default ml-auto" />
            </Link>
        </Card>

        <Card className="mt-2 px-3 py-3 shadow-none border-none">
            <Link className="flex items-center py-2" href={`/project/${params.id}/practice/create/qna`}>
              <div className="mr-4 w-icon_box h-icon_box flex items-center justify-center bg-background rounded-xl">
                  <Plus className="w-icon h-icon text-text_sub" />
              </div>
              <span className="text-lg font-bold text-text_sub">Q&A Practice</span>
              <ChevronRight className="w-icon h-icon text-icon_default ml-auto" />
            </Link>
        </Card>

      </div>
    </div>
  );
}