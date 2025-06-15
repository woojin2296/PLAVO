"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, House } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export default function Page() {
  return (
    <div className="flex flex-col">
      <ProjectCreateHeader />
      <div className="pt-20">
        <ProjectInfoInputSection />
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

function ProjectInfoInputSection() {
  const [inputValue, setInputValue] = useState<any>({
    projectName: "",
    projectDescription: "",
    dueDate: "",
    goalTime: 0,
  });
  
  // 브라우저에서만 초기 sessionStorage 값을 가져오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      setInputValue({
        projectName: sessionStorage.getItem("project_name") || "",
        projectDescription: sessionStorage.getItem("project_description") || "",
        dueDate: sessionStorage.getItem("project_due_date") || "",
        goalTime: parseInt(sessionStorage.getItem("project_goal_time") || "0"),
      });
    }
  }, []);
  
  // 값이 변경될 때 sessionStorage에 동기화
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("project_name", inputValue.projectName);
      sessionStorage.setItem("project_description", inputValue.projectDescription);
      sessionStorage.setItem("project_due_date", inputValue.dueDate);
      sessionStorage.setItem("project_goal_time", String(inputValue.goalTime));
    }
  }, [inputValue]);

  return (
    <>
      <div className="flex items-end justify-between text-4xl pt-8 p-4 text-text_default">
        프로젝트 정보를 입력해주세요.
      </div>
      <div className="flex flex-col gap-4">
        <TextInputCard
          title="프로젝트 이름"
          value={inputValue.projectName}
          onValueChange={(value: string) => setInputValue({ ...inputValue, projectName: value })}
        />
        <TextInputCard
          title="프로젝트 설명"
          value={inputValue.projectDescription}
          onValueChange={(value: string) => setInputValue({ ...inputValue, projectDescription: value })}
          className={`${inputValue.projectName == "" ? "hidden" : ""}`}
        />
        <TimeInputCard
          title="발표 시간"
          value={inputValue.goalTime}
          onValueChange={(value: number) => setInputValue({ ...inputValue, goalTime: value })}
          className={`${inputValue.projectDescription == "" ? "hidden" : ""}`}
        />
        <DateInputCard
          title="발표 날짜"
          value={inputValue.dueDate}
          onValueChange={(value: string) => setInputValue({ ...inputValue, dueDate: value })}
          className={`${inputValue.goalTime == 0 ? "hidden" : ""}`}
        />
        <Link href={"/project/create/record"}>
          <Card className={`${inputValue.dueDate == 0 ? "hidden" : ""} bg-color_main1`}>
            <CardHeader className="flex items-center justify-center">
              <CardTitle className="flex items-center justify-center text-3xl pt-2 w-full text-white">
                첫 연습 시작하기
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </>
  )
}

