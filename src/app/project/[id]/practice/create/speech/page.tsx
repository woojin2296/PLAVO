"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState<"start"|"recording"|"finished">("start");
  const [time, setTime] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // --- 녹화 관련 refs ---
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const mimeTypeRef = useRef<string>("");

  // 지원 코덱 중 하나 고르기 (Safari 포함)
  function pickMime(): string {
    const cands = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
      "video/mp4", // Safari 최신
    ];
    for (const m of cands) {
      // @ts-ignore
      if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported?.(m)) return m;
    }
    return ""; // 빈 문자열이면 브라우저가 기본값 결정
  }

  useEffect(() => {
    if (status === "recording") {
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  // 페이지 언마운트 시 스트림 정리 및 녹화기 정리 및 카메라 마이크 정지
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (recorderRef.current) {
        recorderRef.current.stream.getTracks().forEach((track) => track.stop());
        recorderRef.current = null;
      }
    };
  }, []);

  const startRecording = async () => {
    // 카메라 + 마이크 권한
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: true,
    });
    streamRef.current = stream;

    const mime = pickMime();
    mimeTypeRef.current = mime;

    const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    recorderRef.current = rec;
    chunksRef.current = [];

    rec.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };
    rec.onstop = () => {
      // stop 시점에 chunksRef에 데이터 모여 있음
    };

    rec.start(); // timeslice 필요 없으면 생략
  };

  const stopRecordingAndGetBlob = async (): Promise<Blob> => {
    return new Promise((resolve) => {
      const rec = recorderRef.current;
      if (!rec) return resolve(new Blob());
      rec.onstop = () => {
        const type = mimeTypeRef.current || "video/webm";
        const blob = new Blob(chunksRef.current, { type });
        resolve(blob);
      };
      rec.stop();
      // 스트림 정리
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    });
  };

  const handleButtonClick = async () => {
    if (status === "start") {
      setStatus("recording");
      setTime(0);
      await startRecording();
    } else if (status === "recording") {
      setStatus("finished");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // 1) 녹화 종료 후 Blob 생성
      const blob = await stopRecordingAndGetBlob();

      // 2) 서버로 업로드
      const fileExt = blob.type.includes("mp4") ? "mp4" : "webm";
      const file = new File([blob], `practice.${fileExt}`, { type: blob.type || `video/${fileExt}` });
      const fd = new FormData();
      fd.append("file", file);

      const uploadRes = await fetch("/api/video/upload", { method: "POST", body: fd });
      if (!uploadRes.ok) {
        console.error("Upload failed:", await uploadRes.text());
        setStatus("start");
        return;
      }
      const { video_url } = await uploadRes.json();

      // 3) practice 생성 (video_url 포함)
      const res = await fetch(`/api/practices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: params.id,
          type: "Speech",
          duration: time,
          video_url,
        }),
      });
      if (!res.ok) {
        console.error("Failed to create practice:", await res.text());
        setStatus("start");
        return;
      }
      const result = await res.json();

      if (result.practice_id) {
        router.push(`/project/${params.id}/practice/${result.practice_id}`);
      } else {
        console.error("Practice ID not returned:", result);
        setStatus("start");
      }
    }
  };

  return (
    <div className="flex flex-col bg-background">
      <header className="flex items-center justify-between text-text_sub gap-6 fixed top-0 left-0 px-toolbar_inner w-full h-component_height z-50 bg-background">
        <Link href="/"><ArrowLeft className="w-icon h-icon" /></Link>
        <span className="text-xl font-bold">Create Practice</span>
        <div className="w-icon"></div>
      </header>

      <div className="flex min-h-dvh items-center justify-center pt-[43px] pb-component_height">
        <FrontCamera streamRef={streamRef} />
      </div>

      <div className="flex items-center justify-between fixed bottom-0 left-0 my-main p-main w-full h-component_height z-50 bg-background">
        <button
          onClick={handleButtonClick}
          className={`w-full rounded-lg flex items-center justify-center text-white font-bold h-component_height${
            status === "start" ? " bg-color_main1" : " bg-red-500"
          }`}
        >
          {
            status === "start"
              ? "Start"
              : status === "recording"
                ? `Finish ( ${Math.floor(time / 60).toString().padStart(2, "0")} : ${(time % 60).toString().padStart(2, "0")} )`
                : <Loader2 className="animate-spin w-6 h-6" />
          }
        </button>
      </div>
    </div>
  );
}

function FrontCamera({ streamRef }: { streamRef: React.MutableRefObject<MediaStream | null> }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true, // 녹음은 허용
        });
  
        // 🔹 오디오 트랙 제거한 스트림을 따로 만들어서 미리보기 전용으로 씀
        const videoOnlyStream = new MediaStream(stream.getVideoTracks());
  
        if (videoRef.current) {
          videoRef.current.srcObject = videoOnlyStream; // 미리보기는 영상만
        }
  
        // 🔹 녹화용으로는 원본 스트림(streamRef)에 저장
        streamRef.current = stream;
  
      } catch (err) {
        console.error("Camera error:", err);
      }
    }
    initCamera();
  }, []);

  return <video ref={videoRef} autoPlay playsInline className="w-full h-full" />;
}