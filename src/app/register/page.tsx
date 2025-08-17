"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const isEmailValid = /^\S+@\S+\.\S+$/.test(email);
  const isPwValid = pw.length >= 6;
  const isConfirmPwValid = confirmPw === pw;
  const canSubmit = isEmailValid && isPwValid && !loading;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!canSubmit) return;
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: pw }),
      });

      if (!res.ok) throw new Error("Invalid credentials");
      
      router.replace("/");
      
    } catch (error: any) {
      if (error.message.includes("User already exists")) {
        setErr("User already exists. Please log in.");
      }
      else {
        setErr("Registration failed. Please try again.");
      }
      setLoading(false);
    }
  }

  return (
    <div className="px-sub">

      <header className="flex items-center justify-between fixed top-0 left-0 px-toolbar_inner w-full h-component_height z-50 bg-background">
        <Link href={"/login"}>
          <ArrowLeft className="w-icon h-icon text-text_default" />
        </Link>
        <span className="text-xl font-bold text-icon_default">Register</span>
        <span className="w-icon"></span>
      </header>

      <div className="pt-20 flex flex-col items-left justify-start gap-4">
        <div className="flex text-2xl font-bold text-text_default gap-2">
          <Image src="/logo-sm-color1.svg" alt="Logo" width={25} height={25} />
          <span>Welcome to </span>
          <span className="text-color_main1">PLAVO</span>
          <span>!</span>
        </div>

        <div className="text-base text-text_sub pb-8">
          Create your account and experience personalized AI-driven presentation practice.
        </div>

        <div>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <span className="text-xs font-semibold text-text_default">
                Name
              </span>
              <Input
                id="name"
                type="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-0 border-b-2 border-icon_default text-base bg-transparent h-component_height rounded-none focus:outline-none focus:border-color_main1"
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-text_default">
                E-mail
              </span>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!isEmailValid && email.length > 0}
                className="p-0 border-b-2 border-icon_default text-base bg-transparent h-component_height rounded-none focus:outline-none focus:border-color_main1"
              />
              {!isEmailValid && email.length > 0 && (
                <p className="text-xs text-red-500">Please enter a valid email address.</p>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-text_default">
                Password
              </span>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  aria-invalid={!isPwValid && pw.length > 0}
                  className="p-0 border-b-2 border-icon_default text-base bg-transparent h-component_height rounded-none focus:outline-none focus:border-color_main1"

                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute inset-y-0 right-2 flex items-center px-1 text-icon_default hover:opacity-80"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {!isPwValid && pw.length > 0 && (
                <p className="text-xs text-red-500">Password must be at least 6 characters.</p>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-text_default">Confirm Password</span>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  aria-invalid={!isConfirmPwValid && confirmPw.length > 0}
                  className="p-0 border-b-2 border-icon_default text-base bg-transparent h-component_height rounded-none focus:outline-none focus:border-color_main1"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw((v) => !v)}
                  className="absolute inset-y-0 right-2 flex items-center px-1 text-icon_default hover:opacity-80"
                  aria-label={showConfirmPw ? "Hide password" : "Show password"}
                >
                  {showConfirmPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {!isConfirmPwValid && confirmPw.length > 0 && (
                <p className="text-xs text-red-500">Passwords do not match.</p>
              )}
            </div>

            {err && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {err}
              </div>
            )}

            <Button
              type="submit"
              disabled={!canSubmit}
              className="w-full h-12 text-base font-semibold"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Register"}
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
}