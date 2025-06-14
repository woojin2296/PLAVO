"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.substring(1));
    const idToken = hash.get("id_token");
    const payload = idToken ? JSON.parse(atob(idToken.split('.')[1])) : null;
    const sub = payload.sub;

    if (sub && window.opener) {
      window.opener.postMessage({ sub }, window.location.origin);
      window.close();
    }
  }, []);

  return (
    <main className="flex h-screen items-center justify-center">
      <p className="text-gray-600">로그인 처리 중...</p>
    </main>
  );
}