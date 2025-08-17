"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      router.push("/");
    }
  };

  return (
    <div className="px-sub">

      <header className="flex items-center justify-between fixed top-0 left-0 px-toolbar_inner w-full h-component_height z-50 bg-background">
        <Link href={"/"}>
          <ArrowLeft className="w-icon h-icon text-text_default" />
        </Link>
        <span className="text-xl font-bold text-icon_default">Menu</span>
        <span className="w-icon"></span>
      </header>

      <div className="pt-20 flex flex-col items-left justify-start gap-4">
        <Button 
          className="w-full h-12 text-base font-semibold" 
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}