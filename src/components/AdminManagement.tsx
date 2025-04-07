import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Filter, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { loginAdmin,getGames, updateGame, getGamesTypes, updateGameType, getDraws, getTransactionsCashin, getTransactionsCashout, getBetsHistory, getBetsHistoryWinners, getPlayers, updatePlayer, getPlayersAdmin, updateAdmin, revokeAccess, allowAccess } from './api/apiCalls';
import { formatPeso } from './utils/utils';

interface User {
  id: string;
  admin_mail: string;
  type: string;
  created: string;
  permissions: string[];
  role: string;
//   avatarInitials: string;
}

export function AdminManagement() {
  const navigate = useNavigate();
  const { user,getAccessTokenSilently , logout} = useAuth0();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userID, setUserID] = useState("none");
  const [dbUpdated, setDbUpdated] = useState(false);


  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<any[]>([]);
  const [permissionsString, setPermissionsString] = useState([]);
  

  const handleUpdate = async () => {
    const dataUpdated= await loginAdmin(user,getAccessTokenSilently);
    if(dataUpdated.dbUpdate)
    {
      setDbUpdated(dataUpdated.dbUpdate);
      setUserID(dataUpdated.userID);
      setPermissionsString(JSON.parse(dataUpdated.permissions));
      setLoading(false);

      const gamesData = await getPlayersAdmin();
      setUsers(gamesData);

      
    }
    else
    {
      alert("UNAUTHORIZED USER!");
      logout({ logoutParams: { returnTo: window.location.origin } });
    }
    
  };

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

          const gamesData = await getPlayersAdmin();
          setUsers(gamesData);

          
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


  


  // Available roles
  const roles = [
    "SYSTEM ADMIN",
    "ADMIN LEVEL 1",
    "ADMIN LEVEL 2",
    "TEAM LEVEL ADMIN",
    "FINANCE MANAGER",
    "CUSTOMER SUPPORT"
  ];

  // All available permissions
  const allPermissions = [
    { id: "dashboard", label: "ACCESS DASHBOARD" },
    { id: "games", label: "ACCESS GAMES" },
    { id: "games_types", label: "ACCESS GAMES TYPES" },
    { id: "draws", label: "ACCESS DRAWS" },
    { id: "draws_results", label: "ACCESS MANAGE DRAW RESULTS" },
    { id: "cashin", label: "ACCESS CASHIN HISTORY" },
    { id: "cashout", label: "ACCESS CASHOUT HISTORY" },
    { id: "bets", label: "ACCESS BETS" },
    { id: "winners", label: "ACCESS WINNERS" },
    { id: "players", label: "ACCESS PLAYERS" },
    { id: "clients", label: "ACCESS CLIENTS" },
    { id: "admin_management", label: "ACCESS ADMIN MANAGEMENT" },
    { id: "team_dashboard", label: "ACCESS YOUR TEAM DASHBOARD" },
    { id: "team_players", label: "ACCESS YOUR TEAM PLAYERS" },
    { id: "team_cashin", label: "ACCESS YOUR TEAM CASHIN HISTORY" },
    { id: "team_cashout", label: "ACCESS YOUR TEAM CASHOUT HISTORY" },

  ];


  const rolePermissionsMap: Record<string, string[]> = {
    "SYSTEM ADMIN": allPermissions.map(p => p.id), // all permissions
    "ADMIN LEVEL 1": [
      "dashboard",
      "games",
      "games_types",
      "draws",
      "draws_results",
      "cashin",
      "cashout",
      "bets",
      "players"
    ],
    "ADMIN LEVEL 2": [
      "dashboard",
      "games",
      "draws",
      "cashin",
      "team_cashout"
    ],
    "TEAM LEVEL ADMIN": [
      "team_dashboard",
      "team_players",
      "team_cashin",
      "team_cashout"
    ],
    "FINANCE MANAGER": [
      "dashboard",
      "cashin",
      "cashout",
      "winners"
    ],
    "CUSTOMER SUPPORT": [
      "dashboard",
      "players",
      "bets"
    ]
  };
  

  

  // Filter users based on search and role filter
  const filteredUsers = users.filter((user) => {
    // Apply role filter
    if (roleFilter && user.role !== roleFilter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
  };

  const handlePermissionChange = (permission: string) => {
    if (!selectedUser) return;
  
    const updatedUser = { 
      ...selectedUser, 
      permissions: Array.isArray(selectedUser.permissions) ? selectedUser.permissions : [] 
    };
    
  
    // Toggle permission
    if (updatedUser.permissions.includes(permission)) {
      updatedUser.permissions = updatedUser.permissions.filter(p => p !== permission);
    } else {
      updatedUser.permissions = [...updatedUser.permissions, permission];
    }
  
    // Clear the role to signify custom permissions
    updatedUser.role = "";
  
    setSelectedUser(updatedUser);
  
    console.log(`Updated permissions for ${updatedUser.admin_mail}:`, updatedUser.permissions);
    console.log(`Role cleared due to manual permission change.`);
  };
  

  const handleRoleChange = (role: string) => {
    if (!selectedUser) return;
  
    const newPermissions = rolePermissionsMap[role] || [];
  
    const updatedUser = { ...selectedUser, role, permissions: newPermissions };
    setSelectedUser(updatedUser);
  
    console.log(`Updated role for ${updatedUser.admin_mail} to ${role}`);
    console.log(`Updated permissions:`, newPermissions);
  };
  



  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      setUpdating(true);
  
      const formData = new FormData();
      formData.append('userID', selectedUser.id);
      formData.append('role', selectedUser.role);
      formData.append('permissions', JSON.stringify(selectedUser.permissions));

  
      setLoading(true);
      const isAuthenticated = await updateAdmin(formData);
      if (!isAuthenticated) {
        alert("An error occurred!");
        setUpdating(false);
        setLoading(false);
      } else {
        setUpdating(false);
        setLoading(false);
        alert("Admin updated successfully.");
        const gamesData = await getPlayersAdmin();
        setUsers(gamesData);
      }

      
    };


    const handleDynamicSave = async (e: React.FormEvent, action: string) => {
      e.preventDefault();
      setUpdating(true);
    
      const formData = new FormData();
      formData.append('userID', selectedUser.id);
      formData.append('action', action); // Add the action to formData if needed
    
      setLoading(true);
    
      let success = false;
    
      if (action === "revoke") {
        success = await revokeAccess(formData);
      } else if (action === "allow") {
        success = await allowAccess(formData); // Example
      }
    
      if (!success) {
        alert("An error occurred!");
      } else {
        alert("Admin updated successfully.");
        const gamesData = await getPlayersAdmin();
        setUsers(gamesData);
        setSelectedUser(null);
        handleUpdate();
      }
    
      setUpdating(false);
      setLoading(false);
    };
    


  if(!permissionsString.includes("admin_management"))
  {
    return <div>Not allowed to manage this page</div>
  }


  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">Admin Management</h2>
        
       
      </div>

      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
        
        
        <TabsContent value="users" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={undefined}>All Roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>

            <div className="w-full md:w-auto">
              <div className="relative">
                <Input
                  placeholder="Search users..."
                  className="w-full md:w-[300px] pl-3 pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 h-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="rounded-md border overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="font-medium">Admin Users</h3>
                </div>
                <div className="divide-y max-h-[600px] overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <div 
                      key={user.id}
                      className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                        selectedUser?.id === user.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="flex items-center space-x-3">
                        {/* <Avatar className="h-10 w-10 bg-gray-200">
                          <AvatarFallback>{user.avatarInitials}</AvatarFallback>
                        </Avatar> */}
                        <div>
                          {/* <p className="font-medium">{user.name}</p> */}
                          <p className="text-sm text-gray-500">{user.admin_mail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedUser ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        {/* <Avatar className="h-24 w-24 text-2xl bg-gray-200">
                          <AvatarFallback>{selectedUser.avatarInitials}</AvatarFallback>
                        </Avatar> */}
                      </div>
                      
                      <div className="flex-grow space-y-6">
                        <div>
                          {/* <h3 className="text-xl font-bold">{selectedUser.name}</h3> */}
                          <p className="text-gray-500">{selectedUser.admin_mail}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* <div>
                            <p className="text-sm text-gray-500">ID</p>
                            <p className="font-mono">{selectedUser.id}</p>
                          </div> */}
                          
                          <div>
                            <p className="text-sm text-gray-500">Role</p>
                            <Select value={selectedUser.role} onValueChange={handleRoleChange}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                {roles.map((role) => (
                                  <SelectItem key={role} value={role}>{role}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          

                          
                          <div>
                            
                            <div>
                            <p className="text-sm text-gray-500 mt-2">Created at</p>
                            <p>{selectedUser.created}</p>
                          </div>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t">
                          <h4 className="font-medium mb-4">Permissions</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {allPermissions.map((permission) => (
                              <div key={permission.id} className="flex items-start space-x-2">
                                <Checkbox 
                                  id={`permission-${permission.id}`}
                                  checked={selectedUser.permissions.includes(permission.id)}
                                  onCheckedChange={() => handlePermissionChange(permission.id)}
                                  className="mt-1"
                                />
                                <Label 
                                  htmlFor={`permission-${permission.id}`}
                                  className="text-sm font-medium leading-tight"
                                >
                                  {permission.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2 pt-4">
                          {/* <Button variant="outline">Reset Password</Button> */}
                          
                          {selectedUser.type!=="admin" ? (
                          <Button onClick={(e) => handleDynamicSave(e, "allow")}>Allow Access</Button>
                          ):
                          (
                            <Button
                            onClick={(e) => handleDynamicSave(e, "revoke")}
                            variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            Revoke Access</Button>
                          )
                          }
                          <Button onClick={handleSave}>Save Changes</Button>
                          
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[400px] border rounded-md bg-gray-50">
                  <div className="text-center p-6">
                    <p className="text-gray-500">Select a user to view and edit details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-md border">
            <h3 className="text-lg font-medium mb-4">Role Management</h3>
            <p>Role management functionality will be implemented here.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="audit" className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-md border">
            <h3 className="text-lg font-medium mb-4">Audit Log</h3>
            <p>Audit log functionality will be implemented here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}