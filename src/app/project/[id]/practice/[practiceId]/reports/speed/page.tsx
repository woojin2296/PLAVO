"use client";

import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Page({ params }: { params: { id: string, practiceId: string } }) {
  const data = [
    { start_time: 0, end_time: 3, text: "Good morning everyone, thank you" },
    { start_time: 3, end_time: 7, text: "for being here today. I" },
    { start_time: 7, end_time: 10, text: "would like to talk about" },
    { start_time: 10, end_time: 14, text: "the importance of effective communication" },
    { start_time: 14, end_time: 16, text: "in our daily lives. Communication" },
    { start_time: 16, end_time: 19, text: "is not only about exchanging" },
    { start_time: 19, end_time: 23, text: "information but also about building" },
    { start_time: 23, end_time: 26, text: "relationships and understanding others. In" },
    { start_time: 26, end_time: 30, text: "professional environments, strong communication" },
    { start_time: 30, end_time: 32, text: "skills help us collaborate more efficiently" },
    { start_time: 32, end_time: 35, text: "and avoid misunderstandings. Whether it" },
    { start_time: 35, end_time: 39, text: "is in meetings, presentations, or" },
    { start_time: 39, end_time: 42, text: "teamwork, the ability to convey" },
    { start_time: 42, end_time: 46, text: "ideas clearly can determine success" },
    { start_time: 46, end_time: 48, text: "or failure. Listening carefully is" },
    { start_time: 48, end_time: 52, text: "equally important because it shows" },
    { start_time: 52, end_time: 55, text: "respect and helps us learn." },
    { start_time: 55, end_time: 58, text: "Finally, improving communication is a" },
    { start_time: 58, end_time: 61, text: "lifelong process. We should always" },
    { start_time: 61, end_time: 65, text: "seek feedback, practice regularly, and" },
    { start_time: 65, end_time: 68, text: "adapt to different audiences. By" },
    { start_time: 68, end_time: 72, text: "doing so, we not only" },
    { start_time: 72, end_time: 74, text: "enhance our personal growth but" },
    { start_time: 74, end_time: 78, text: "also contribute positively to the" },
    { start_time: 78, end_time: 81, text: "communities we are part of." }
  ]
  return (
    <div className="px-sub">

      <header className="flex items-center justify-between fixed top-0 left-0 px-toolbar_inner w-full h-component_height z-50 bg-background">
        <Link href={`/project/${params.id}`}><ChevronLeft className="w-icon h-icon text-icon_default" /></Link>
        <span className="text-xl font-bold text-icon_default">Speech Practice</span>
        <span className="w-icon h-icon" />
      </header>

      <div className="pt-component_height py-2">
        {
          data.map((item, index) => {
            return (
              <Card key={index} className="h-full flex flex-row items-center mt-2 py-0 shadow-none border-none gap-2">
                <div className="w-[5px] h-full p-2 rounded-lg bg-color_main1">&nbsp;</div>
                <div className="flex flex-col">
                  <div className="text-xs text-text_sub">
                    {Math.floor(item.start_time / 60).toString().padStart(2, "0")} : {(item.start_time % 60).toString().padStart(2, "0")} ~ {Math.floor(item.end_time / 60).toString().padStart(2, "0")} : {(item.end_time % 60).toString().padStart(2, "0")}
                  </div>
                  <div className="flex-1 text-sm">{item.text}</div>
                </div>
                
                
              </Card>
            );
          })
        }
      </div>
    </div>
  );
}
