"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronLeft, House } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const goalTime = sessionStorage.getItem("project_goal_time") || "";

  const timer = useRef<NodeJS.Timeout | null>(null);
  const [time, setTime] = useState(parseInt(goalTime) * 60 || 0);
  const [isRecording, setIsRecording] = useState(false);
  const [sttResults, setSttResults] = useState<any>([]);

  const onRecordingStart = () => {
    setSttResults([]);
    setTime(parseInt(goalTime) * 60);
    setIsRecording(true);

    timer.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  const onRecordingEnd = () => {
    sessionStorage.setItem("project_uuid", sttResults[0].id);
    timer.current && clearInterval(timer.current);
  }

  return (
    <div className="flex flex-col bg-black">
      <ProjectRecordHeader />
      <div className="pt-20 flex flex-col gap-4 bg-black">
        <ControlSection isRecording={isRecording} onRecordingStart={onRecordingStart} onRecordingEnd={onRecordingEnd} time={time} />
        <STTSection isRecording={isRecording} onSttResults={setSttResults} />
      </div>
      <ScriptSection sttResults={sttResults} />
    </div>
  );
}

function ProjectRecordHeader() {
  return (
    <header className="fixed top-0 left-0 px-8 py-4 w-full h-24 z-50 bg-black flex items-center justify-between">
      <Link href={"/project/create"}><ChevronLeft className="w-8 h-8 text-white" /></Link>
      <span className="text-2xl text-white">프로젝트 생성</span>
      <Link href={"/"}><House className="w-8 h-8 text-white" /></Link>
    </header>
  );
}

function ControlSection(
  { isRecording, onRecordingStart, onRecordingEnd, time }: 
  { isRecording : boolean, onRecordingStart: () => void, onRecordingEnd: () => void, time: number }
){
  return (
    <div className="flex flex-row gap-4">
      {
        !isRecording ? (
          <Card
            className="flex flex-col items-center justify-center w-1/2 bg-color_main1 border-none"
            onClick={onRecordingStart}
          >
            <CardTitle className="text-3xl text-white">
              시작하기
            </CardTitle>
          </Card>
        ) : (
          <EndButton onRecordingStart={onRecordingStart} onRecordingEnd={onRecordingEnd} />
        )
      }
      <Card className="flex items-center w-1/2">
        <CardHeader className="flex flex-row items-center text-text_default text-3xl h-20 py-0 w-full">
          <CardTitle className="flex items-center justify-center w-1/3">
            남은시간
          </CardTitle>
          <CardTitle className="flex items-center justify-center w-2/3">
            {String(Math.floor(time / 60)).padStart(2, "0")} : {String(time % 60).padStart(2, "0")}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}

function EndButton(
  { onRecordingStart, onRecordingEnd }: 
  { onRecordingStart: () => void, onRecordingEnd: () => void }
) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={(state) => {setOpen(state); onRecordingEnd()}}>
      <DialogTrigger asChild>
        <Card className="flex flex-col items-center justify-center w-1/2 bg-[red] border-none">
          <CardHeader className="flex items-center justify-center text-3xl text-white h-20 py-0 w-full">
            <CardTitle className="flex items-center justify-center w-full">
              완료
            </CardTitle>
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent className="p-8">
        <DialogHeader>
          <DialogTitle className="text-4xl pb-4">연습을 완료하시겠어요?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row gap-4">
          <Card className="flex flex-col items-center justify-center w-1/2 bg-text_sub">
            <CardHeader className="flex items-center justify-center text-3xl text-white h-20 py-0 w-full">
              <CardTitle className="flex items-center justify-center w-full">
                다시하기
              </CardTitle>
            </CardHeader>
          </Card>
          <Link href={"/project/create/loading"} className=" w-1/2 h-full">
            <Card className="flex flex-col items-center justify-center bg-[red]">
              <CardHeader className="flex items-center justify-center text-3xl text-white h-20 py-0 w-full">
                <CardTitle className="flex items-center justify-center w-full">
                  완료
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function STTSection({ isRecording, onSttResults }: { isRecording: boolean, onSttResults: (results: Array<{startMs: number, endMs: number, text: string}>) => void }) {
  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  useEffect(() => {
    async function enableCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: true 
        });

        if (isRecording) {
          // 오디오 컨텍스트 설정
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
            sampleRate: 16000,
          });
          audioContextRef.current = audioContext;

          const source = audioContext.createMediaStreamSource(stream);
          const processor = audioContext.createScriptProcessor(4096, 1, 1);
          processorRef.current = processor;

          source.connect(processor);
          processor.connect(audioContext.destination);

          const socket = new WebSocket('ws://soboroo.tplinkdns.com:43007');
          socketRef.current = socket;

          socket.onopen = () => {
            console.log('WebSocket 연결 성공');
          };

          socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('STT 결과:', data);
            if (data.start_time != null && data.end_time != null && data.transcript) {
              const startMs = data.start_time;
              const endMs = data.end_time;
              const text = data.transcript;
              const id = data.id;
              onSttResults(prev => [...prev, { id, startMs, endMs, text }]);
            }
          };

          socket.onerror = (error) => {
            console.error('WebSocket 에러', error);
          };

          processor.onaudioprocess = (event) => {
            const inputData = event.inputBuffer.getChannelData(0);
            const buffer = new ArrayBuffer(inputData.length * 2);
            const outputData = new DataView(buffer);
            
            for (let i = 0; i < inputData.length; i++) {
              let s = Math.max(-1, Math.min(1, inputData[i]));
              outputData.setInt16(i * 2, s < 0 ? s * 32768 : s * 32767, true);
            }
            
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(buffer);
            }
          };
        }
      } catch (err) {
        console.error("마이크 접근 실패:", err);
      }
    }

    enableCamera();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (processorRef.current) {
        processorRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isRecording, onSttResults]);

  return (<></>);
}

function ScriptSection({ sttResults }: { sttResults: Array<{startMs: string, endMs: string, text: string}> }) {
  return (
    <Card className="fixed bottom-4 left-0 w-full">
      <ScrollArea className="h-48 w-full">
        {
          sttResults.slice().reverse().map((item, index) => (
            <ScriptRow key={index} data={item} />
          ))
        }
        <ScrollBar />
      </ScrollArea>
    </Card>
  )
}

function ScriptRow({ data }: { data: { startMs: string, endMs: string, text: string } }) {
  return (
    <div className="flex flex-row w-full items-center py-2">
      <CardTitle className="flex items-center justify-center text-4xl text-text_sub px-4">
        {data.startMs}
      </CardTitle>
      <CardTitle className="flex items-center text-4xl text-text_default px-4">
        {data.text}
      </CardTitle>
    </div>
  )
}

