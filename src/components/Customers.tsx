import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Check, X, Copy, ChevronDown, FileText, Shield, CreditCard, Clock, Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth0 } from '@auth0/auth0-react';
import { approveUser, blockUser, getTransactions, getUserInfoDyna, getUserLogs, getUsers, loginAdmin, rejectUser } from './api/apiCalls';
import { useEffect, useState } from "react";
import { formatPeso, formatUSD } from "./utils/utils";

interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  mobile: string;
  verified: "pending" | "submitted" | "blocked" | "yes";
  created: string;
  modified: string;
  dob?: string;
  region?: string;
  province?: string;
  city?: string;
  barangay?: string;
  balance?: string;
  type?: string;
  image_id?: string;
  image_selfie?: string;
  
}

export function Customers() {

  const { user,getAccessTokenSilently , logout} = useAuth0();
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState("none");
  const [dbUpdated, setDbUpdated] = useState(false);

  const [verifiedFilter, setverifiedFilter] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("user-details");
  const [users, setUsers] = useState<User[]>([]);
  const [adminNotes, setAdminNotes] = useState("");
  const [userLogs, setUserLogs] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalRemitAmount, setTotalRemitAmount] = useState(0);

  useEffect(() => {
      if (user && !dbUpdated) {
        const handleUpdate = async () => {
          const dataUpdated= await loginAdmin(user,getAccessTokenSilently);
          if(dataUpdated.dbUpdate)
          {
            setDbUpdated(dataUpdated.dbUpdate);
            setUserID(dataUpdated.userID);
            

            const usersData= await getUsers();
            setUsers(usersData);
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
  
    if (loading ) {
      return <div>...</div>;
    }
  

  const filteredUsers = users.filter((user) => {
    // Apply verified filter
    if (verifiedFilter && user.verified !== verifiedFilter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.first_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.mobile.includes(query) ||
        user.id.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Sort users based on selected sort option
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    } else if (sortBy === "name") {
      return a.last_name.localeCompare(b.last_name);
    } else if (sortBy === "verified") {
      return a.verified.localeCompare(b.verified);
    }
    return 0;
  });

  const handleViewUser = async (user: User) => {
    setSelectedUser(user);
    
    setAdminNotes("");
    const getUserLogsData = await getUserLogs(user.id);
    setUserLogs(getUserLogsData);

    const getTransData = await getTransactions(user.id);
    setTransactions(getTransData);


    if (getTransData && getTransData.length > 0) {
      const total = getTransData
        .filter((trans) => trans.trans_type === "remit") // Get only transactions with type "remit"
        .reduce((sum, trans) => sum + parseFloat(trans.amount), 0); // Sum up the amounts
  
      setTotalRemitAmount(total); // Update state
    } else {
      setTotalRemitAmount(0); // Reset if no transactions
    }
    setIsUserDetailsOpen(true);
  };

  const getverifiedBadgeClass = (verified: string) => {
    switch (verified) {
      case "yes":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "submitted":
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

  const handleApprove = async () => {
    if (selectedUser) {
      const updatedUser: User = {
        ...selectedUser,
        verified: "yes",
        modified: new Date().toLocaleString(),
      };
      setSelectedUser(updatedUser);
      
      // Update the user in the list
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? updatedUser : user
      );

      const formData = new FormData();
      formData.append('userID', userID);
      formData.append('selectedUser', selectedUser.id);
      formData.append('note', adminNotes);
      const approveData = await approveUser(formData);
      if(approveData.authenticated)
      {
        const usersData= await getUsers();
        setUsers(usersData);
      }
    }
  };

  const handleReject = async () => {
    if (selectedUser) {
      const updatedUser: User = {
        ...selectedUser,
        verified: "pending",
        modified: undefined,
      };
      setSelectedUser(updatedUser);
      
      // Update the user in the list
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? updatedUser : user
      );
      // This would typically update state in a real app
      const formData = new FormData();
      formData.append('userID', userID);
      formData.append('selectedUser', selectedUser.id);
      formData.append('note', adminNotes);
      const approveData = await rejectUser(formData);
      if(approveData.authenticated)
      {
        const usersData= await getUsers();
        setUsers(usersData);
      }
    }
  };


  const handleBlock = async () => {
    if (selectedUser) {
      const updatedUser: User = {
        ...selectedUser,
        verified: "blocked",
        modified: new Date().toLocaleString(),
      };
      setSelectedUser(updatedUser);
      
      // Update the user in the list
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? updatedUser : user
      );

      const formData = new FormData();
      formData.append('userID', userID);
      formData.append('selectedUser', selectedUser.id);
      formData.append('note', adminNotes);
      const approveData = await blockUser(formData);
      if(approveData.authenticated)
      {
        const usersData= await getUsers();
        setUsers(usersData);
      }
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold">User List</h2>
      
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={verifiedFilter} onValueChange={setverifiedFilter}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="verified" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined}>All Status</SelectItem>
              <SelectItem value="yes">VERIFIED</SelectItem>
              <SelectItem value="pending">PENDING</SelectItem>
              <SelectItem value="submitted">SUBMITTED</SelectItem>
              <SelectItem value="blocked">BLOCKED</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="verified">verified</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="w-full md:w-auto">
          <div className="relative">
            <Input
              placeholder="Search"
              className="w-full md:w-[300px] pl-3 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Email</TableHead>
              <TableHead className="font-medium">Mobile Number</TableHead>
              <TableHead className="font-medium">verified</TableHead>
              <TableHead className="font-medium">Created at</TableHead>
              <TableHead className="font-medium text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map((user) => (
              <TableRow key={user.id} className="border-t hover:bg-gray-50">
                <TableCell>{user.first_name} {user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobile}</TableCell>
                <TableCell>
                  
                  <Badge
                    variant="outline"
                    className={getverifiedBadgeClass(user.verified)}
                  >
                    {user.verified}
                  </Badge>
                </TableCell>
                <TableCell>{user.created}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 flex items-center"
                    onClick={() => handleViewUser(user)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    VIEW
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* User Details Modal - Improved for mobile responsiveness */}
      <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
        <DialogContent className="max-w-8xl w-[95vw] p-0 max-h-[95vh] overflow-scroll flex flex-col">
        <div className="relative z-[100]">
        <DialogHeader className="p-6 pb-0 sticky top-0 bg-white z-10 border-b">
        <DialogTitle className="text-2xl font-bold">User Details</DialogTitle>
      </DialogHeader>
      <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-[101]"><X className="h-8 w-8" />
          <span className="sr-only">Close</span>
          </DialogClose>
          {selectedUser && (
            <div className="p-4 md:p-6 overflow-y-auto">
              {/* verified Badge - Moved to top for better visibility */}
              Verified : 
              <div className="mb-6 flex justify-center md:justify-start">
              
                <Badge
                  className={`${getverifiedBadgeClass(selectedUser.verified)} text-sm px-4 py-2 font-semibold`}
                >
                  {selectedUser.verified === "submitted" && "⚡"}
                  {selectedUser.verified}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Avatar Content - Now at the top on mobile, left on desktop */}
                <div className="md:order-2 md:col-span-1">
                  <Card className="border shadow-sm bg-white overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center space-y-4">
                        {/* User Avatar */}
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-md">
                          <span className="text-4xl md:text-5xl font-bold text-white">
                            {getInitials(selectedUser.first_name+" "+selectedUser.last_name)}
                          </span>
                        </div>

                        {/* User Basic Info */}
                        <div className="text-center space-y-4 w-full">
                          <div>
                            <h3 className="text-xs text-gray-500 uppercase tracking-wider">Name</h3>
                            <p className="font-semibold text-lg">{selectedUser.first_name} {selectedUser.last_name}</p>
                          </div>

                          <div>
                            <h3 className="text-xs text-gray-500 uppercase tracking-wider">Date of Birth</h3>
                            <p className="font-medium">{selectedUser.dob} <span className="text-gray-500">{/* ({selectedUser.age} years) */}</span></p>
                          </div>

                          <div>
                            <h3 className="text-xs text-gray-500 uppercase tracking-wider">Mobile Number</h3>
                            <p className="font-medium">{selectedUser.mobile}</p>
                          </div>

                        </div>

                        {/* Action Buttons - Redesigned */}
                        <div className="w-full grid grid-cols-2 gap-3 mt-4">
                        <textarea 
                          className="col-span-2 border rounded-md p-2 w-full text-gray-700 resize-none"
                          placeholder="Enter notes (optional)..."
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                        ></textarea>
                           <Button 
                          className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
                          onClick={handleApprove}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>

                        {/* Reject Button */}
                        <Button 
                          variant="outline" 
                          className="text-red-600 border-yellow-200 hover:bg-red-50 flex items-center justify-center"
                          onClick={handleReject}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>

                        {/* New Third Button (Example: "Needs Review") */}
                        <Button 
                          className="bg-red-500 hover:bg-red-600 text-white flex items-center justify-center col-span-2"
                          onClick={handleBlock}
                        >
                          Block
                        </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tables Information */}
                <div className="md:order-1 md:col-span-2">
                  <Card className="border shadow-sm bg-white">
                    <CardContent className="p-6">
                      {/* Verification Info */}
                      {selectedUser.modified && (
                        <div className="mb-6 bg-gray-50 p-4 rounded-lg border">
                          <div>
                            <h3 className="text-xs text-gray-500 uppercase tracking-wider">Verification Date</h3>
                            <p className="font-medium">{selectedUser.modified}</p>
                          </div>
                        </div>
                      )}

                      {/* Tabs */}
                      <Tabs defaultValue="user-details" value={activeTab} onValueChange={setActiveTab}>
                        <div className="overflow-x-auto">
                          <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
                            <TabsTrigger 
                              value="user-details" 
                              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-sm font-medium"
                            >
                              User Details
                            </TabsTrigger>
                            <TabsTrigger 
                              value="identity-verification" 
                              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-sm font-medium"
                            >
                              Identity
                            </TabsTrigger>
                            {/* <TabsTrigger 
                              value="device-check" 
                              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-sm font-medium"
                            >
                              Device
                            </TabsTrigger> 
                            <TabsTrigger 
                              value="account-limits" 
                              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-sm font-medium"
                            >
                              Limits
                            </TabsTrigger>*/}
                            <TabsTrigger 
                              value="user-logs" 
                              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-sm font-medium"
                            >
                              Logs
                            </TabsTrigger>
                            <TabsTrigger 
                              value="remittance" 
                              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-sm font-medium"
                            >
                              Remittance
                            </TabsTrigger>
                          </TabsList>
                        </div>

                        <TabsContent value="user-details" className="mt-6">
                          <div className="space-y-6">
                            <h3 className="font-semibold text-gray-800">Personal Information</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                              <div>
                                <h4 className="text-xs text-gray-500 uppercase tracking-wider">Last Name</h4>
                                <p className="font-medium">{selectedUser.last_name}</p>
                              </div>
                              
                              <div>
                                <h4 className="text-xs text-gray-500 uppercase tracking-wider">First Name</h4>
                                <p className="font-medium">{selectedUser.first_name}</p>
                              </div>
                              
                              
                              <div>
                                <h4 className="text-xs text-gray-500 uppercase tracking-wider">Date of Birth</h4>
                                <p className="font-medium">{selectedUser.dob}</p>
                              </div>
                              
                              
                              <div>
                                <h4 className="text-xs text-gray-500 uppercase tracking-wider">Email Address</h4>
                                <p className="font-medium">{selectedUser.email}</p>
                              </div>
                              
                              <div>
                                <h4 className="text-xs text-gray-500 uppercase tracking-wider">Mobile Number</h4>
                                <p className="font-medium">{selectedUser.mobile}</p>
                              </div>
                              
                              <div className="md:col-span-2">
                                <h3 className="font-semibold text-gray-800 mt-6 mb-4">Address Information</h3>
                              </div>
                              
                              <div>
                                <h4 className="text-xs text-gray-500 uppercase tracking-wider">Region</h4>
                                <p className="font-medium">{selectedUser.region}</p>
                              </div>
                              
                              <div>
                                <h4 className="text-xs text-gray-500 uppercase tracking-wider">Province</h4>
                                <p className="font-medium">{selectedUser.province}</p>
                              </div>
                              
                              <div>
                                <h4 className="text-xs text-gray-500 uppercase tracking-wider">City</h4>
                                <p className="font-medium">{selectedUser.city}</p>
                              </div>

                              <div>
                                <h4 className="text-xs text-gray-500 uppercase tracking-wider">Barangay</h4>
                                <p className="font-medium">{selectedUser.barangay}</p>
                              </div>
                              
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="identity-verification" className="mt-6">
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-800">Identity Documents</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm font-medium">Government ID</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-2">
                                  {selectedUser.image_id ? (
                                    <a href={`https://www.dtaka.ph/remittance_api/uploads/${selectedUser.id}/${encodeURIComponent(selectedUser.image_id)}?t=${new Date().getTime()}`}
                                    target="_blank"><img
                                    src={`https://www.dtaka.ph/remittance_api/uploads/${selectedUser.id}/${encodeURIComponent(selectedUser.image_id)}?t=${new Date().getTime()}`}
                                    alt="Government ID"
                                    className="w-full h-full object-cover rounded-md"
                                  /></a>
                                  ) : (
                                    <FileText className="h-12 w-12 text-gray-400" />
                                  )}
                                  </div>
                                  
                                </CardContent>
                              </Card>
                              
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm font-medium">Selfie Verification</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-2">
                                  {selectedUser.image_selfie ? (
                                    <a href={`https://www.dtaka.ph/remittance_api/uploads/${selectedUser.id}/${encodeURIComponent(selectedUser.image_selfie)}?t=${new Date().getTime()}`}
                                    target="_blank"><img
                                    src={`https://www.dtaka.ph/remittance_api/uploads/${selectedUser.id}/${encodeURIComponent(selectedUser.image_selfie)}?t=${new Date().getTime()}`}
                                    alt="Government ID"
                                    className="w-full h-full object-cover rounded-md"
                                  /></a>
                                  ) : (
                                    <FileText className="h-12 w-12 text-gray-400" />
                                  )}
                                  </div>
                                  
                                </CardContent>
                              </Card>
                            </div>
                            
                            {/* <div className="mt-6">
                              <h4 className="text-sm font-medium mb-2">Verification History</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                  <div>
                                    <p className="font-medium">ID Submitted</p>
                                    <p className="text-sm text-gray-500">Mar 01, 2025, 10:23 AM</p>
                                  </div>
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                                    Submitted
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                  <div>
                                    <p className="font-medium">ID Verified</p>
                                    <p className="text-sm text-gray-500">Mar 01, 2025, 3:15 PM</p>
                                  </div>
                                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                                    Approved
                                  </Badge>
                                </div>
                              </div>
                            </div> */}
                          </div>
                        </TabsContent>

                        {/* <TabsContent value="device-check" className="mt-6">
                          <div className="space-y-6">
                            <h3 className="font-semibold text-gray-800">Device Information</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm font-medium flex items-center">
                                    <Shield className="h-4 w-4 mr-2 text-blue-500" />
                                    Current Device
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-3">
                                    <div>
                                      <h4 className="text-xs text-gray-500 uppercase tracking-wider">Device Type</h4>
                                      <p className="font-medium">iPhone 13 Pro</p>
                                    </div>
                                    <div>
                                      <h4 className="text-xs text-gray-500 uppercase tracking-wider">Operating System</h4>
                                      <p className="font-medium">iOS 16.5.1</p>
                                    </div>
                                    <div>
                                      <h4 className="text-xs text-gray-500 uppercase tracking-wider">IP Address</h4>
                                      <p className="font-medium">192.168.1.45</p>
                                    </div>
                                    <div>
                                      <h4 className="text-xs text-gray-500 uppercase tracking-wider">Last Login</h4>
                                      <p className="font-medium">Mar 10, 2025, 8:45 AM</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm font-medium flex items-center">
                                    <Shield className="h-4 w-4 mr-2 text-green-500" />
                                    Security verified
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-3">
                                    <div>
                                      <div className="flex justify-between mb-1">
                                        <h4 className="text-xs text-gray-500 uppercase tracking-wider">Device Trust Score</h4>
                                        <span className="text-xs font-medium text-green-600">92/100</span>
                                      </div>
                                      <Progress value={92} className="h-2 bg-gray-100" />
                                    </div>
                                    <div className="pt-2">
                                      <h4 className="text-xs text-gray-500 uppercase tracking-wider">Security Features</h4>
                                      <div className="mt-2 space-y-2">
                                        <div className="flex items-center">
                                          <Check className="h-4 w-4 text-green-500 mr-2" />
                                          <p className="text-sm">Biometric Authentication</p>
                                        </div>
                                        <div className="flex items-center">
                                          <Check className="h-4 w-4 text-green-500 mr-2" />
                                          <p className="text-sm">Two-Factor Authentication</p>
                                        </div>
                                        <div className="flex items-center">
                                          <X className="h-4 w-4 text-red-500 mr-2" />
                                          <p className="text-sm">Jailbreak Detection</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                            
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">Device History</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                  <div>
                                    <p className="font-medium">iPhone 13 Pro</p>
                                    <p className="text-sm text-gray-500">Last used: Mar 10, 2025</p>
                                  </div>
                                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                                    Current
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                  <div>
                                    <p className="font-medium">MacBook Pro</p>
                                    <p className="text-sm text-gray-500">Last used: Mar 05, 2025</p>
                                  </div>
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                                    Trusted
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                  <div>
                                    <p className="font-medium">Samsung Galaxy S22</p>
                                    <p className="text-sm text-gray-500">Last used: Feb 15, 2025</p>
                                  </div>
                                  <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
                                    Inactive
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent> 

                        <TabsContent value="account-limits" className="mt-6">
                          <div className="space-y-6">
                            <h3 className="font-semibold text-gray-800">Account Limits</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm font-medium flex items-center">
                                    <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
                                    Transaction Limits
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    <div>
                                      <div className="flex justify-between mb-1">
                                        <h4 className="text-xs text-gray-500 uppercase tracking-wider">Daily Withdrawal</h4>
                                        <span className="text-xs font-medium">$2,000 / $5,000</span>
                                      </div>
                                      <Progress value={40} className="h-2 bg-gray-100" />
                                    </div>
                                    <div>
                                      <div className="flex justify-between mb-1">
                                        <h4 className="text-xs text-gray-500 uppercase tracking-wider">Monthly Transfer</h4>
                                        <span className="text-xs font-medium">$8,500 / $20,000</span>
                                      </div>
                                      <Progress value={42.5} className="h-2 bg-gray-100" />
                                    </div>
                                    <div>
                                      <div className="flex justify-between mb-1">
                                        <h4 className="text-xs text-gray-500 uppercase tracking-wider">International Transfer</h4>
                                        <span className="text-xs font-medium">$0 / $10,000</span>
                                      </div>
                                      <Progress value={0} className="h-2 bg-gray-100" />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm font-medium flex items-center">
                                    <Shield className="h-4 w-4 mr-2 text-green-500" />
                                    Account Level
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-xs text-gray-500 uppercase tracking-wider">Current Tier</h4>
                                      <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                                        {selectedUser.verified === "yes" ? "Tier 2" : selectedUser.verified === "submitted" ? "Tier 1" : "Basic"}
                                      </Badge>
                                    </div>
                                    <div className="pt-2">
                                      <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Upgrade Requirements</h4>
                                      {selectedUser.verified === "yes" ? (
                                        <div className="text-sm text-green-600 font-medium">
                                          Maximum tier level reached
                                        </div>
                                      ) : (
                                        <div className="space-y-2">
                                          <div className="flex items-center">
                                            {selectedUser.verified === "submitted" ? (
                                              <Check className="h-4 w-4 text-green-500 mr-2" />
                                            ) : (
                                              <X className="h-4 w-4 text-red-500 mr-2" />
                                            )}
                                            <p className="text-sm">ID Verification</p>
                                          </div>
                                          <div className="flex items-center">
                                            <X className="h-4 w-4 text-red-500 mr-2" />
                                            <p className="text-sm">Proof of Address</p>
                                          </div>
                                          <div className="flex items-center">
                                            <X className="h-4 w-4 text-red-500 mr-2" />
                                            <p className="text-sm">Enhanced Due Diligence</p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </TabsContent>*/}

                        <TabsContent value="user-logs" className="mt-6">
                          <div className="space-y-6">
                            <h3 className="font-semibold text-gray-800">Activity Logs</h3>
                            
                            <div className="overflow-x-auto rounded-md border">
                              <Table>
                                <TableHeader className="bg-gray-50">
                                  <TableRow>
                                    <TableHead className="font-medium">Date & Time</TableHead>
                                    <TableHead className="font-medium">Activity</TableHead>
                                    <TableHead className="font-medium">By Admin</TableHead>
                                    <TableHead className="font-medium w-40 truncate">Note</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                {userLogs && userLogs.length > 0 ? (
                                userLogs.map((logs) => (
                                  <TableRow key={logs.id} className="border-t hover:bg-gray-50">
                                    <TableCell className="text-sm">
                                      <div className="flex items-center">
                                        <Clock className="h-3 w-3 mr-2 text-gray-400" />
                                        <span>{logs.date}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>{logs.activity}</TableCell>
                                    <TableCell>{logs.first_name} {logs.last_name}</TableCell>
                                    <TableCell>{logs.note}</TableCell>
                                  </TableRow>
                                  ))
                                  ) : (
                                    <TableRow>
                                      <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                                        No logs found.
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                            
                            {/* <div className="flex justify-center">
                              <Button variant="outline" size="sm" className="text-sm">
                                Load More Logs
                              </Button>
                            </div> */}
                          </div>
                        </TabsContent>

                        <TabsContent value="remittance" className="mt-6">
                          <div className="space-y-6">
                            <h3 className="font-semibold text-gray-800">Transactions History</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              <Card>
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm text-gray-500">Total Remit</p>
                                      <p className="text-2xl font-bold">
                                      {formatPeso(totalRemitAmount)}
                                      </p>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <Send className="h-5 w-5 text-blue-600" />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              
                              <Card>
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm text-gray-500">Balance</p>
                                      <p className="text-2xl font-bold">{formatPeso(parseFloat(selectedUser.balance))}</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                      <CreditCard className="h-5 w-5 text-green-600" />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              
                              <Card>
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm text-gray-500">Transactions</p>
                                      <p className="text-2xl font-bold">{transactions && transactions.length > 0 ? (<>{transactions.length}</>):(<>0</>)}</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                      <Clock className="h-5 w-5 text-purple-600" />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                            
                            <div className="overflow-x-auto rounded-md border">
                              <Table>
                                <TableHeader className="bg-gray-50">
                                  <TableRow>
                                    <TableHead className="font-medium">Date</TableHead>
                                    <TableHead className="font-medium">Type</TableHead>
                                    <TableHead className="font-medium">Recipient/Sender</TableHead>
                                    <TableHead className="font-medium">Amount</TableHead>
                                    <TableHead className="font-medium">verified</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                {transactions && transactions.length > 0 ? (
                                transactions.map((trans) => (
                                  <TableRow className="border-t hover:bg-gray-50">
                                    <TableCell>{trans.date}</TableCell>
                                    <TableCell>
                                      {
                                        trans.trans_type==="remit" ?
                                      (<Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                                        Remit
                                      </Badge>):
                                      (
                                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                                        Redeem
                                      </Badge>
                                      )
                                      }
                                    </TableCell>
                                    <TableCell>
                                      {
                                        trans.trans_type==="remit" ?
                                      (<>{trans.first_name} {trans.last_name}</>):
                                      (
                                        <>-</>
                                      )
                                      }</TableCell>
                                    <TableCell className="font-medium">
                                      {formatPeso(trans.amount)}</TableCell>
                                    <TableCell>
                                     
                                      {
                                      trans.status==="success" ?
                                      ( 
                                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                                        Success
                                      </Badge>):
                                      trans.status==="processing" ?(
                                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                        Processing
                                      </Badge>
                                      ):
                                      (<Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                                        Failed
                                      </Badge>)
                                      }
                                    </TableCell>
                                  </TableRow>
                                  
                                   ))
                                  ) : (
                                    <TableRow>
                                      <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                                        No transaction found.
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                            
                            {/* <div className="flex justify-center">
                              <Button variant="outline" size="sm" className="text-sm">
                                View All Transactions
                              </Button>
                            </div> */}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
        </DialogContent>
      </Dialog>
      
    </div>
    
  );
}