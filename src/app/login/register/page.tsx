"use client";

import { LoginHeader } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [name, setName] = useState("");
  const router = useRouter();
  
  const handleNext = async () => {
    const sub = sessionStorage.getItem("user_sub");
    const res = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({
        name : name,
        sub: sub
      })
    });
    const data = await res.json();

    if (res.status == 201) {
      sessionStorage.setItem("user_name", data.user.name);
      console.log("User created:", data.user);
      router.push("/");
      return;
    }
    else {
      console.error("Error creating user:", data);
      alert("사용자 생성에 실패했습니다. 다시 시도해주세요.");
      return;
    }
  }

  return (
    <>
      <LoginHeader />
      <div className="pt-20">
        <div className="m-20 flex flex-col items-center justify-start">
          <h1 className="text-4xl font-bold mb-4">PLAVO에 오신 것을 환영합니다.</h1>
          <p className="text-text_sub text-2xl mb-16">PLAVO에서 AI 기반의 개인화된 발표 연습 서비스를 만나보세요.</p>
          <Card className="w-2/3 flex flex-col items-center justify-center p-8">
            <CardHeader>
              <CardDescription className="text-text_sub text-center text-2xl mb-4">
                환영합니다. 첫 방문이시군요!
              </CardDescription>
              <CardDescription className="text-text_sub text-2xl mb-4">
                저희가 어떤 이름으로 불러드릴까요?
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center mt-4">
              <Input 
                type="text" 
                placeholder="이름을 입력해주세요" 
                className="w-full mb-4 px-10 py-8 border border-gray-300 rounded text-2xl text-center"
                value={name}
                onChange={(e) => setName(e.target.value)} 
              />
              <TextInputCard onValueChange={(value: string) => setName(value)} />
              <Button 
                className="w-full h-[60px] text-center px-10 py-4 bg-color_main1 text-2xl text-white rounded transition-colors"
                onClick={handleNext}
              >
                입력하기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function TextInputCard({
  onValueChange,
}: {
  onValueChange: (v: string) => void;
}) {
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
    onValueChange(transcript);
  };

  return (
    <>
      <Button
            className="w-full h-20 mb-4 bg-icon_default text-text_default border-none text-2xl hover:bg-icon_selected hover:text-white"
            onTouchStart={startListening}
            onTouchEnd={stopListening}
            onMouseDown={startListening}
            onMouseUp={stopListening}
          >
        눌러서 음성 입력하기
      </Button>
    </>
  );
}
