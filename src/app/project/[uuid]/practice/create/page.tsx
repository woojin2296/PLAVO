"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronLeft, House } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Page({ params }: { params: { uuid: string } }) {
  useEffect(() => {
    const fetchData = async () => {
      await fetch(`/api/project?uuid=${params.uuid}`)
        .then(res => {
          if (!res.ok) {
            throw new Error("Failed to fetch project data");
          }
          return res.json();
        })
        .then(result => {
          sessionStorage.setItem("project_goal_time", result.project.goal_time);
          setTime(parseInt(result.project.goal_time) * 60);
        })
        .catch(err => {
          console.error(err);
        });
    };
    fetchData();

    return () => {
      sessionStorage.removeItem("project_goal_time");
    };
  }, []);

  const timer = useRef<NodeJS.Timeout | null>(null);
  const [time, setTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [sttResults, setSttResults] = useState<any>([]);

  const onRecordingStart = () => {
    setSttResults([]);
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
    sessionStorage.setItem("project_uuid", params.uuid);
    sessionStorage.setItem("practice_id", sttResults[0].id);
    sessionStorage.removeItem("project_goal_time");
    timer.current && clearInterval(timer.current);
  }

  return (
    <div className="flex flex-col bg-black">
      <ProjectRecordHeader uuid={params.uuid} />
      <div className="pt-20 flex flex-col gap-4 bg-black">
        <ControlSection isRecording={isRecording} onRecordingStart={onRecordingStart} onRecordingEnd={onRecordingEnd} time={time} uuid={params.uuid} />
        <STTSection isRecording={isRecording} onSttResults={setSttResults} />
      </div>
      <ScriptSection sttResults={sttResults} />
    </div>
  );
}

function ProjectRecordHeader({ uuid }: { uuid: string }) {
  return (
    <header className="fixed top-0 left-0 px-8 py-4 w-full h-24 z-50 bg-black flex items-center justify-between">
      <Link href={`/project/${uuid}`}><ChevronLeft className="w-8 h-8 text-white" /></Link>
      <span className="text-2xl text-white">연습 생성</span>
      <Link href={"/"}><House className="w-8 h-8 text-white" /></Link>
    </header>
  );
}

function ControlSection(
  { isRecording, onRecordingStart, onRecordingEnd, time, uuid }:
    { isRecording: boolean, onRecordingStart: () => void, onRecordingEnd: () => void, time: number, uuid: string }
) {
  return (
    <div className="flex flex-row gap-4">
      {
        !isRecording ? (
          <Card onClick={onRecordingStart} className="flex flex-col items-center justify-center w-1/2 bg-color_main1 border-none">
            <CardTitle className="text-3xl text-white">
              시작하기
            </CardTitle>
          </Card>
        ) : (
          <EndButton onRecordingEnd={onRecordingEnd} uuid={uuid} />
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
  { onRecordingEnd, uuid }:
    { onRecordingEnd: () => void, uuid: string }
) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={(state) => { setOpen(state); onRecordingEnd() }}>
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
          <Link href={`/project/${uuid}/practice/create/loading`} className=" w-1/2 h-full">
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

function STTSection({
  isRecording,
  onSttResults,
}: {
  isRecording: boolean;
  onSttResults: (results: Array<{ id: string; startMs: number; endMs: number; text: string }>) => void;
}) {
  const audioSocketRef = useRef<WebSocket | null>(null);
  const videoSocketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const videoContextRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    async function enableCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (isRecording) {
          // Audio Context 설정
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
            sampleRate: 16000,
          });
          const source = audioContext.createMediaStreamSource(stream);
          const processor = audioContext.createScriptProcessor(4096, 1, 1);

          audioContextRef.current = audioContext;
          processorRef.current = processor;

          source.connect(processor);
          processor.connect(audioContext.destination);

          // 음성 WebSocket 설정
          const audioSocket = new WebSocket("ws://soboroo.tplinkdns.com:43007");
          audioSocketRef.current = audioSocket;

          audioSocket.onopen = () => console.log("음성 WebSocket 연결 성공");
          audioSocket.onerror = (err) => console.error("음성 WebSocket 에러", err);

          audioSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.start_time != null && data.end_time != null && data.transcript) {
              const { id, start_time: startMs, end_time: endMs, transcript: text } = data;
              onSttResults((prev) => [...prev, { id, startMs, endMs, text }]);
            }
          };

          processor.onaudioprocess = (event) => {
            const inputData = event.inputBuffer.getChannelData(0);
            const buffer = new ArrayBuffer(inputData.length * 2);
            const outputData = new DataView(buffer);

            for (let i = 0; i < inputData.length; i++) {
              let s = Math.max(-1, Math.min(1, inputData[i]));
              outputData.setInt16(i * 2, s < 0 ? s * 32768 : s * 32767, true);
            }

            if (audioSocket.readyState === WebSocket.OPEN) {
              audioSocket.send(buffer);
            }
          };

          // 영상 WebSocket 설정
          const videoSocket = new WebSocket("ws://soboroo.tplinkdns.com:8000/ws/record");
          videoSocketRef.current = videoSocket;

          videoSocket.onopen = () => {
            console.log("영상 WebSocket 연결 성공");
            // 녹화 시작 명령 전송
            videoSocket.send(JSON.stringify({ type: 'start_recording' }));
          };
          videoSocket.onerror = (err) => console.error("영상 WebSocket 에러", err);

          // 영상 녹화 및 전송 설정
          const recorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp8,opus'
          });
          recordedChunksRef.current = [];

          recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              recordedChunksRef.current.push(event.data);
              // 실시간으로 WebSocket을 통해 영상 데이터 전송
              if (videoSocket.readyState === WebSocket.OPEN) {
                videoSocket.send(event.data);
              }
            }
          };

          recorder.start(100); // 100ms마다 데이터 전송
          mediaRecorderRef.current = recorder;
          videoContextRef.current = stream;
        }
      } catch (err) {
        console.error("마이크 및 카메라 접근 실패:", err);
      }
    }

    enableCamera();

    return () => {
      // 자원 정리
      if (audioSocketRef.current) audioSocketRef.current.close();
      if (videoSocketRef.current) {
        // 녹화 중지 명령 전송
        if (videoSocketRef.current.readyState === WebSocket.OPEN) {
          videoSocketRef.current.send(JSON.stringify({ type: 'stop_recording' }));
        }
        videoSocketRef.current.close();
      }
      if (processorRef.current) processorRef.current.disconnect();
      if (audioContextRef.current) audioContextRef.current.close();

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }

      if (videoContextRef.current) {
        videoContextRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isRecording, onSttResults]);

  return <></>;
}

function ScriptSection({ sttResults }: { sttResults: Array<{ startMs: string, endMs: string, text: string }> }) {
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