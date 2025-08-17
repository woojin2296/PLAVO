"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, House } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from 'next/image'; // Ensure correct import for Image component

export default function Page({ params }: { params: { uuid: string } }) {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [time, setTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [sttResults, setSttResults] = useState<any>([]);

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
        <ControlSection isRecording={isRecording} setIsRecording={setIsRecording} onRecordingStart={onRecordingStart} onRecordingEnd={onRecordingEnd} time={time} uuid={params.uuid} />
        <STTSection isRecording={isRecording} onSttResults={setSttResults} />
      </div>
      <PPTSection />
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
  { isRecording, setIsRecording, onRecordingStart, onRecordingEnd, time, uuid }:
    { isRecording: boolean, setIsRecording: (value: boolean) => void, onRecordingStart: () => void, onRecordingEnd: () => void, time: number, uuid: string }
) {

  const connectAndSubscribe = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: 'Arduino' }],
        optionalServices: ['12345678-1234-1234-1234-1234567890ab']
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('12345678-1234-1234-1234-1234567890ab');
      const characteristic = await service.getCharacteristic('abcdefab-1234-1234-1234-abcdefabcdef');

      await characteristic.startNotifications();

      characteristic.addEventListener('characteristicvaluechanged', (event) => {
        const value = event.target.value;
        const bytes = new Uint8Array(value.buffer);
        console.log('📥 수신됨:', bytes);
        if (!isRecording) setIsRecording(true);
        else setOpen(true);
      });

      console.log("✅ Notify 수신 대기 중");

    } catch (err: any) {
      console.error("❌ 블루투스 오류:", err);
    }
  };

  return (
    <div className="flex flex-row gap-4">
      {
        !isRecording ? (
          <>
            <Card onClick={connectAndSubscribe} className="flex flex-col items-center justify-center w-1/4 bg-color_main1 border-none">
              <CardTitle className="text-3xl text-white">
                블루투스 연결
              </CardTitle>
            </Card>
            <Card onClick={onRecordingStart} className="flex flex-col items-center justify-center w-1/4 bg-color_main1 border-none">
              <CardTitle className="text-3xl text-white">
                시작하기
              </CardTitle>
            </Card>
          </>
        ) : (
          <>
            <Link href={`/project/${uuid}/practice/create/loading`} className=" w-1/2 h-full" onClick={onRecordingEnd}>
              <Card className="flex flex-col items-center justify-center bg-[red] border-none">
                <CardHeader className="flex items-center justify-center text-3xl text-white h-20 py-0 w-full">
                  <CardTitle className="flex items-center justify-center w-full">
                    완료
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          </>
        )
      }
      <Card className="flex items-center w-1/2 h-full border-none">
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

  const [wpm, setWpm] = useState(0);

  function timeStringToMs(timeStr: string): number {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return ((hours * 60 + minutes) * 60 + seconds) * 1000;
  }

  useEffect(() => {
    async function enableCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (isRecording) {
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
              const { id, transcript: text } = data;

              // 문자열 시간을 밀리초로 변환
              const startMs = timeStringToMs(data.start_time);
              const endMs = timeStringToMs(data.end_time);

              // WPM 계산
              const durationMin = (endMs - startMs) / 60000;
              const wordCount = text.trim().split(/\s+/).length;
              const wpm = Math.round((wordCount / durationMin) * 10) / 10;
              setWpm(wpm);

              onSttResults((prev) => [...prev, { id, startMs, endMs, text }]);
            }
          };

          processor.onaudioprocess = (event) => {
            const inputData = event.inputBuffer.getChannelData(0);
            const buffer = new ArrayBuffer(inputData.length * 2);
            const outputData = new DataView(buffer);

            for (let i = 0; i < inputData.length; i++) {
              const s = Math.max(-1, Math.min(1, inputData[i]));
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

  return (
    <div className="text-white text-2xl">
      현재 WPM : {wpm}
    </div>
  )
}

function PPTSection() {
  const [slide, setSlide] = useState(1);

  const onClick = () => {
    setSlide((prev) => {
      if (prev >= 21) return 1;
      return prev + 1;
    });
  }

  return (
    <Card className="fixed bottom-0 left-0 w-full" onClick={onClick}>
      <Image
        src={`/슬라이드${slide}.png`}
        alt={`Slide ${slide}`}
        width={1920}
        height={1080}
        className="w-full h-auto object-cover rounded-xl"
      />
    </Card>
  );
}