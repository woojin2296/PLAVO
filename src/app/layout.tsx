"use client";

import React from "react";
import "./globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const isBlackPage = pathname.startsWith("/project/create/record") || 
                      pathname.endsWith("/practice/create") ||
                      pathname.endsWith("/qna/create");
  const bgColor = isBlackPage ? "bg-black" : "bg-[#F3F4F6]";

  return (
    <html lang="en">
      <body className={`${bgColor}`}>
        <div className={`p-4`}>
          <React.StrictMode>{children}</React.StrictMode>
        </div>
      </body>
    </html>
  );
}