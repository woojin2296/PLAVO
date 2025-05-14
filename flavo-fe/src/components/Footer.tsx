import { CirclePlus, House, List } from "lucide-react";


export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white h-24 py-8 px-8 z-50 rounded-tl-2xl rounded-tr-2xl border flex items-center justify-center">
      <House className="basis-1/3 h-12 w-12" color="#191D28" />
      <CirclePlus className="basis-1/3 h-12 w-12" color="#B1B9C2" />
      <List className="basis-1/3 h-12 w-12" color="#B1B9C2" />
    </footer>
  );
}