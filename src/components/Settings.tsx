import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountManagement } from "./settings/AccountManagement";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { useAuth0 } from '@auth0/auth0-react';
import { getSettings, loginAdmin, updateSettings } from "./api/apiCalls";

export function Settings() {
  const { user,getAccessTokenSilently , logout} = useAuth0();
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState("none");
  const [dbUpdated, setDbUpdated] = useState(false);
  const [storeInfo, setStoreInfo] = useState({
    conversion: "0",
    trans_fee: "0",
    trans_limit: "0"
  });

  useEffect(() => {
        if (user && !dbUpdated) {
          const handleUpdate = async () => {
            const dataUpdated= await loginAdmin(user,getAccessTokenSilently);
            if(dataUpdated.dbUpdate)
            {
              setDbUpdated(dataUpdated.dbUpdate);
              setUserID(dataUpdated.userID);
              
  
              const usersData= await getSettings();
              setStoreInfo({
                ...storeInfo,
                ['conversion']: usersData.conversion,
                ['trans_fee']: usersData.trans_fee,
                ['trans_limit']: usersData.trans_limit,

              });
              setLoading(false);
  
              
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
  
  const [notifications, setNotifications] = useState({
    orderEmail: "orders@mystore.com"
  });
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleStoreInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoreInfo({
      ...storeInfo,
      [e.target.id]: e.target.value
    });
  };

  const handleNotificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotifications({
      ...notifications,
      [e.target.id]: e.target.value
    });
  };

  const handleSaveStoreInfo = async () => {
    
    const formData = new FormData();
    formData.append('userID', userID);
    formData.append('conversion', storeInfo.conversion);
    formData.append('trans_fee', storeInfo.trans_fee);
    formData.append('trans_limit', storeInfo.trans_limit);
    const approveData = await updateSettings(formData);
    if(approveData.authenticated)
    {
      const usersData= await getSettings();
      setStoreInfo({
        ...storeInfo,
        ['conversion']: usersData.conversion,
        ['trans_fee']: usersData.trans_fee,
        ['trans_limit']: usersData.trans_limit,

      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1000);
    }
    else
    {
      alert("Error updating settings")
      setSaveSuccess(false);
    }
    
  };

  const handleSaveNotifications = () => {
    // In a real app, this would save to an API
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 1000);
  };

  if (loading ) {
    return <div>...</div>;
  }
  return (
    <div className="p-4 md:p-6 space-y-6 pt-16 md:pt-6">
      <h2 className="text-2xl md:text-3xl font-bold">Settings</h2>
      
      {saveSuccess && (
        <Alert className="border-green-500 text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Your changes have been saved successfully.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="store">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="store">Remittance Management</TabsTrigger>
          {/* <TabsTrigger value="notifications">Notifications</TabsTrigger> 
          <TabsTrigger value="accounts">Admin Management</TabsTrigger>*/}
        </TabsList>
        
        <TabsContent value="store" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Remittance Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Exchange Rate</Label>
                <Input 
                  type="number"
                  name="conversion"
                  value={storeInfo.conversion} 
                  onChange={handleStoreInfoChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Transaction Fee</Label>
                <Input 
                  type="number"
                  name="trans_fee" 
                  value={storeInfo.trans_fee} 
                  onChange={handleStoreInfoChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Remittance Limit($)</Label>
                <Input 
                  type="number" 
                  name="trans_limit"
                  value={storeInfo.trans_limit} 
                  onChange={handleStoreInfoChange} 
                />
              </div>
              <Button onClick={handleSaveStoreInfo}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderEmail">Order Notifications</Label>
                <Input
                  id="orderEmail"
                  type="email"
                  value={notifications.orderEmail}
                  onChange={handleNotificationsChange}
                />
              </div>
              <Button onClick={handleSaveNotifications}>Update Notifications</Button>
            </CardContent>
          </Card>
        </TabsContent> 
        
        <TabsContent value="accounts" className="mt-6">
          <AccountManagement />
        </TabsContent>*/}
      </Tabs>
    </div>
  );
}