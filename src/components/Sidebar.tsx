import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { X, LogOut, UserCheck2 } from "lucide-react";
import {
  LayoutDashboard,
  Coins,
  CalendarCheck2,
  Users,
  BarChart,
  Settings,
  Trophy,
  Dices,
  ShieldCheck,
  Banknote,
  DollarSign , 
  Cuboid,
  Crosshair,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DtakaLogoBeta from "@/assets/DtakaLogoBeta.svg";
import { useAuth0 } from '@auth0/auth0-react';
import { MdMoney } from "react-icons/md";

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const { logout} = useAuth0();
  const location = useLocation(); 

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Cuboid, label: "Games", path: "/bets" },
    { icon: Crosshair, label: "Game Types", path: "/draws" },
    { icon: CalendarCheck2, label: "Draws", path: "/#" },
    { icon: Banknote, label: "Cash in history", path: "/#" },
    { icon: DollarSign, label: "Cash out history", path: "/#" },
    { icon: Dices, label: "Bets History", path: "/playersbets" },
     
    // { icon: Trophy, label: "Winnings", path: "/winnings" },
    // { icon: Users, label: "Users", path: "/customers" },
    { icon: Trophy, label: "Winners History", path: "/#" },
    { icon: Users, label: "Players Management", path: "/#" },
    { icon: Users, label: "Agents Management", path: "/#" },
    { icon: Users, label: "Agent Clients Management", path: "/#" },
    // { icon: Users, label: "Hierarchy", path: "/hierarchy" },
    { icon: BarChart, label: "Logs", path: "/logs" },
    { icon: UserCheck2, label: "Admin Management", path: "/adminmanagement" },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-white">
      <div className="flex items-center justify-between p-6">
        {/* <img
              src={DtakaLogoBeta}
              alt="Logo"
              className="w-auto h-10 transform group-hover:scale-110 transition-transform duration-200"
        /> */}
        <h1 className="text-2xl font-bold">PisoPlay Admin</h1>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        )}
      </div>
      <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md",
              location.pathname === item.path
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon className="mr-3 h-6 w-6" />
            {item.label}
          </Link>
        ))}
      </nav>
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
    </div>
  );
}