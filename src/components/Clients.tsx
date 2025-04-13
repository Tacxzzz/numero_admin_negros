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
import { loginAdmin, getClients, updateClient } from './api/apiCalls';

export function Clients() {
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

  useEffect(() => {
    if (user && !dbUpdated) {
      const handleUpdate = async () => {
        const dataUpdated = await loginAdmin(user, getAccessTokenSilently);
        if (dataUpdated.dbUpdate) {
          setDbUpdated(dataUpdated.dbUpdate);
          setUserID(dataUpdated.userID);
          setPermissionsString(JSON.parse(dataUpdated.permissions));
          setLoading(false);
          const gamesData = await getClients();
          setGamebets(gamesData);
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
        bet.user_mobile.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by date
    if (startDate) {
      filtered = filtered.filter((bet) => {
        const betDate = new Date(bet.date);
        return betDate.toDateString() === startDate.toDateString();
      });
    }

    setFilteredGamebets(filtered);
  }, [searchQuery, startDate, gamebets]);

  useEffect(() => {
    // Sort by date
    const sorted = [...filteredGamebets].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredGamebets(sorted);
  }, [sortOrder, gamebets]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleEditClick = (game) => {
    setSelectedGameBet({ ...game });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setLoading(true);
    setIsModalOpen(false);

    const formData = new FormData();
    formData.append('userID', selectedGameBet.id);
    formData.append('status', selectedGameBet.status);

    const isAuthenticated = await updateClient(formData);
    if (!isAuthenticated) {
      alert("An error occurred!");
    } else {
      // Update the specific row in the table without refetching all data
      setGamebets((prevGamebets) =>
        prevGamebets.map((bet) =>
          bet.id === selectedGameBet.id ? { ...bet, status: selectedGameBet.status } : bet
        )
      );
      setFilteredGamebets((prevFilteredGamebets) =>
        prevFilteredGamebets.map((bet) =>
          bet.id === selectedGameBet.id ? { ...bet, status: selectedGameBet.status } : bet
        )
      );

      const gamesData = await getClients();
      setGamebets(gamesData);
      setFilteredGamebets(gamesData);
      setUpdating(false);
      
    }
    setLoading(false);
    
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedGameBet((prev) => ({ ...prev, [name]: value }));
  };

  if(!permissionsString.includes("clients"))
  {
    return <div>Not allowed to manage this page</div>
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">List of Non-Registered Users from Agents</h2>
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
                  <TableHead className="text-center">Agent</TableHead>
                  <TableHead className="text-center">Added</TableHead>
                  <TableHead className="text-center">Full Name</TableHead>
                  <TableHead className="text-center">Bank</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGamebets.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="text-center">{product.user_mobile}</TableCell>
                    <TableCell className="text-center">{product.date} {product.time}</TableCell>
                    <TableCell className="text-center">{product.full_name}</TableCell>
                    <TableCell className="text-center">{product.bank} - {product.account}</TableCell>
                    <TableCell className="text-center">{product.status}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700 mr-2 mb-2"
                        onClick={() => handleEditClick(product)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Game Dialog */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-gray-50 border-[#34495e] max-h-[90vh] w-96 overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl text-blue-600">Update User Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <form onSubmit={handleSave}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Status</label>
                  <select
                    name="status"
                    value={selectedGameBet?.status || "disabled"}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="" disabled>
                      Set Status
                    </option>
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
                <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                    type="submit"
                  >
                    Update
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-red-500 text-red-600 hover:bg-red-900/20"
                    onClick={() => setIsModalOpen(false)}
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
  );
}