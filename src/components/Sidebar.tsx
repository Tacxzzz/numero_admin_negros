import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { X, LogOut, UserCheck2, Grid, Calendar } from "lucide-react";
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
import { useEffect, useState } from "react";
import { loginAdmin } from "./api/apiCalls";

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const { user, getAccessTokenSilently, logout } = useAuth0();
  const [userID, setUserID] = useState("none");
  const [dbUpdated, setDbUpdated] = useState(false);
  const location = useLocation(); 
  const [permissionsString, setPermissionsString] = useState([]);


  useEffect(() => {
      if (user && !dbUpdated) {
        const handleUpdate = async () => {
          const dataUpdated = await loginAdmin(user, getAccessTokenSilently);
          if (dataUpdated.dbUpdate) {
            setDbUpdated(dataUpdated.dbUpdate);
            setUserID(dataUpdated.userID);
            setPermissionsString(JSON.parse(dataUpdated.permissions));
            
          } 
        };
        handleUpdate();
      }
    }, [user, dbUpdated, getAccessTokenSilently, logout]);

  const menuItemsMain = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/", permission: "dashboard" },
    { icon: Cuboid, label: "Games", path: "/bets", permission: "games" },
    { icon: Crosshair, label: "Game Types", path: "/gametypes", permission: "games_types" },
    { icon: CalendarCheck2, label: "Draws", path: "/draws", permission: "draws" },
    { icon: Grid, label: "Draw Results", path: "/drawsresults", permission: "draws_results" },
    { icon: Banknote, label: "Cash in history", path: "/cashinhistory", permission: "cashin" },
    { icon: DollarSign, label: "Cash out history", path: "/cashouthistory", permission: "cashout" },
    { icon: Dices, label: "Bets History", path: "/playersbets", permission: "bets" },
    { icon: Trophy, label: "Process Client Winners", path: "/clientwinners", permission: "winners" },
    { icon: Trophy, label: "Player Winners History", path: "/winners", permission: "winners" },
    { icon: Users, label: "Players Management", path: "/users", permission: "players" },
    { icon: Users, label: "Clients Management", path: "/clients", permission: "clients" },
    { icon: BarChart, label: "Logs", path: "/logs", permission: "logs" },
    { icon: UserCheck2, label: "Admin Management", path: "/adminmanagement", permission: "admin_management" },
    { icon: Calendar, label: "Announcements", path: "/announcements", permission: "admin_management" },
    
    { icon: LayoutDashboard, label: "My TEAM Dashboard", path: "/teamdashboard", permission: "team_dashboard" },
    { icon: Users, label: "My TEAM", path: "/teamusers", permission: "team_players" },
  ];
  

  const menuItems = menuItemsMain.filter(item =>
    permissionsString.includes(item.permission)
  );
  

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