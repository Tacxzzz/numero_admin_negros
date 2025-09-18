import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentOrders } from "./RecentOrders";
import { HierarchyDirect} from "./HierarchyDirect";
import { HierarchyThird} from "./HierarchyThird";
import { SalesChart } from "./SalesChart";
import { DollarSign, Package, ShoppingCart, Users, Boxes, ArrowBigLeft } from "lucide-react";
import { useAuth0 } from '@auth0/auth0-react';
import { getLevel1ReferralsCount, getLevel2ReferralsCount, loginAdmin } from './api/apiCalls';
import { useEffect, useState } from "react";
import { formatPeso } from "./utils/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HierarchySecond() {
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

    const [countDirect, setCountDirect] = useState("");
    const [countDirect2, setCountDirect2] = useState("");

    const queryParams = new URLSearchParams(location.search);
    const userMobile = queryParams.get("user_mobile");
    const user_id = queryParams.get("user_id");



  useEffect(() => {
    if (user && !dbUpdated) {
      const handleUpdate = async () => {
        const dataUpdated= await loginAdmin(user,getAccessTokenSilently);
        if(dataUpdated.dbUpdate)
        {
          setDbUpdated(dataUpdated.dbUpdate);
          setUserID(dataUpdated.userID);
          setLoading(false);

          const dataRefs= await getLevel1ReferralsCount(user_id);
          setCountDirect(dataRefs.count);

          const dataRefs2= await getLevel2ReferralsCount(user_id);
          setCountDirect2(dataRefs2.count);
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
  }, [user]);

  if (loading ) {
    return <div>...</div>;
  }

  

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
        
          <Card >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Level 1
              </CardTitle>
              {/* <CardTitle className="text-sm font-medium">
                {stat.subtitle}
              </CardTitle> */}
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{countDirect}</div>
              <p className="text-xs text-muted-foreground">
                Counted # Direct Referrals
              </p>
            </CardContent>
          </Card>
          <Card >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Level 2
              </CardTitle>
              {/* <CardTitle className="text-sm font-medium">
                {stat.subtitle}
              </CardTitle> */}
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{countDirect2}</div>
              <p className="text-xs text-muted-foreground">
                Counted # Level 2 Referrals
              </p>
            </CardContent>
          </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Direct Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <HierarchyDirect user_id={user_id}  />
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
}