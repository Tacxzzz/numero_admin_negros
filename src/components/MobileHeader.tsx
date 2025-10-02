import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import DtakaLogoBeta from "@/assets/DtakaLogoBeta.svg";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-between border-b bg-white px-4">
      <Button variant="ghost" size="icon" onClick={onMenuClick}>
        <Menu className="h-6 w-6" />
      </Button>
      <h1 className="text-xl font-bold">Capiz Draw Admin</h1>
      {/* <img
            src={DtakaLogoBeta}
            alt="Logo"
            className="w-auto h-10 transform group-hover:scale-110 transition-transform duration-200"
      /> */}
      <div className="w-12" /> {/* Spacer for alignment */}
    </div>
  );
}