import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentOrders } from "./RecentOrders";
import { SalesChart } from "./SalesChart";
import { HandIcon , HandMetalIcon, ShoppingCart, Users, Boxes, Wallet, CoinsIcon, Wallet2, BookAIcon, BookCheck, BookHeart, Banknote } from "lucide-react";
import { useAuth0 } from '@auth0/auth0-react';
import { countBetsEarned, countBetsEarnedTeam, getRateChartData, getRateChartDataTeam, loginAdmin, totalBalancePlayers, totalBalancePlayersTeam, totalCashin, totalCashinTeam, totalCashOut, totalCashOutTeam, totalClients, totalClientsTeam, totalCommissions, totalCommissionsTeam, totalPlayers, totalPlayersTeam, totalWins, totalWinsTeam } from './api/apiCalls';
import { useEffect, useState } from "react";
import { formatPeso } from "./utils/utils";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";


export function TeamDashboard() {

  const { user,getAccessTokenSilently , logout} = useAuth0();
    const [loading, setLoading] = useState(true);
    const [userID, setUserID] = useState("none");
    const [dbUpdated, setDbUpdated] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [totalRemitAmount, setTotalRemitAmount] = useState(0);
    const [totalRedeemAmount, setTotalRedeemAmount] = useState(0);
    const [users, setUsers] = useState<any[]>([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [totalComm, setTotalComm] = useState(0);
    const [totalPlayersAmount, setTotalPlayersAmount] = useState(0);
    const [totalNonRegisteredPlayers, setTotalNonRegisteredPlayers] = useState(0);
    const [totalCashins, setTotalCashins] = useState(0);
    const [totalCashouts, setTotalCashouts] = useState(0);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [rateChartData, setRateChartData] = useState<any[]>([]);
    const [permissionsString, setPermissionsString] = useState([]);


  useEffect(() => {
    if (user && !dbUpdated) {
      const handleUpdate = async () => {
        const dataUpdated= await loginAdmin(user,getAccessTokenSilently);
        if(dataUpdated.dbUpdate)
        {
          setDbUpdated(dataUpdated.dbUpdate);
          setUserID(dataUpdated.userID);
          setPermissionsString(JSON.parse(dataUpdated.permissions));
          setLoading(false);

          const data = await getRateChartDataTeam(dataUpdated.userID);
          setRateChartData(data);
          console.log(data);

          const betsEarnedData= await countBetsEarnedTeam(dataUpdated.userID);
          setTotalRemitAmount(betsEarnedData.count);

          const data2= await totalWinsTeam(dataUpdated.userID);
          setTotalRedeemAmount(data2.count);

          const data3= await totalBalancePlayersTeam(dataUpdated.userID);
          setTotalBalance(data3.count);

          const data4= await totalCommissionsTeam(dataUpdated.userID);
          setTotalComm(data4.count);
          
          const data5= await totalPlayersTeam(dataUpdated.userID);
          setTotalPlayersAmount(data5.count);

          const data6= await totalClientsTeam(dataUpdated.userID);
          setTotalNonRegisteredPlayers(data6.count);

          const data7= await totalCashinTeam(dataUpdated.userID);
          setTotalCashins(data7.count);

          const data8= await totalCashOutTeam(dataUpdated.userID);
          setTotalCashouts(data8.count);
        }
        else
        {
          alert("UNAUTHORIZED USER!");
          logout({ logoutParams: { returnTo: window.location.origin } });
        }
        
      };
      handleUpdate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading ) {
    return <div>...</div>;
  }


  const stats = [
    {
      title: "Total Bets Earned",
      value: formatPeso(totalRemitAmount),
      icon: CoinsIcon,
    },
    {
      title: "Total Wins",
      value: formatPeso(totalRedeemAmount),
      icon: CoinsIcon,
    },
    {
      title: "Total Credits From Players",
      value: formatPeso(totalBalance),
      icon: BookCheck,
    },
    {
      title: "Total Commision",
      value: formatPeso(totalComm),
      icon: BookHeart,
    },
    {
      title: "Players",
      value: totalPlayersAmount,
      icon: Users,
    },
    {
      title: "Non-Registered Players",
      value: totalNonRegisteredPlayers,
      icon: Users,
    },
    {
      title: "Cash In",
      value: formatPeso(totalCashins),
      icon: Banknote,
    },
    {
      title: "Cash Out",
      value: formatPeso(totalCashouts),
      icon: Banknote,
    },
  ];

  

  const resetDateFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  if(!permissionsString.includes("dashboard"))
  {
    return <div>Not allowed to manage this page</div>
  }
  

  return (
    <div className="p-4 md:p-6 space-y-6">
<div className="lg:mb-4 flex flex-wrap justify-between items-center gap-4">
  <h2 className="text-2xl md:text-3xl font-bold text-left">My Team Dashboard</h2>
  <div className="flex flex-wrap justify-end items-center gap-4">
    <div className="w-full sm:w-auto">
      <label htmlFor="startDate" className="block text-sm font-medium">
        Start Date
      </label>
      <input
        type="date"
        id="startDate"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="w-full sm:w-auto border rounded px-2 py-1"
      />
    </div>
    <div className="w-full sm:w-auto">
      <label htmlFor="endDate" className="block text-sm font-medium">
        End Date
      </label>
      <input
        type="date"
        id="endDate"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="w-full sm:w-auto border rounded px-2 py-1"
      />
    </div>
    <div className="w-full sm:w-auto">
      <Button
        onClick={resetDateFilters}
        className="w-full sm:w-auto mt-4 px-4 py-2 bg-gray-500 text-white rounded"
      >
        Reset
      </Button>
    </div>
  </div>
</div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {/* <p className="text-xs text-muted-foreground">
                {stat.change} from last month
              </p> */}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Recognition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rateChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Cash_In" stroke="#8884d8" name="Cash In" />
                <Line type="monotone" dataKey="Cash_Out" stroke="#ff7300" name="Cash Out" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      
    </div>
  );
}