function TextInputCard({
  title,
  className,
  value,
  onValueChange,
}: {
  title: string;
  className?: string;
  value: string;
  onValueChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [transcript, setTranscript] = useState("눌러서 음성 입력 시작");

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("이 브라우저는 Web Speech API를 지원하지 않습니다.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let result = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        result += event.results[i][0].transcript;
      }
      setTranscript(result);
    };

    recognition.onerror = (event) => {
      console.error("음성 인식 오류:", event.error);
    };

    recognition.onend = () => {
      console.log("인식 종료됨");
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    recognitionRef.current?.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className={className}>
          <CardHeader className="flex flex-row justify-between my-4">
            <CardTitle className="flex text-3xl pt-2 w-full">
              <div className="text-text_default mr-8 w-1/5">{title}</div>
              <span className="text-text_sub">
                {value !== "" ? value : "입력하기"}
              </span>
            </CardTitle>
            <ChevronRight className="w-10 h-10 text-icon_default" />
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent className="p-8">
        <DialogHeader>
          <DialogTitle className="text-4xl pb-4">프로젝트 이름을 말해주세요.</DialogTitle>
        </DialogHeader>
        <Button
          className="w-full h-[600px] bg-icon_default text-text_default border-none text-2xl hover:bg-icon_selected hover:text-white"
          onTouchStart={startListening}
          onTouchEnd={stopListening}
          onMouseDown={startListening}
          onMouseUp={stopListening}
        >
          {transcript}
        </Button>
        <Button
          className="w-full h-24 bg-color_main1 rounded-xl text-2xl mt-4"
          onClick={() => {
            onValueChange(transcript);
            setOpen(false);
          }}
        >
          적용하기
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function TimeInputCard({
  className,
  title,
  value,
  onValueChange,
}: {
  className?: string;
  title: string;
  value: number;
  onValueChange: (v: number) => void;
}) {
  const [open, setOpen] = useState(false)
  const [tempValue, setTempValue] = useState(value.toString())

  useEffect(() => {
    setTempValue(value.toString())
  }, [value])

  useEffect(() => {
    if (parseInt(tempValue) < 0) {
      setTempValue("0");
    }
  }, [tempValue]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className={className}>
          <CardHeader className="flex flex-row justify-between my-4">
            <CardTitle className="flex text-3xl pt-2 w-full">
              <div className="text-text_default mr-8 w-1/5">{title}</div>
              <span className="text-text_sub">
                {value > 0 ? `${value}분` : "입력하기"}
              </span>
            </CardTitle>
            <ChevronRight className="w-10 h-10 text-icon_default" />
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent className="p-8">
        <DialogHeader>
          <DialogTitle className="text-4xl pb-4">발표 시간을 입력해주세요.</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row items-center justify-center gap-4 my-16">
          <Button 
            className="h-24 w-24 bg-color_main1"
            onClick={() => setTempValue((prev) => (parseInt(prev) - 10).toString())}
          >
              <ChevronsLeft className="w-16 h-16"/>
          </Button>
          <Button 
            className="h-24 w-24 bg-color_main1"
            onClick={() => setTempValue((prev) => (parseInt(prev) - 1).toString())}  
          >
            <ChevronLeft />
          </Button>
          <span className="text-2xl text-center w-56">{tempValue}분</span>
          <Button 
            className="h-24 w-24 bg-color_main1"
            onClick={() => setTempValue((prev) => (parseInt(prev) + 1).toString())}  
          >
            <ChevronRight />
          </Button>
          <Button 
            className="h-24 w-24 bg-color_main1"
            onClick={() => setTempValue((prev) => (parseInt(prev) + 10).toString())}  
          >
            <ChevronsRight />
          </Button>
        </div>
        <Button
          className="w-full h-24 bg-color_main1 rounded-xl text-2xl mt-4"
          onClick={() => {
            const parsed = parseInt(tempValue)
            if (!isNaN(parsed) && parsed >= 0) {
              onValueChange(parsed)
              setOpen(false)
            }
          }}
        >
          적용하기
        </Button>
      </DialogContent>
    </Dialog>
  )
}

function DateInputCard({
  className,
  title,
  value,
  onValueChange,
}: {
  className?: string;
  title: string;
  value: string;
  onValueChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false)
  const [tempValue, setTempValue] = useState(value)

  useEffect(() => {
    setTempValue(value)
  }, [value])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className={className}>
          <CardHeader className="flex flex-row justify-between my-4">
            <CardTitle className="flex text-3xl pt-2 w-full">
              <span className="text-text_default mr-8 w-1/5">{title}</span>
              <span className="text-text_sub">
                {value !== "" ? value : "입력하기"}
              </span>
            </CardTitle>
            <ChevronRight className="w-10 h-10 text-icon_default" />
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent className="p-8">
        <DialogHeader>
          <DialogTitle className="text-4xl pb-4">{title}을 선택해주세요.</DialogTitle>
        </DialogHeader>
        <Input
          type="date"
          className="w-full h-24 text-text_default bg-bg_default rounded-xl text-2xl"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
        />
        <Button
          className="w-full h-24 bg-color_main1 rounded-xl text-2xl mt-4"
          onClick={() => {
            if (tempValue) {
              onValueChange(tempValue)
              setOpen(false)
            }
          }}
        >
          적용하기
        </Button>
      </DialogContent>
    </Dialog>
  )
}
