"use client";

import { Card } from "@/components/ui/card";
import { Practice } from "@/lib/practices";
import { BookText, ChevronLeft, ChevronRight, Clapperboard, Mic, PersonStanding, Speech } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string, practiceId: string } }) {
  const [data, setData] = useState<Practice>();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/practices?practice_id=${params.practiceId}`, {
        method: "GET",
      });
      const result = await res.json();
      setData(result.practice);
    };
    fetchData();
  }, [params.practiceId]);

  return (
    <div className="px-sub">

      <header className="flex items-center justify-between fixed top-0 left-0 px-toolbar_inner w-full h-component_height z-50 bg-background">
        <Link href={`/project/${params.id}`}><ChevronLeft className="w-icon h-icon text-icon_default" /></Link>
        <span className="text-xl font-bold text-icon_default">{data?.type} Practice</span>
        <span className="w-icon h-icon" />
      </header>

      <div className="pt-component_height py-2">
        {
          data?.id ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Card className="w-1/3 flex flex-col items-center mt-2 px-3 py-3 shadow-none border-none gap-2">
                  <span className="text-sm text-text_default">Speed</span>
                  <span className="font-bold text-2xl text-color_main3">Good</span>
                </Card>
                <Card className="w-1/3 flex flex-col items-center mt-2 px-3 py-3 shadow-none border-none gap-2">
                  <span className="text-sm text-text_default">Pronunciation</span>
                  <span className="font-bold text-2xl text-color_main3">Good</span>
                </Card>
                <Card className="w-1/3 flex flex-col items-center mt-2 px-3 py-3 shadow-none border-none gap-2">
                  <span className="text-sm text-text_default">Pose</span>
                  <span className="font-bold text-2xl text-color_main1">Perfect!</span>
                </Card>
              </div>

              <span className="flex mt-2 px-1 pt-3 text-text_default">
                Reports
              </span>
              <Link href={`/project/${params.id}/practice/${params.practiceId}/reports/speed`}>
                <Card className="flex flex-col p-4 shadow-none border-none gap-2">
                  <div className="flex items-center">
                    <Mic className="w-icon h-icon text-color_main1 mr-2" />
                    <span className="text-sm font-bold text-text_default">Speech Speed Report</span>
                    <span className="text-xs text-text_sub ml-auto">See Detail</span>
                    <ChevronRight className="w-6 h-icon text-icon_default" />
                  </div>
                  <span className="text-xs">
                    In the opening and middle sections, the pace tends to be slower, while in the conclusion the overall speed increases. Adjust the overall timing to maintain a consistent pace throughout the presentation.
                  </span>           
                </Card>
              </Link>
              <Link href={`/project/${params.id}/practice/${params.practiceId}/reports/speed`}>
                <Card className="flex flex-col p-4 shadow-none border-none gap-2">
                  <div className="flex items-center">
                    <Speech className="w-icon h-icon text-color_main1 mr-2" />
                    <span className="text-sm font-bold text-text_default">Pronunciation Report</span>
                    <span className="text-xs text-text_sub ml-auto">See Detail</span>
                    <ChevronRight className="w-6 h-icon text-icon_default" />
                  </div>
                  <span className="text-xs">
                    Words such as “presentation” and “improvement” showed lower pronunciation accuracy. Since both words share the /p/ sound, focus on practicing this consonant carefully to strengthen and refine your pronunciation.
                  </span>
                </Card>
              </Link>
              <Link href={`/project/${params.id}/practice/${params.practiceId}/reports/speed`}>
                <Card className="flex flex-col p-4 shadow-none border-none gap-2">
                  <div className="flex items-center">
                    <PersonStanding className="w-icon h-icon text-color_main1 mr-2" />
                    <span className="text-sm font-bold text-text_default">Presentation Pose Report</span>
                    <span className="text-xs text-text_sub ml-auto">See Detail</span>
                    <ChevronRight className="w-6 h-icon text-icon_default" />
                  </div>
                  <span className="text-xs">
                  No negative gestures were detected during the presentation. Please maintain your current posture and delivery style.
                  </span>
                </Card>
              </Link>

              <span className="flex mt-2 px-1 pt-3 text-text_default">
                Resources
              </span>
              <Card className="flex flex-col p-4 shadow-none border-none">
                <Link className="flex items-center" href={"/project/create"}>
                  <div className="mr-4 w-icon_box h-icon_box flex items-center justify-center bg-background rounded-xl">
                    <Clapperboard className="w-icon h-icon text-color_main1" />
                  </div>
                  <span className="text-lg font-bold text-text_default">View Full Video</span>
                  <ChevronRight className="w-icon h-icon text-icon_default ml-auto" />
                </Link>
              </Card>
              <Card className="flex flex-col p-4 shadow-none border-none">
                <Link className="flex items-center" href={"/project/create"}>
                  <div className="mr-4 w-icon_box h-icon_box flex items-center justify-center bg-background rounded-xl">
                    <BookText className="w-icon h-icon text-color_main1" />
                  </div>
                  <span className="text-lg font-bold text-text_default">View Full Script</span>
                  <ChevronRight className="w-icon h-icon text-icon_default ml-auto" />
                </Link>
              </Card>
              <Card className="flex flex-col p-4 shadow-none border-none">
                <Link className="flex items-center" href={"/project/create"}>
                  <div className="mr-4 w-icon_box h-icon_box flex items-center justify-center bg-background rounded-xl">
                    <PersonStanding className="w-icon h-icon text-color_main1" />
                  </div>
                  <span className="text-lg font-bold text-text_default">View Pose Estimation</span>
                  <ChevronRight className="w-icon h-icon text-icon_default ml-auto" />
                </Link>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center h-screen text-2xl text-text_sub">
              연습 결과를 불러오는 중입니다...
            </div>
          )
        }
      </div>
    </div>
  );
}
