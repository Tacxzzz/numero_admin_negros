import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { loginAdmin, getPlayers, updatePlayer, getPlayersAdminChoice } from './api/apiCalls';
import { formatPeso } from './utils/utils';

export function Users() {
  const navigate = useNavigate();
  const { user, getAccessTokenSilently, logout } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userID, setUserID] = useState("none");
  const [dbUpdated, setDbUpdated] = useState(false);
  const [gamebets, setGamebets] = useState<any[]>([]);
  const [filteredGamebets, setFilteredGamebets] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGameBet, setSelectedGameBet] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [permissionsString, setPermissionsString] = useState([]);

  const [adminChoice, setAdminChoice] = useState<any[]>([]);

  useEffect(() => {
    if (user && !dbUpdated) {
      const handleUpdate = async () => {
        const dataUpdated = await loginAdmin(user, getAccessTokenSilently);
        if (dataUpdated.dbUpdate) {
          setDbUpdated(dataUpdated.dbUpdate);
          setUserID(dataUpdated.userID);
          setPermissionsString(JSON.parse(dataUpdated.permissions));
          setLoading(false);
          const gamesData = await getPlayers();
          setGamebets(gamesData);
          const adminData = await getPlayersAdminChoice();
          setAdminChoice(adminData);

          setFilteredGamebets(gamesData);
        } else {
          alert("UNAUTHORIZED USER!");
          logout({ logoutParams: { returnTo: window.location.origin } });
        }
      };
      handleUpdate();
    }
  }, [user, dbUpdated, getAccessTokenSilently, logout]);

  useEffect(() => {
    let filtered = gamebets;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((bet) =>
        bet.mobile.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by date
    if (startDate) {
      filtered = filtered.filter((bet) => {
        const betDate = new Date(bet.created);
        return betDate.toDateString() === startDate.toDateString();
      });
    }

    setFilteredGamebets(filtered);
  }, [searchQuery, startDate, gamebets]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if(!permissionsString.includes("players"))
  {
    return <div>Not allowed to manage this page</div>
  }

  const handleEditClick = (game) => {
    setSelectedGameBet(game);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append('userID', selectedGameBet.id);
    formData.append('status', selectedGameBet.status);
    formData.append('under_admin', selectedGameBet.under_admin);
    formData.append('level', selectedGameBet.level);
    formData.append('quota', selectedGameBet.quota);
    formData.append('quota_time', selectedGameBet.quota_time);
    formData.append('quota_allow', selectedGameBet.quota_allow);


    setLoading(true);
    const isAuthenticated = await updatePlayer(formData);
    if (!isAuthenticated) {
      alert("An error occurred!");
      setUpdating(false);
      setIsModalOpen(false);
      setLoading(false);
    } else {
      setUpdating(false);
      setIsModalOpen(false);
      setLoading(false);
      alert("Player updated successfully.");
      const gamesData = await getPlayers();
      setGamebets(gamesData);
      setFilteredGamebets(gamesData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedGameBet((prev) => ({ ...prev, [name]: value }));
  };

  const sortedGamebets = [...filteredGamebets].sort((a, b) => {
    const dateA = new Date(a.created).getTime();
    const dateB = new Date(b.created).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">List of Users</h2>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Input
          type="text"
          placeholder="Search by Users Mobile Number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/3"
        />
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => setStartDate(date)}
          placeholderText="Filter by Date"
          className="border p-2 rounded-md"
        />
        <Button
          onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
          className="text-white px-4 py-2 rounded-md"
        >
          Sort by Date ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Card className="lg:col-span-7">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center hidden sm:table-cell">Users Mobile #</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Created</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Modified</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Account Balance</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Wins</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Commissions</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Referred By</TableHead>
                  <TableHead className="text-center hidden sm:table-cell"># of Referrals</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Referral Limit</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Quota</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Quota Schedule</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">BYPASS QUOTA?</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Action</TableHead>

                  {/* <TableHead className="text-center hidden sm:table-cell">if With a Admin Team</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Status</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Action</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedGamebets.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="text-center hidden sm:table-cell">{product.mobile}</TableCell>
                    <TableCell className="text-center hidden sm:table-cell">{product.created}</TableCell>
                    <TableCell className="text-center hidden sm:table-cell">{product.modified}</TableCell>
                    <TableCell className="text-center hidden sm:table-cell">{formatPeso(product.balance)}</TableCell>
                    <TableCell className="text-center hidden sm:table-cell">{formatPeso(product.wins)}</TableCell>
                    <TableCell className="text-center hidden sm:table-cell">{formatPeso(product.commissions)}</TableCell>
                    <TableCell className="text-center hidden sm:table-cell">{product.referrer_mobile}</TableCell>
                    <TableCell className="text-center hidden sm:table-cell">{product.referral_count}</TableCell>
                    <TableCell className="text-center hidden sm:table-cell">{product.level}</TableCell>
                    <TableCell className="text-center hidden sm:table-cell">{formatPeso(product.quota)}</TableCell>
                    <TableCell className="text-center hidden sm:table-cell">{product.quota_time}</TableCell>
                    <TableCell className="text-center hidden sm:table-cell">{product.quota_allow}</TableCell>

                    <TableCell className="text-center hidden sm:table-cell">
                    <div><strong>if With a Admin Team:</strong> {product.under_admin_mail}</div>
                    <div><strong>Status:</strong> <span className={product.status === "pending" ? "text-green-600" : "text-orange-500"}> {product.status === "pending" ? "Active" : "Inactive"} </span></div>
                    <div className="flex gap-2 align-items-center justify-center mt-2">
                      <Button
                        className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                        onClick={() => handleEditClick(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                        onClick={() => navigate(`/hierarchy?user_mobile=${product.mobile}&user_id=${product.id}`)}
                      >
                        Referrals
                      </Button>
                      <Button
                        className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                        onClick={() => navigate('/logsuser', { state: { userID: product.id } })}
                      >
                        Logs
                      </Button>
                    </div>
                  </TableCell>
                    {/* <TableCell className="text-center hidden sm:table-cell">{product.under_admin_mail}</TableCell>
                    <TableCell className="text-center hidden sm:table-cell">{product.status === "pending" ? "Active" : "Inactive"}</TableCell>
                    <TableCell className="text-center hidden sm:table-cell">
                      <Button
                        className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700 mr-2 mb-2"
                        onClick={() => handleEditClick(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                        onClick={() => navigate(`/hierarchy?user_mobile=${product.mobile}&user_id=${product.id}`)}
                      >
                        Referrals
                      </Button>
                    </TableCell> */}

                {/* Additional row for mobile */}
                <TableCell className="block sm:hidden col-span-full">
                  <div className="flex flex-col gap-2">
                    <div><strong>Users Mobile #:</strong> {product.mobile}</div>
                    <div><strong>Created:</strong> {product.created}</div>
                    <div><strong>Modified:</strong> {product.modified}</div>
                    <div><strong>Account Balance:</strong> {formatPeso(product.balance)}</div>
                    <div><strong>Wins:</strong> {formatPeso(product.wins)}</div>
                    <div><strong>Commissions:</strong> {formatPeso(product.commissions)}</div>
                    <div><strong>Referred By:</strong> {product.referrer_mobile}</div>
                    <div><strong># of Referrals:</strong> {product.referral_count}</div>
                    <div><strong>if With a Admin Team:</strong> {product.under_admin_mail}</div>
                    <div><strong>Status:</strong> <span className={product.status === "pending" ? "text-green-600" : "text-orange-500"}> {product.status === "pending" ? "Active" : "Inactive"} </span></div>
                    <div className="flex gap-2">
                      <Button
                        className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                        onClick={() => handleEditClick(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                        onClick={() => navigate(`/hierarchy?user_mobile=${product.mobile}&user_id=${product.id}`)}
                      >
                        Referrals
                      </Button>

                      <Button
                        className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                        onClick={() => navigate('/logsuser', { state: { userID: product.id } })}
                      >
                        Logs
                      </Button>
                    </div>
                  </div>
                </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Game Dialog */}
        {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="bg-gray-50 border-[#34495e] max-h-[90vh] w-96 overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl text-blue-600">Update Status</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <form onSubmit={handleSave}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Status</label>
                    <select
                      name="status"
                      value={selectedGameBet?.status || ""}
                      onChange={handleChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="" disabled>
                        Select a Status
                      </option>
                      <option value="pending">Active</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                  <br/>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Referral Limit</label>
                    <select
                      name="level"
                      value={selectedGameBet?.level || ""}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="" disabled>
                        Select Schedule
                      </option>
                      <option value="level2">
                          Till Level 2
                        </option>
                        <option value="nolimit">
                          No Limit
                        </option>
                    </select>
                  </div>
                  <br/>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount Quota
                <Input
                  type="number"
                  name="quota"
                  value={selectedGameBet?.quota || ""}
                  onChange={handleChange}
                  required
                  className="border p-1 mt-2 w-full"
                  placeholder="Enter Ceiling Percentage"
                  style={{ appearance: 'textfield' }}
                />
                  <style>{`
                            input[type=number]::-webkit-outer-spin-button,
                            input[type=number]::-webkit-inner-spin-button {
                            -webkit-appearance: none;
                            margin: 0;
                            }
                            input[type=number] {
                            -moz-appearance: textfield;
                            }
                            `}
                  </style> 
              </label>
                  <br/>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quota Schedule</label>
                    <select
                      name="quota_time"
                      value={selectedGameBet?.quota_time || "weekly"}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="" disabled>
                        Select Schedule
                      </option>
                      <option value="weekly">
                          Weekly
                        </option>
                        <option value="daily">
                          Daily
                        </option>
                        <option value="monthly">
                          Monthly
                        </option>
                    </select>
                  </div>
                  <br/>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Let User BYPASS QUOTA?</label>
                    <select
                      name="quota_allow"
                      value={selectedGameBet?.quota_allow || "no"}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="" disabled>
                        Select 
                      </option>
                      <option value="level2">
                          No
                        </option>
                        <option value="yes">
                          Yes
                        </option>
                    </select>
                  </div>
                <br/>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Set Under Admin Team</label>
                    <select
                      name="under_admin"
                      value={selectedGameBet?.under_admin || ""}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="" disabled>
                        Select a Admin Team
                      </option>
                      {adminChoice.map((admin: any) => (
                        <option key={admin.id} value={admin.id}>
                          {admin.admin_mail}
                        </option>
                      ))}
                    </select>
                  </div>
                  <br />
                  <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                    {!updating ? (
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                        type="submit"
                      >
                        Update
                      </Button>
                    ) : (
                      <>Updating....</>
                    )}
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-red-500 text-red-600 hover:bg-red-900/20"
                      onClick={() => setIsModalOpen(false)}
                      type="button"
                    >
                      Cancel
                    </Button>
                  </DialogFooter>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}