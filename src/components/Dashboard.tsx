import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentOrders } from "./RecentOrders";
import { NewSignup } from "./NewSignup";
import { SalesChart } from "./SalesChart";
import { HandIcon , HandMetalIcon, ShoppingCart, Users, Boxes, Wallet, CoinsIcon, Wallet2, BookAIcon, BookCheck, BookHeart, Banknote } from "lucide-react";
import { useAuth0 } from '@auth0/auth0-react';
import { getTransactionsAll, getUsers, loginAdmin } from './api/apiCalls';
import { useEffect, useState } from "react";
import { formatPeso } from "./utils/utils";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function Dashboard() {

  const { user,getAccessTokenSilently , logout} = useAuth0();
    const [loading, setLoading] = useState(true);
    const [userID, setUserID] = useState("none");
    const [dbUpdated, setDbUpdated] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [totalRemitAmount, setTotalRemitAmount] = useState(0);
    const [totalRedeemAmount, setTotalRedeemAmount] = useState(0);
    const [users, setUsers] = useState<any[]>([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    if (user && !dbUpdated) {
      const handleUpdate = async () => {
        const dataUpdated= await loginAdmin(user,getAccessTokenSilently);
        if(dataUpdated.dbUpdate)
        {
          setDbUpdated(dataUpdated.dbUpdate);
          setUserID(dataUpdated.userID);
          setLoading(false);

          /* const getTransData = await getTransactionsAll();
          setTransactions(getTransData);
      
      
          if (getTransData && getTransData.length > 0) {
            const total = getTransData
              .filter((trans) => trans.trans_type === "remit") // Get only transactions with type "remit"
              .reduce((sum, trans) => sum + parseFloat(trans.amount), 0); // Sum up the amounts
        
            setTotalRemitAmount(total); // Update state
          } else {
            setTotalRemitAmount(0); // Reset if no transactions
          }

          if (getTransData && getTransData.length > 0) {
            const total = getTransData
              .filter((trans) => trans.trans_type === "redeem") // Get only transactions with type "remit"
              .reduce((sum, trans) => sum + parseFloat(trans.amount), 0); // Sum up the amounts
        
            setTotalRedeemAmount(total); // Update state
          } else {
            setTotalRedeemAmount(0); // Reset if no transactions
          } */

          const getUsersData = await getUsers();
          setUsers(getUsersData);
          if (getUsersData && getUsersData.length > 0) {
            const total = getUsersData // Get only transactions with type "remit"
              .reduce((sum, trans) => sum + parseFloat(trans.balance), 0); // Sum up the amounts
        
            setTotalBalance(total); // Update state
          } else {
            setTotalBalance(0); // Reset if no transactions
          }
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
      title: "Total Win Claimed",
      value: formatPeso(totalRedeemAmount),
      icon: CoinsIcon,
    },
    // {
    //   title: "Total Bet Balance Claimable",
    //   value: formatPeso(totalBalance),
    //   icon: Wallet2, 
    // },
    {
      title: "Total Collections",
      value: formatPeso(totalBalance),
      icon: BookCheck,
    },
    {
      title: "Total Commision",
      value: formatPeso(totalRemitAmount),
      icon: BookHeart,
    },
    {
      title: "Players",
      value: users.length,
      icon: Users,
    },
    {
      title: "New Players",
      value: users.length,
      icon: Users,
    },
    {
      title: "Cash In",
      value: formatPeso(totalRemitAmount),
      icon: Banknote,
    },
    {
      title: "Cash Out",
      value: formatPeso(90000),
      icon: Banknote,
    },
  ];

  const rateChartData = [
    { date: "Mar 4", Cash_In: 56.10, Commission: 11.20, Cash_Out: 21.80 },
    { date: "Mar 5", Cash_In: 36.25, Commission: 1.35, Cash_Out: 31.95 },
    { date: "Mar 6", Cash_In: 46.40, Commission: 5.45, Cash_Out: 12.05 },
    { date: "Mar 7", Cash_In: 26.55, Commission: 11.60, Cash_Out: 12.25 },
    { date: "Mar 8", Cash_In: 36.65, Commission: 21.75, Cash_Out: 32.40 },
    { date: "Mar 9", Cash_In: 16.70, Commission: 11.85, Cash_Out: 22.55 },
    { date: "Mar 10", Cash_In: 36.75, Commission: 22.10, Cash_Out: 12.85 }
  ];

  const resetDateFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
<div className="lg:mb-4 flex flex-wrap justify-between items-center gap-4">
  <h2 className="text-2xl md:text-3xl font-bold text-left">Dashboard</h2>
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
                <Line type="monotone" dataKey="Commission" stroke="#82ca9d" name="Commission" />
                <Line type="monotone" dataKey="Cash_Out" stroke="#ff7300" name="Cash Out" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        
        {/* <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>New Users Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <NewSignup  />
          </CardContent>
        </Card> */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders  />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}