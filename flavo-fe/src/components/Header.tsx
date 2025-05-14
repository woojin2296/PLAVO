import { ChevronLeft, UserRound } from "lucide-react";
import Image from "next/image";

export function Header(
  {
    hasBackButton,
    hasMenuButton,
    backPath,
    title
  }: { hasBackButton: boolean, hasMenuButton: boolean, backPath?: string, title: string }) {
  return (
    <header className="fixed top-0 left-0 px-8 py-4 w-full h-24 z-50 bg-[#F3F4F6]">
      <div className="flex items-center relative justify-between">
        {
          hasBackButton ?
            <a href={backPath}><ChevronLeft /></a> :
            <Image src="/logo.svg" alt="Logo" width={110} height={110} />
        }
        {title}
        {
          hasMenuButton ?
            <UserRound className="w-8 h-8" color="#B1B9C2" /> :
            <div className="w-8 h-8" />
        }
      </div>
    </header>
  );
}