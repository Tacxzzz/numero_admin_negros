import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Copy } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  status: "VERIFIED" | "UNVERIFIED" | "SEMI VERIFIED";
  createdAt: string;
  verificationDate?: string;
  verificationNumber?: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  civilStatus?: string;
  country: string;
  address?: {
    building?: string;
    street?: string;
    barangay?: string;
    city?: string;
    province?: string;
    country: string;
  };
}

export function UserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState("user-details");

  // In a real app, this would be fetched from an API
  useEffect(() => {
    // Simulating API fetch
    const fetchUser = () => {
      const users: Record<string, UserData> = {
        "cm78sex3h0002ag2xte258oin": {
          id: "cm78sex3h0002ag2xte258oin",
          name: "Freyas, Krisna Lyn",
          firstName: "Krisna Lyn",
          lastName: "Freyas",
          middleName: "",
          email: "viridianstest03@gmail.com",
          phone: "+639655009921",
          status: "SEMI VERIFIED",
          createdAt: "02/17/2025, 4:22 PM",
          verificationDate: "Feb 18, 2025, 7:32 PM",
          verificationNumber: "cm7aemrqb004s8l2ymyicq4b1",
          dateOfBirth: "February 01, 1988",
          age: 37,
          gender: "FEMALE",
          civilStatus: "MARRIED",
          country: "PHILIPPINES, TANZA",
          address: {
            building: "Camella subd",
            street: "Toscana st",
            barangay: "Bagtas",
            city: "Tanza",
            province: "Cavite",
            country: "Philippines"
          }
        },
        "cm834gh2y004feg3hjtznttiw": {
          id: "cm834gh2y004feg3hjtznttiw",
          name: "Viridians7",
          firstName: "Viridians",
          lastName: "Seven",
          email: "viridianstest07@gmail.com",
          phone: "+639260612594",
          status: "UNVERIFIED",
          createdAt: "03/10/2025, 9:52 PM",
          dateOfBirth: "January 15, 1990",
          age: 35,
          gender: "MALE",
          country: "UNITED STATES",
          address: {
            building: "123 Main St",
            street: "Downtown",
            city: "Anytown",
            country: "United States"
          }
        },
        "cm7t4ubnt000gbr3gwga6gthb": {
          id: "cm7t4ubnt000gbr3gwga6gthb",
          name: "viridians5",
          firstName: "Viridians",
          lastName: "Five",
          email: "viridianstest05@gmail.com",
          phone: "+639260000000",
          status: "UNVERIFIED",
          createdAt: "03/03/2025, 10:05 PM",
          dateOfBirth: "March 22, 1985",
          age: 40,
          gender: "FEMALE",
          country: "CANADA",
          address: {
            building: "456 Oak Ave",
            city: "Somewhere",
            country: "Canada"
          }
        },
        "cm7lelm4t00596e3ifko7fow5": {
          id: "cm7lelm4t00596e3ifko7fow5",
          name: "Test, Viridians6",
          firstName: "Viridians",
          lastName: "Test",
          middleName: "Six",
          email: "viridianstest06@gmail.com",
          phone: "+639260612590",
          status: "VERIFIED",
          createdAt: "02/26/2025, 12:16 PM",
          verificationDate: "Mar 01, 2025, 3:15 PM",
          verificationNumber: "cm7aemrqb004s8l2ymyicq4c2",
          dateOfBirth: "April 10, 1992",
          age: 33,
          gender: "MALE",
          civilStatus: "SINGLE",
          country: "AUSTRALIA",
          address: {
            building: "789 Pine Rd",
            street: "Central",
            city: "Elsewhere",
            country: "Australia"
          }
        },
        "cm7k6873v000d6e3ixsnq5uml": {
          id: "cm7k6873v000d6e3ixsnq5uml",
          name: "Balbin, John Anthony",
          firstName: "John Anthony",
          lastName: "Balbin",
          email: "john.balbin@viridiantech.io",
          phone: "+639497724252",
          status: "VERIFIED",
          createdAt: "02/25/2025, 3:34 PM",
          verificationDate: "Feb 28, 2025, 10:22 AM",
          verificationNumber: "cm7aemrqb004s8l2ymyicq4d3",
          dateOfBirth: "May 05, 1988",
          age: 37,
          gender: "MALE",
          civilStatus: "MARRIED",
          country: "PHILIPPINES",
          address: {
            building: "101 Tech Blvd",
            street: "Innovation St",
            city: "Manila",
            country: "Philippines"
          }
        },
        "cm7elk7id0046532tq04klmg5": {
          id: "cm7elk7id0046532tq04klmg5",
          name: "Test, Viridian4",
          firstName: "Viridian",
          lastName: "Test",
          middleName: "Four",
          email: "viridianstest04@gmail.com",
          phone: "+639700304505",
          status: "VERIFIED",
          createdAt: "02/21/2025, 5:57 PM",
          verificationDate: "Feb 25, 2025, 9:30 AM",
          verificationNumber: "cm7aemrqb004s8l2ymyicq4e4",
          dateOfBirth: "June 18, 1995",
          age: 30,
          gender: "FEMALE",
          civilStatus: "SINGLE",
          country: "SINGAPORE",
          address: {
            building: "202 Cedar St",
            city: "Singapore",
            country: "Singapore"
          }
        }
      };

      const foundUser = users[userId || ""] || null;
      setUser(foundUser);
    };

    fetchUser();
  }, [userId]);

  const handleApprove = () => {
    if (user) {
      setUser({
        ...user,
        status: "VERIFIED",
        verificationDate: new Date().toLocaleString(),
      });
    }
  };

  const handlePartiallyApprove = () => {
    if (user) {
      setUser({
        ...user,
        status: "SEMI VERIFIED",
        verificationDate: new Date().toLocaleString(),
      });
    }
  };

  const handleReject = () => {
    if (user) {
      setUser({
        ...user,
        status: "UNVERIFIED",
        verificationDate: undefined,
      });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-100 text-green-800 border-green-300";
      case "UNVERIFIED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "SEMI VERIFIED":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
        <p className="mb-6">The user you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/customers")}>
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 pt-16 md:pt-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <Link to="/customers" className="hover:text-blue-600">User List</Link>
        <span className="mx-2">›</span>
        <span>User Details of {user.firstName} {user.lastName}</span>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold">User Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="flex flex-col items-center space-y-4">
            {/* User Avatar */}
            <div className="w-32 h-32 rounded-full bg-purple-200 flex items-center justify-center">
              <span className="text-5xl font-bold text-gray-800">
                {getInitials(user.name)}
              </span>
            </div>

            {/* User Basic Info */}
            <div className="text-center space-y-4 w-full">
              <div>
                <h3 className="text-xs text-gray-500">NAME</h3>
                <p className="font-semibold text-lg uppercase">{user.firstName} {user.lastName}</p>
              </div>

              <div>
                <h3 className="text-xs text-gray-500">DATE OF BIRTH (AGE)</h3>
                <p className="font-semibold uppercase">{user.dateOfBirth} ({user.age})</p>
              </div>

              <div>
                <h3 className="text-xs text-gray-500">MOBILE NUMBER</h3>
                <p className="font-semibold">{user.phone}</p>
              </div>

              <div>
                <h3 className="text-xs text-gray-500">COUNTRY OF ORIGIN</h3>
                <p className="font-semibold uppercase">{user.country}</p>
              </div>

              <Button variant="outline" className="w-full">
                <span className="mr-2">💼</span> WALLET DETAILS
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-2 mt-4">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handleApprove}
              >
                APPROVE
              </Button>
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handlePartiallyApprove}
              >
                PARTIALLY APPROVE
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-red-600 border-red-300 hover:bg-red-50"
                onClick={handleReject}
              >
                REJECT
              </Button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-md border p-4">
            {/* Status and Verification Info */}
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <Badge
                  className={`${getStatusBadgeClass(user.status)} text-sm px-4 py-2 font-semibold`}
                >
                  {user.status === "SEMI VERIFIED" && "⚡"}
                  {user.status}
                </Badge>
              </div>
              
              {user.verificationDate && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs text-gray-500">VERIFICATION DATE</h3>
                    <p className="font-medium">{user.verificationDate}</p>
                  </div>
                  
                  {user.verificationNumber && (
                    <div>
                      <h3 className="text-xs text-gray-500">VERIFICATION NUMBER</h3>
                      <div className="flex items-center">
                        <p className="font-medium font-mono text-sm">{user.verificationNumber}</p>
                        <Button variant="ghost" size="sm" className="ml-1 h-6 w-6 p-0">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="user-details" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
                <TabsTrigger 
                  value="user-details" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-sm font-medium"
                >
                  USER DETAILS
                </TabsTrigger>
                <TabsTrigger 
                  value="identity-verification" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-sm font-medium"
                >
                  IDENTITY VERIFICATION
                </TabsTrigger>
                <TabsTrigger 
                  value="device-check" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-sm font-medium"
                >
                  DEVICE CHECK
                </TabsTrigger>
                <TabsTrigger 
                  value="account-limits" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-sm font-medium"
                >
                  ACCOUNT LIMITS
                </TabsTrigger>
                <TabsTrigger 
                  value="user-logs" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-sm font-medium"
                >
                  USER LOGS
                </TabsTrigger>
                <TabsTrigger 
                  value="crypto-wallets" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-sm font-medium"
                >
                  CRYPTO WALLETS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="user-details" className="mt-6">
                <div className="space-y-6">
                  <h3 className="font-semibold text-gray-800 uppercase">PERSONAL INFORMATION</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <h4 className="text-sm text-gray-500">Last Name</h4>
                      <p className="font-medium">{user.lastName}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500">First Name</h4>
                      <p className="font-medium">{user.firstName}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500">Middle Name</h4>
                      <p className="font-medium">{user.middleName || "N/A"}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500">Gender</h4>
                      <p className="font-medium">{user.gender}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500">Date of Birth</h4>
                      <p className="font-medium">{user.dateOfBirth.split(' ')[1]} {user.dateOfBirth.split(' ')[0]}, {user.dateOfBirth.split(' ')[2]}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500">Civil Status</h4>
                      <p className="font-medium">{user.civilStatus || "N/A"}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500">Email Address</h4>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500">Mobile Number</h4>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500">Apt, Building, Home, Suite, etc number</h4>
                      <p className="font-medium">{user.address?.building || "N/A"}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500">Street</h4>
                      <p className="font-medium">{user.address?.street || "N/A"}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500">Barangay</h4>
                      <p className="font-medium">{user.address?.barangay || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="identity-verification" className="mt-6">
                <div className="p-4 text-center text-gray-500">
                  <p>Identity verification information will be displayed here.</p>
                </div>
              </TabsContent>

              <TabsContent value="device-check" className="mt-6">
                <div className="p-4 text-center text-gray-500">
                  <p>Device check information will be displayed here.</p>
                </div>
              </TabsContent>

              <TabsContent value="account-limits" className="mt-6">
                <div className="p-4 text-center text-gray-500">
                  <p>Account limits information will be displayed here.</p>
                </div>
              </TabsContent>

              <TabsContent value="user-logs" className="mt-6">
                <div className="p-4 text-center text-gray-500">
                  <p>User logs will be displayed here.</p>
                </div>
              </TabsContent>

              <TabsContent value="crypto-wallets" className="mt-6">
                <div className="p-4 text-center text-gray-500">
                  <p>Crypto wallets information will be displayed here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}