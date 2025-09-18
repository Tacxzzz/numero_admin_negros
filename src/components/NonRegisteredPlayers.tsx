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
import { Input } from '@/components/ui/input';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth0 } from '@auth0/auth0-react';
import { loginAdmin, getBetsHistory, getClientWinners, cashOutCashko } from './api/apiCalls';
import { formatPeso } from './utils/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export function NonRegisteredPlayers() {
  const { user, getAccessTokenSilently, logout } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [dbUpdated, setDbUpdated] = useState(false);
  const [gamebets, setGamebets] = useState<any[]>([]);
  const [filteredGamebets, setFilteredGamebets] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [sortedGamebets, setSortedGamebets] = useState<any[]>([]);
  const [permissionsString, setPermissionsString] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGameBet, setSelectedGameBet] = useState(null);

  useEffect(() => {
    if (user && !dbUpdated) {
      const handleUpdate = async () => {
        const dataUpdated = await loginAdmin(user, getAccessTokenSilently);
        if (dataUpdated.dbUpdate) {
          setDbUpdated(dataUpdated.dbUpdate);
          setPermissionsString(JSON.parse(dataUpdated.permissions));
          setLoading(false);
          const gamesData = await getClientWinners();
          setGamebets(gamesData);
          setFilteredGamebets(gamesData);
          setSortedGamebets(gamesData); // Initialize sorted data
        } else {
          alert("UNAUTHORIZED USER!");
          localStorage.setItem("isLoggedIn", "false");
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
        bet.game_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by date
    if (startDate) {
      filtered = filtered.filter((bet) => {
        const betDate = new Date(bet.created_date);
        return betDate.toDateString() === startDate.toDateString();
      });
    }

    setFilteredGamebets(filtered);
  }, [searchQuery, startDate, gamebets]);

  useEffect(() => {
    // Sort the filtered gamebets by date
    const sorted = [...filteredGamebets].sort((a, b) => {
      const dateA = new Date(a.created_date).getTime();
      const dateB = new Date(b.created_date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setSortedGamebets(sorted);
  }, [sortOrder, filteredGamebets]);

  const handleEditClick = (game) => {
    setSelectedGameBet({ ...game });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
      setLoading(true);
      setIsModalOpen(false);
  
  
      const data = await cashOutCashko(
        selectedGameBet.id,
        selectedGameBet.amount,
        selectedGameBet.full_name,
        selectedGameBet.bank,
        selectedGameBet.account);

      console.log(data);
      if (data.error) 
      {
        alert(data.message);
      } 
      else 
      {
        alert("Payout request created successfully.");
        
      }


      const gamesData = await getClientWinners();
      setGamebets(gamesData);
      setFilteredGamebets(gamesData);
      setSortedGamebets(gamesData); // Initialize sorted data
      
      setLoading(false);
      
    };

  if (loading) {
    return <div>Loading...</div>;
  }

  if(!permissionsString.includes("winners"))
  {
    return <div>Not allowed to manage this page</div>
  }

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">Process Non-Registered Players Winners History</h2>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Input
          type="text"
          placeholder="Search by Game Name"
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
          onClick={toggleSortOrder}
          className="text-white px-4 py-2 rounded-md"
        >
          Sort by Date ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Card className="lg:col-span-7">
          <CardContent>
          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Agent</TableHead>
                  <TableHead className="text-center">Client No</TableHead>
                  <TableHead className="text-center">Order No</TableHead>
                  <TableHead className="text-center">Amount to Cashout</TableHead>
                  <TableHead className="text-center">Name</TableHead>
                  <TableHead className="text-center">Bank</TableHead>
                  <TableHead className="text-center">Account</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedGamebets.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="text-center">{product.date}</TableCell>
                    <TableCell className="text-center">{product.mobile}</TableCell>
                    <TableCell className="text-center">{product.trans_num}</TableCell>
                    <TableCell className="text-center">{product.invoice}</TableCell>
                    <TableCell className="text-center">{formatPeso(product.amount)}</TableCell>
                    <TableCell className="text-center">{product.full_name}</TableCell>
                    <TableCell className="text-center">{product.bank}</TableCell>
                    <TableCell className="text-center">{product.account}</TableCell>
                    <TableCell className="text-center">
                    {
                    product.status ==="syncing" && (
                      <>
                       <Button
                        className="w-full sm:w-auto bg-blue-500 border-blue-500 text-white-600 hover:bg-blue-500/20 hover:text-white-700 mr-2 mb-2"
                        onClick={() => handleEditClick(product)}
                      >
                        Process Cashout For Client
                      </Button>
                      </>
                    )
                    }
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
          <DialogContent className="bg-gray-50 border-[#34495e] max-h-[90vh] w-120 overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl text-blue-600">Process Payout for client</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <form onSubmit={handleSave}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                  <Input
                    type="text"
                    name="available_days"
                    value={selectedGameBet.full_name || ""}
                    required
                    readOnly
                    className="border p-1 mt-2 w-full"
                    placeholder="m-t-w-th-f-s-su or daily"
                  />
                </label>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank
                  <Input
                    type="text"
                    name="available_days"
                    value={selectedGameBet.bank || ""}
                    required
                    readOnly
                    className="border p-1 mt-2 w-full"
                    placeholder="m-t-w-th-f-s-su or daily"
                  />
                </label>
                </div>


                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account No.
                  <Input
                    type="text"
                    name="available_days"
                    value={selectedGameBet.account || ""}
                    required
                    readOnly
                    className="border p-1 mt-2 w-full"
                    placeholder="m-t-w-th-f-s-su or daily"
                  />
                </label>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prize
                  <Input
                    type="text"
                    name="available_days"
                    value={selectedGameBet.amount || ""}
                    required
                    readOnly
                    className="border p-1 mt-2 w-full"
                    placeholder="m-t-w-th-f-s-su or daily"
                  />
                </label>
                </div>

                <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                    type="submit"
                  >
                    Confirm Payout
                  </Button>
                  <Button
                    type='button'
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