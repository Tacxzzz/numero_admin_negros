import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentOrders } from "./RecentOrders";
import { NewSignup } from "./NewSignup";
import { HierarchyDirect} from "./HierarchyDirect";
import { HierarchySecond} from "./HierarchySecond"; 
import { HierarchyThird} from "./HierarchyThird";
import { SalesChart } from "./SalesChart";
import { DollarSign, Package, ShoppingCart, Users, Boxes, ArrowBigLeft } from "lucide-react";
import { useAuth0 } from '@auth0/auth0-react';
import { getTransactionsAll, getUsers, loginAdmin } from './api/apiCalls';
import { useEffect, useState } from "react";
import { formatPeso } from "./utils/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HierarchyView() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user,getAccessTokenSilently , logout} = useAuth0();
    const [loading, setLoading] = useState(true);
    const [userID, setUserID] = useState("none");
    const [dbUpdated, setDbUpdated] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [totalRemitAmount, setTotalRemitAmount] = useState(0);
    const [totalRedeemAmount, setTotalRedeemAmount] = useState(0);
    const [users, setUsers] = useState<any[]>([]);
    const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    if (user && !dbUpdated) {
      const handleUpdate = async () => {
        const dataUpdated= await loginAdmin(user,getAccessTokenSilently);
        if(dataUpdated.dbUpdate)
        {
          setDbUpdated(dataUpdated.dbUpdate);
          setUserID(dataUpdated.userID);
          setLoading(false);

          const getTransData = await getTransactionsAll();
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
          }

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

  const queryParams = new URLSearchParams(location.search);
  const userMobile = queryParams.get("user_mobile");

  const stats = [
    {
      title: "Level 1 ",
      subtitle: "Direct Referrals",
      value: (1),
      icon: Users,
    },
    {
      title: "Level 2",
      subtitle: "Second Referrals",
      value: (3),
      icon: Users,
    },
    // {
    //   title: "Level 3",
    //   subtitle: "Third Referrals",
    //   value: (5),
    //   icon: Users,
    // },
    // {
    //   title: "Total Collections",
    //   value: formatPeso(totalBalance),
    //   icon: Boxes,
    // },
    // {
    //   title: "Total Commision",
    //   value: formatPeso(totalRemitAmount),
    //   icon: DollarSign,
    // },
    // {
    //   title: "Players",
    //   value: users.length,
    //   icon: Users,
    // },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
        <Button
            onClick={() => navigate(-1)} // Navigate to the previous route
            className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
        >
            <ArrowBigLeft className="mr-2" /> {/* Arrow icon */}
            Back
        </Button>
      
      <h2 className="text-2xl md:text-3xl font-bold">Hierarchy Stats</h2>
      
      {userMobile && (
        <div className="text-lg font-medium">
         User's Mobile: (+63){userMobile}
        </div>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {/* <CardTitle className="text-sm font-medium">
                {stat.subtitle}
              </CardTitle> */}
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                Counted # {stat.subtitle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Direct Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <HierarchyDirect  />
          </CardContent>
        </Card>
        {/* <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Second Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <HierarchySecond  />
          </CardContent>
        </Card>
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Third Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <HierarchyThird  />
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}