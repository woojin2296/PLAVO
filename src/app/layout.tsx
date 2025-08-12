"use client";

import React from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`bg-background`}>
        {children}
      </body>
    </html>
  );
}