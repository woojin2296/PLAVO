"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const listener = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const { sub } = event.data;

      const res = await fetch("/api/user?sub="+ sub);
      const result = await res.json();

      if (res.status == 200) {
        sessionStorage.setItem("user_sub", result.user.sub);
        sessionStorage.setItem("user_name", result.user.name);
        router.push("/");
      } 
      else if (res.status == 404) {
        sessionStorage.setItem("user_sub", sub);
        router.push("/login/register");
      }
      else {
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
        router.push("/login");
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [router]);

  return (
    <>
      <LoginHeader />
      <div className="pt-20">
        <div className="m-20 flex flex-col items-center justify-start">
          <LoginTitle />
          <LoginCard />
        </div>
      </div>
    </>
  );
}

function LoginHeader() {
  return (
    <header className="fixed top-0 left-0 px-8 py-4 w-full h-24 z-50 bg-[#F3F4F6] flex items-center justify-center">
      <span className="text-2xl text-icon_default">로그인</span>
    </header>
  );
}

function LoginTitle() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-4">PLAVO에 오신 것을 환영합니다.</h1>
      <p className="text-text_sub text-2xl mb-16">PLAVO에서 AI 기반의 개인화된 발표 연습 서비스를 만나보세요.</p>
    </>
  );
}

function LoginCard() {
  const openGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    const redirect_uri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;
    const oauthURL = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    oauthURL.searchParams.set("client_id", clientId);
    oauthURL.searchParams.set("redirect_uri", redirect_uri);
    oauthURL.searchParams.set("response_type", "token id_token");
    oauthURL.searchParams.set("scope", "openid email profile");
    oauthURL.searchParams.set("prompt", "select_account");
    oauthURL.searchParams.set("nonce", "plabvo-login");
    window.open(
      oauthURL.toString(),
      "GoogleLogin",
      "width=500,height=600"
    );
  };

  return (
    <Card className="w-2/3 flex flex-col items-center justify-center p-8">
      <CardHeader>
        <CardDescription className="text-text_sub text-2xl mb-4">
          로그인 후 시작할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center jufsity-center">
          <Input type="text" placeholder="이메일" className="w-full mb-4 px-10 py-8 border border-gray-300 rounded text-2xl" />
          <Input type="password" placeholder="비밀번호" className="w-full mb-4 px-10 py-8 border border-gray-300 rounded text-2xl" />
          <Button className="w-full mb-4 px-10 py-8 text-2xl">로그인</Button>
        </div>
        <div className="w-full flex flex-col items-center jufsity-center gap-4">
          <div className="flex w-full flex-row items-center justify-center">
            <Separator className="m-2 w-1/2" />
            <span className="text-center text-text_sub">or</span>
            <Separator className="m-2 w-1/2" />
          </div>
          <a onClick={openGoogleLogin} className="w-full text-center px-10 py-4 bg-[#DB4437] text-2xl text-white rounded transition-colors">
            구글로 로그인하기
          </a>
          <a href="/login/kakao" className="w-full text-center px-10 py-4 bg-[#FEE500] text-2xl rounded transition-colors">
            카카오로 로그인하기
          </a>
          <a href="/login/naver" className="w-full text-center px-10 py-4 bg-green-500 text-2xl text-white rounded transition-colors">
            네이버로 로그인하기
          </a>
        </div>
      </CardContent>
    </Card>
  )
}