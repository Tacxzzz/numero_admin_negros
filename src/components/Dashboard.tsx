import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Users, CoinsIcon, BookCheck, BookHeart, Banknote, TrendingUp, DollarSign, Award } from "lucide-react";
import { useAuth0 } from '@auth0/auth0-react';
import { countBetsEarned, countBetsEarnedFreeCredits, getRateChartData, loginAdmin, oneLoginAdmin, totalBalancePlayers, totalCashin, totalCashOut, totalClients, totalCommissions, totalPlayers, totalPlayersActive, totalPlayersInactive, totalWins } from './api/apiCalls';
import { useEffect, useRef, useState } from "react";
import { formatPeso } from "./utils/utils";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FinancialMetricsGrid } from "../components/financial-metrics-grid";
import { useAuth } from './auth/AuthContext';

export function Dashboard() {

  const { isAuthenticated,user,getAccessTokenSilently , logout} = useAuth0();
  const initialStartDate = new Date();
  initialStartDate.setDate(initialStartDate.getDate() - 20);
    const [loading, setLoading] = useState(true);
    const [dbUpdated, setDbUpdated] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [totalRemitAmount, setTotalRemitAmount] = useState(0);
    const [totalBetsFreeCredits, setTotalBetsFreeCredits] = useState(0);
    const [totalRedeemAmount, setTotalRedeemAmount] = useState(0);
    const [users, setUsers] = useState<any[]>([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [totalComm, setTotalComm] = useState(0);
    const [totalPlayersAmount, setTotalPlayersAmount] = useState(0);
    const [totalPlayersActiveCount, setTotalPlayersActive] = useState(0);
    const [totalPlayersInactiveCount, setTotalPlayersInactive] = useState(0);
    const [totalNonRegisteredPlayers, setTotalNonRegisteredPlayers] = useState(0);
    const [totalCashins, setTotalCashins] = useState(0);
    const [totalCashouts, setTotalCashouts] = useState(0);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [rateChartData, setRateChartData] = useState<any[]>([]);
    const [permissionsString, setPermissionsString] = useState([]);
    const { isLoggedIn, userID } = useAuth();
    const hasInitializedRef = useRef(false);

  useEffect(() => {
    const fetchRateChartData = async () => {
      try {
        const data = await getRateChartData(startDate, endDate); // Call the function to fetch data
        setRateChartData(data); 

        const betsEarnedData= await countBetsEarned(startDate,endDate);
        setTotalRemitAmount(betsEarnedData.count);

        const betsEarnedFreeCredits= await countBetsEarnedFreeCredits(startDate,endDate);
        setTotalBetsFreeCredits(betsEarnedFreeCredits.count);

        const data2= await totalWins(startDate,endDate);
          setTotalRedeemAmount(data2.count);

          const data3= await totalBalancePlayers(startDate,endDate);
          setTotalBalance(data3.count);

          const data4= await totalCommissions(startDate,endDate);
          setTotalComm(data4.count);

          const data5= await totalPlayers(startDate,endDate);
          setTotalPlayersAmount(data5.count);

          const data6= await totalClients(startDate,endDate);
          setTotalNonRegisteredPlayers(data6.count);

          const data7= await totalCashin(startDate,endDate);
          setTotalCashins(data7.count);

          const data8= await totalCashOut(startDate,endDate);
          setTotalCashouts(data8.count);

          const data9= await totalPlayersActive(startDate,endDate);
          setTotalPlayersActive(data9.count);

          const data10= await totalPlayersInactive(startDate,endDate);
          setTotalPlayersInactive(data10.count);
      } catch (error) {
        console.error('Error fetching rate chart data:', error);
      }
    };

    fetchRateChartData(); // Fetch data when startDate or endDate changes
  }, [startDate, endDate]);

  const didFetch = useRef(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === 'false') {
      return;
    }
    
    if (user && !dbUpdated) {
      console.log('-fetching');
      const handleUpdate = async () => {
        const dataUpdated= await loginAdmin(user,getAccessTokenSilently);
        if(dataUpdated.dbUpdate)
        {
          setDbUpdated(dataUpdated.dbUpdate);
          setPermissionsString(JSON.parse(dataUpdated.permissions));

          const startDateDefault = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Manila',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).format(initialStartDate).split('/').reverse().join('-'); // Format the date as YYYY-MM-DD
          
          const endDateDefault = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Manila',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).format(new Date()).split('/').reverse().join('-');

          setStartDate(startDateDefault);
          setEndDate(endDateDefault);

          setLoading(false);
        }
        else
        {
          alert("UNAUTHORIZED USER!");
          localStorage.setItem("isLoggedIn", "false");
          logout({ logoutParams: { returnTo: window.location.origin } });
        }
        
      };
      handleUpdate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, userID]);

  if (loading ) {
    return <div>...</div>;
  }

  const cashinPermission = permissionsString.includes("dashboard_cashin");
  const netCashPermission = permissionsString.includes("net_earnings");
  const cashoutPermission = permissionsString.includes("dashboard_cashout");
  const revenueRecognitionPermission = permissionsString.includes("revenue_recognition");

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

      <FinancialMetricsGrid StartDate={startDate} EndDate={endDate} TotalCashin={totalCashins} TotalCashout={totalCashouts} TotalPlayers={totalPlayersAmount} TotalPlayersActive={totalPlayersActiveCount} 
      TotalPlayersInactive={totalPlayersInactiveCount} TotalBetsEarned={totalRemitAmount} TotalCommissions={totalComm} TotalWins={totalRedeemAmount} TotalBetsFreeCredits={totalBetsFreeCredits} CashinPermission={cashinPermission}
      CashoutPermission={cashoutPermission} NetCashPermission={netCashPermission}/>

      {revenueRecognitionPermission && (
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
      )}
      
    </div>
  );
}