"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Practice } from "@/lib/practices";
import { BookText, ChevronLeft, ChevronRight, Clapperboard, ClipboardPlus, Mic, PersonStanding, Speech, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Page({ params }: { params: { id: string, practiceId: string } }) {
  const [data, setData] = useState<Practice>();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration || 0);
    setCurrentTime(v.currentTime || 0);
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const newTime = Number(e.target.value);
    v.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const vol = Number(e.target.value);
    v.volume = vol;
    setVolume(vol);
    if (vol > 0 && muted) {
      v.muted = false;
      setMuted(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const goFullscreen = async () => {
    const v = videoRef.current as any;
    if (!v) return;
    try {
      if (v.requestFullscreen) await v.requestFullscreen();
      else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen(); // iOS Safari
    } catch (e) {
      console.error(e);
    }
  };

  const formatTime = (sec: number) => {
    if (!isFinite(sec)) return "00:00";
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/practices?practice_id=${params.practiceId}`, {
        method: "GET",
      });
      const result = await res.json();
      setData(result.practice);
    };
    fetchData();
  }, []);

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


              {/* 
              <div className="w-full">
                <video
                  ref={videoRef}
                  width="100%"
                  height="360"
                  controls={false}
                  playsInline
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  src={data.video_url}
                >
                  브라우저가 video 태그를 지원하지 않습니다.
                </video>
                <div className="mt-2 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text_sub w-10 text-right">{formatTime(currentTime)}</span>
                    <input
                      type="range"
                      min={0}
                      max={Math.max(0, duration)}
                      step={0.1}
                      value={currentTime}
                      onChange={handleSeek}
                      className="flex-1 accent-color_main1"
                    />
                    <span className="text-xs text-text_sub w-10">{formatTime(duration)}</span>
                  </div>

                  <div className="flex items-center gap-3 flex-col">
                    <button onClick={togglePlay} className="px-3 py-1 rounded bg-icon_selected text-white text-sm">
                      {isPlaying ? "Pause" : "Play"}
                    </button>

                    <button onClick={toggleMute} className="px-3 py-1 rounded border text-sm">
                      {muted || volume === 0 ? "Unmute" : "Mute"}
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text_sub">Vol</span>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={muted ? 0 : volume}
                        onChange={handleVolume}
                        className="w-40 accent-color_main1"
                      />
                    </div>

                    <button onClick={goFullscreen} className="ml-auto px-3 py-1 rounded border text-sm">Fullscreen</button>
                  </div>
                </div>
              </div> */}
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


function ChartAreaDefault() {
  const min = 120, max = 180;

  const chartData = [
    { wpm: 148 }, { wpm: 158 }, { wpm: 134 }, { wpm: 109 }, { wpm: 95 },
    { wpm: 96 }, { wpm: 79 }, { wpm: 88 }, { wpm: 90 }, { wpm: 80 },
    { wpm: 85 }, { wpm: 78 }, { wpm: 84 }, { wpm: 105 }, { wpm: 109 },
    { wpm: 110 }, { wpm: 132 }, { wpm: 154 }, { wpm: 161 }, { wpm: 167 },
    { wpm: 175 }, { wpm: 184 }, { wpm: 195 }, { wpm: 206 }, { wpm: 209 },
    { wpm: 190 }, { wpm: 197 }, { wpm: 210 }, { wpm: 230 }, { wpm: 249 },
    { wpm: 237 }, { wpm: 221 }, { wpm: 196 }, { wpm: 202 }, { wpm: 192 },
    { wpm: 185 }, { wpm: 170 }, { wpm: 158 }, { wpm: 134 }, { wpm: 128 },
    { wpm: 115 }, { wpm: 139 }, { wpm: 122 }, { wpm: 142 }, { wpm: 164 },
    { wpm: 150 }, { wpm: 171 }, { wpm: 194 }, { wpm: 180 }, { wpm: 196 },
    { wpm: 171 }, { wpm: 158 }, { wpm: 170 }, { wpm: 185 }, { wpm: 207 },
    { wpm: 215 }, { wpm: 195 }, { wpm: 218 }, { wpm: 225 }, { wpm: 241 },
    { wpm: 226 }, { wpm: 233 }, { wpm: 216 }, { wpm: 229 }, { wpm: 240 },
    { wpm: 235 }, { wpm: 218 }, { wpm: 194 }, { wpm: 214 }, { wpm: 205 },
    { wpm: 228 }, { wpm: 235 }, { wpm: 217 }, { wpm: 229 }, { wpm: 244 },
    { wpm: 239 }, { wpm: 220 }, { wpm: 195 }, { wpm: 171 }, { wpm: 146 },
    { wpm: 166 }, { wpm: 152 }, { wpm: 174 }, { wpm: 157 }, { wpm: 174 },
    { wpm: 191 }, { wpm: 202 }, { wpm: 225 }, { wpm: 203 }, { wpm: 179 },
    { wpm: 190 }, { wpm: 175 }, { wpm: 150 }, { wpm: 165 }, { wpm: 177 },
    { wpm: 162 }, { wpm: 174 }, { wpm: 170 }, { wpm: 195 }, { wpm: 178 },
  ];

  // 정상/비정상 데이터 분리 (색 오버레이용)
  const abnormalData = chartData.map(d =>
    d.wpm < min || d.wpm > max ? { wpm: d.wpm } : { wpm: null }
  );

  return (
    <div style={{ width: 500, height: 100 }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <YAxis
            type="number"
            hide={true}
            domain={[min - 20, max + 20]}
          />

          {/* 1) 얇은 '베이스 라인'을 전체에 먼저 그려 연속성 확보 */}
          <Line
            dataKey="wpm"
            type="linear"
            dot={false}
            stroke="#3182F7"
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Line
            data={abnormalData}
            dataKey="wpm"
            type="linear"
            dot={false}
            stroke="#ef4444"
            strokeWidth={2}
            connectNulls={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}