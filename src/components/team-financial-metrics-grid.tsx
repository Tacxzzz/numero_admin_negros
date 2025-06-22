import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, TrendingUp, Award, BarChart2, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface MetricCardProps {
  id: string;
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  className?: string;
  category: string;
  onClick: () => void;
}

const MetricCard = ({ id, title, value, description, icon, className, onClick }: MetricCardProps) => (
  <Card 
    className={cn("cursor-pointer transition-all hover:shadow-md", className)}
    onClick={onClick}
  >
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </CardContent>
  </Card>
);

interface TabOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface FinancialMetricsGridProps {
  StartDate: string;
  EndDate: string;
  TotalCashin: number;
  TotalCashout: number;
  TotalPlayers: number;
  TotalPlayersActive: number;
  TotalPlayersInactive: number;
  TotalBetsEarned: number;
  TotalCommissions: number;
  TotalWins: number;
}

export function TeamFinancialMetricsGrid({StartDate, EndDate, TotalCashin, TotalCashout, TotalPlayers, TotalPlayersActive, TotalPlayersInactive, TotalBetsEarned, TotalCommissions, TotalWins }: FinancialMetricsGridProps) {
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  // Define tab options with icons and labels
  const tabOptions: TabOption[] = [
    { value: "all", label: "All", icon: <Filter size={16} /> },
    { value: "cash", label: "Cash", icon: <DollarSign size={16} /> },
    { value: "players", label: "Players", icon: <Users size={16} /> },
    { value: "bets", label: "Bets", icon: <TrendingUp size={16} /> },
    { value: "commissions", label: "Commissions", icon: <BarChart2 size={16} /> },
  ];

  const TotalNetCash = TotalCashin - TotalCashout;

  // Define all metrics with their categories
  const metrics = [
    {
      id: "total-cash-in",
      title: "TOTAL CASH IN",
      value: TotalCashin.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2
      }),
      icon: <DollarSign size={18} />,
      category: "cash"
    },
    {
      id: "total-cash-outs-paid",
      title: "TOTAL CASH OUTS - PAID",
      value: TotalCashout.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2
      }),
      icon: <DollarSign size={18} />,
      category: "cash"
    },
    {
      id: "net-cash",
      title: "NET CASH",
      value: TotalNetCash.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2
      }),
      description: "= TOTAL CASH IN - TOTAL CASH OUTS PAID",
      icon: <DollarSign size={18} />,
      category: "cash"
    },
    {
      id: "total-players",
      title: "TOTAL NUMBER OF PLAYERS",
      value: TotalPlayers.toLocaleString(),
      icon: <Users size={18} />,
      category: "players"
    },
    {
      id: "active-players",
      title: "TOTAL NO. OF PLAYERS (ACTIVE)",
      value: TotalPlayersActive.toLocaleString(),
      icon: <Users size={18} />,
      category: "players"
    },
    // {
    //   id: "inactive-players",
    //   title: "TOTAL NO. OF PLAYERS (INACTIVE)",
    //   value: TotalPlayersInactive.toLocaleString(),
    //   icon: <Users size={18} />,
    //   category: "players"
    // },
    {
      id: "total-bets-earned",
      title: "TOTAL BETS EARNED",
      value: TotalBetsEarned.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2
      }),
      icon: <TrendingUp size={18} />,
      category: "bets"
    },
    {
      id: "total-commissions",
      title: "TOTAL COMMISSIONS",
      value: TotalCommissions.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2
      }),
      icon: <DollarSign size={18} />,
      category: "commissions"
    },
    {
      id: "total-wins",
      title: "TOTAL WINS",
      value: TotalWins.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2
      }),
      icon: <Award size={18} />,
      category: "bets"
    },
    // {
    //   id: "total-free-bets",
    //   title: "TOTAL FREE BETS",
    //   value: "$5,430.00",
    //   icon: <TrendingUp size={18} />,
    //   category: "bets"
    // },
    // {
    //   id: "total-bets-conversions",
    //   title: "TOTAL BETS FROM CONVERSIONS",
    //   value: "$42,890.00",
    //   icon: <TrendingUp size={18} />,
    //   category: "bets"
    // },
    // {
    //   id: "net-income-bets",
    //   title: "NET INCOME FROM BETS",
    //   value: "$84,937.00",
    //   description: "= TOTAL BETS EARNED - COMMISSIONS + TOTAL WINS + TOTAL FREE BETS",
    //   icon: <DollarSign size={18} />,
    //   category: "bets"
    // }
  ];

  // Filter metrics based on active tab
  const filteredMetrics = activeTab === "all" 
    ? metrics 
    : metrics.filter(metric => metric.category === activeTab);

  const handleCardClick = (metricId: string, startDate: string, endDate: string) => {
    if (metricId !== "net-cash")
    {
      navigate(`/teammetric/${metricId}?startDate=${startDate}&endDate=${endDate}&status=${metricId === 'active-players' ? 'active' : metricId === 'inactive-players' ? 'inactive' : 'all'}`);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          {tabOptions.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center justify-center">
              {/* Show only icon on mobile, show icon and text on larger screens */}
              <span className="md:hidden">{tab.icon}</span>
              <span className="hidden md:flex items-center gap-2">
                {tab.icon}
                <span>{tab.label}</span>
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMetrics.map((metric) => (
          <MetricCard
            key={metric.id}
            id={metric.id}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            icon={metric.icon}
            category={metric.category}
            onClick={() => handleCardClick(metric.id, StartDate, EndDate)}
          />
        ))}
      </div>
      
      {filteredMetrics.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No metrics found for this category.</p>
        </div>
      )}
    </div>
  );
}