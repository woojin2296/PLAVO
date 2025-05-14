import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PLAVO",
  description: "AI presentation practice assistant service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="p-4 bg-[#F3F4F6]">
        {children}
      </body>
    </html>
  );
}
