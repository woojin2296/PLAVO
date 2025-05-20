"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
} from "recharts"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { ChartPie, ChevronRight, FileQuestion, Pin, Presentation, Settings, SquarePlus, TrendingUp } from "lucide-react";
import { Separator } from "./ui/separator";
import React from "react";
import Link from "next/link";
import { PracticeInfo, ProjectInfo, QnAInfo } from "@/lib/types";
import { Button } from "./ui/button";

export function ProjectInfoInputSection() {
  const [inputValue, setInputValue] = React.useState<>({
    projectName: "",
    dueDate: "",
    goalTime: 0
  });

  return (
    <>
      <div className="flex items-end justify-between text-4xl pt-8 p-4 text-bold text-text_default">
        프로젝트 정보를 입력해주세요.
      </div>
      <div className="flex flex-col gap-4">
        <InputCard title="프로젝트 이름" value="" />
        <InputCard title="발표 시간" value="" className={`${inputValue.projectName == "" ? "hidden" : ""}`} />
        <InputCard title="발표 날짜" value="" className={`${inputValue.goalTime == 0 ? "hidden" : ""}`} />
      </div>
    </>
  )
}

export function InputCard({ className, title, value }: { className?: string, title: string, value: string }) {
  return (
    <Dialog>
      <DialogTrigger>
        <Card className={`${className}`}>
          <CardHeader className="flex flex-row justify-between my-4">
            <CardTitle className="text-3xl pt-2">
              <span className="text-text_default mr-8">{title}</span>
              <span className="text-text_sub">
                {
                  value != "" ? value : "입력하기"
                }
              </span>
            </CardTitle>
            <ChevronRight className="w-10 h-10 text-icon_default" />
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent className="p-8">
        <DialogHeader>
          <DialogTitle className="text-4xl pb-4">아래 버튼을 꾹 누른 후 말씀해주세요.</DialogTitle>
        </DialogHeader>
        <Button className="h-full m-0 p-0 rounded-xl">
          <Card className="w-full">
            <CardContent className="mt-6">
              <CardTitle className="text-3xl text-text_default flex flex-row items-center justify-between py-8">
                <Presentation className="mx-8 w-12 h-12 text-icon_default" />
                발표 연습
                <ChevronRight className="mx-8 w-12 h-12 text-icon_default" />
              </CardTitle>
            </CardContent>
          </Card>
        </Button>
      </DialogContent>
    </Dialog>
  )
}