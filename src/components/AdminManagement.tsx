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
import { loginAdmin,getGames, updateGame, getGamesTypes, updateGameType, getDraws, getTransactionsCashin, getTransactionsCashout, getBetsHistory, getBetsHistoryWinners, getPlayers, updatePlayer, getPlayersAdmin } from './api/apiCalls';
import { formatPeso } from './utils/utils';

interface User {
  id: string;
  admin_mail: string;
  type: string;
  created: string;
  permissions: string[];
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
  

   useEffect(() => {
    if (user && !dbUpdated) {
      const handleUpdate = async () => {
        const dataUpdated= await loginAdmin(user,getAccessTokenSilently);
        if(dataUpdated.dbUpdate)
        {
          setDbUpdated(dataUpdated.dbUpdate);
          setUserID(dataUpdated.userID);
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

  // Sample users data
  /* const users: User[] = [
    {
      id: "1",
      name: "Raymond Babst",
      email: "ceo.da5@gmail.com",
      role: "COMPLIANCE LEVEL 1",
      createdAt: "March 28, 2025",
      lastLoggedIn: "March 28, 2025",
      permissions: [
        "VIEW_MANAGE_GAME_BETS",
        "VIEW_MANAGE_PLAYER_BETS",
        "VIEW_MANAGE_DRAW_SCHEDULES",
      ],
    //   avatarInitials: "RB"
    },
    {
        id: "2",
        name: "Raymond Babst",
        email: "cqo.aa5@gmail.com",
        role: "ADMIN LEVEL 1",
        createdAt: "March 28, 2025",
        lastLoggedIn: "March 28, 2025",
        permissions: [
            "VIEW_MANAGE_GAME_BETS",
            "VIEW_MANAGE_PLAYER_BETS",
            "VIEW_MANAGE_USERS",
            "VIEW_LOGS",
        ],
      //   avatarInitials: "RB"
      },
    {
      id: "3",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      role: "ADMIN LEVEL 2",
      createdAt: "March 25, 2025",
      lastLoggedIn: "March 27, 2025",
      permissions: [
        "VIEW_MANAGE_GAME_BETS",
        "VIEW_MANAGE_PLAYER_BETS",
        "VIEW_MANAGE_DRAW_SCHEDULES",
        "VIEW_MANAGE_USERS",
        "VIEW_LOGS",
      ],
    //   avatarInitials: "SJ"
    },
    {
      id: "4",
      name: "Michael Chen",
      email: "m.chen@example.com",
      role: "FINANCE MANAGER",
      createdAt: "March 20, 2025",
      lastLoggedIn: "March 28, 2025",
      permissions: [
        "VIEW_MANAGE_GAME_BETS",
        "VIEW_MANAGE_PLAYER_BETS",
        "VIEW_LOGS"
      ],
    //   avatarInitials: "MC"
    },
    {
      id: "5",
      name: "Jessica Williams",
      email: "j.williams@example.com",
      role: "COMPLIANCE LEVEL 2",
      createdAt: "March 15, 2025",
      lastLoggedIn: "March 26, 2025",
      permissions: [
        "VIEW_MANAGE_USERS",
        "VIEW_LOGS"
        
      ],
    //   avatarInitials: "JW"
    },
    {
      id: "6",
      name: "David Rodriguez",
      email: "d.rodriguez@example.com",
      role: "SYSTEM ADMIN",
      createdAt: "March 10, 2025",
      lastLoggedIn: "March 28, 2025",
      permissions: [
        "VIEW_MANAGE_GAME_BETS",
        "VIEW_MANAGE_PLAYER_BETS",
        "VIEW_MANAGE_DRAW_SCHEDULES",
        "VIEW_MANAGE_USERS",
        "VIEW_LOGS",
        "VIEW_MANAGE_ADMIN_MANAGEMENT"
      ],
    //   avatarInitials: "DR"
    }
  ]; */

  // Available roles
  const roles = [
    "SYSTEM ADMIN",
    "ADMIN LEVEL 1",
    "ADMIN LEVEL 2",
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

    // { id: "VIEW_TRANSACTIONS", label: "VIEW TRANSACTIONS" },
    // { id: "EXPORT_DATA", label: "EXPORT DATA" },
    // { id: "VIEW_DASHBOARD", label: "VIEW DASHBOARD" },
    // { id: "ADMIN_VIEW", label: "ADMIN VIEW" },
    // { id: "ADMIN_EDIT", label: "ADMIN EDIT" },
    // { id: "VIEW_CRYPTO_WALLET", label: "VIEW CRYPTO WALLET" },
    // { id: "UPDATE_CRYPTO_WALLET", label: "UPDATE CRYPTO WALLET" },
    // { id: "VIEW_CRYPTO_TRANSACTION", label: "VIEW CRYPTO TRANSACTION" },
    // { id: "VIEW_ORGANIZATION", label: "VIEW ORGANIZATION" },
    // { id: "CREATE_ORGANIZATION", label: "CREATE ORGANIZATION" },
    // { id: "MANAGE_ORGANIZATION", label: "MANAGE ORGANIZATION" },
    // { id: "MANAGE_TRANSACTION", label: "MANAGE TRANSACTION" }
  ];

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
    
    const updatedUser = { ...selectedUser };
    if (updatedUser.permissions.includes(permission)) {
      updatedUser.permissions = updatedUser.permissions.filter(p => p !== permission);
    } else {
      updatedUser.permissions = [...updatedUser.permissions, permission];
    }
    
    setSelectedUser(updatedUser);
    
    // In a real app, you would save these changes to the backend
    console.log(`Updated permissions for ${updatedUser.admin_mail}:`, updatedUser.permissions);
  };

  const handleRoleChange = (role: string) => {
    if (!selectedUser) return;
    
    const updatedUser = { ...selectedUser, role };
    setSelectedUser(updatedUser);
    
    // In a real app, you would save these changes to the backend
    console.log(`Updated role for ${updatedUser.admin_mail} to ${role}`);
  };


  /* return <div>Not allowed to manage this page</div> */
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">Admin Management</h2>
        
        {/* <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Export Users
          </Button>
          <Button className="flex items-center">
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Admin
          </Button>
        </div> */}
      </div>

      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
        {/* <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList> */}
        
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
                            <Select  onValueChange={handleRoleChange}>
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
                          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            Deactivate User
                          </Button>
                          <Button>Save Changes</Button>
                          {selectedUser.type!=="admin" ? (
                          <Button>Allow Access</Button>
                          ):
                          (
                            <Button>Revoke Access</Button>
                          )
                          }
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