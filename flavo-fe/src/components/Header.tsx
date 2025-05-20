import { ChevronLeft, CircleUserRound, House, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HomeHeader() {
  return (
    <header className="fixed top-0 left-0 px-8 py-4 w-full h-24 z-50 bg-[#F3F4F6] flex items-center justify-between">
      <Image src="/logo-sm.svg" alt="Logo" width={45} height={45} />
      <span className="text-2xl text-icon_default">PLAVO</span>
      <CircleUserRound className="w-8 h-8 text-icon_default" />
    </header>
  );
}

export function ProjectCreateHeader() {
  return (
    <header className="fixed top-0 left-0 px-8 py-4 w-full h-24 z-50 bg-[#F3F4F6] flex items-center justify-between">
      <Link href={"/"}><ChevronLeft className="w-8 h-8 text-icon_default" /></Link>
      <span className="text-2xl text-icon_default">프로젝트 생성</span>
      <Link href={"/"}><House className="w-8 h-8 text-icon_default" /></Link>
    </header>
  );
}

export function ProjectListHeader() {
  return (
    <header className="fixed top-0 left-0 px-8 py-4 w-full h-24 z-50 bg-[#F3F4F6] flex items-center justify-between">
      <Link href={"/"}><ChevronLeft className="w-8 h-8 text-icon_default" /></Link>
      <span className="text-2xl text-icon_default">프로젝트 목록</span>
      <Search className="w-8 h-8 text-icon_default" />
    </header>
  );
}

export function ProjectHeader() {
  return (
    <header className="fixed top-0 left-0 px-8 py-4 w-full h-24 z-50 bg-[#F3F4F6] flex items-center justify-between">
      <Link href={"/project/list"}><ChevronLeft className="w-8 h-8 text-icon_default" /></Link>
      <span className="text-2xl text-icon_default">프로젝트</span>
      <Link href={"/"}><House className="w-8 h-8 text-icon_default" /></Link>
    </header>
  );
}