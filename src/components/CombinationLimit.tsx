import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowBigLeft } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { loginAdmin, getBetsHistory, getLogs, getLogsByUser, getGamesData, addCombinationLimit, getCombinationLimits, updateCombinationLimit } from "./api/apiCalls";
import { formatPeso } from "./utils/utils";
import { CSVLink } from "react-csv"; 
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

export function CombinationLimit() {
  const navigate = useNavigate();
  const location = useLocation();
  const userID = location.state?.userID;
  const { user, getAccessTokenSilently, logout } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [dbUpdated, setDbUpdated] = useState(false);
  const [gamebets, setGamebets] = useState<any[]>([]);
  const [gamesInfo, setGamesInfo] = useState<any[]>([]);
  const [filteredGamebets, setFilteredGamebets] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof any>("game_name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const rowsPerPage = 10;
  const [showGameDialog, setshowGameDialog] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGameBet, setSelectedGameBet] = useState(null);
  const [updating, setUpdating] = useState(false);


  const [combinationAdd, setCombinationAdd] = useState("");
  const [combinationLimitAdd, setCombinationLimitAdd] = useState("");

  useEffect(() => {
    if (user && !dbUpdated) {
      const handleUpdate = async () => {
        try {
          const dataUpdated = await loginAdmin(user, getAccessTokenSilently);
          if (dataUpdated.dbUpdate) {
            setDbUpdated(dataUpdated.dbUpdate);
            const gamesData = await getGamesData(userID);
            setGamesInfo(gamesData);
            const combinationData = await getCombinationLimits(userID);
            setGamebets(combinationData);
            setFilteredGamebets(combinationData);
          } else {
            alert("UNAUTHORIZED USER!");
            localStorage.setItem("isLoggedIn", "false");
            logout({ logoutParams: { returnTo: window.location.origin } });
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
      handleUpdate();
    }
  }, [user, dbUpdated, getAccessTokenSilently, logout]);

  const handleEditClick = (game) => {
    setSelectedGameBet(game);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedGameBet((prev) => ({ ...prev, [name]: value, }));
  };

  const handleAddData =  async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setshowGameDialog(false);
      console.log("click");
  
      
  
      const formData = new FormData();
      formData.append('userID', userID);
      formData.append('combination', combinationAdd);
      formData.append('combination_limit', combinationLimitAdd);
  
  
      setLoading(true);
      const isAuthenticated = await addCombinationLimit(formData);
      if (!isAuthenticated) {
        alert("an error occurred!");
        setLoading(false);
          
      }
      else
      { 
        const gamesData = await getGamesData(userID);
        setGamesInfo(gamesData);
        const combinationData = await getCombinationLimits(userID);
        setGamebets(combinationData);
        setFilteredGamebets(combinationData);
        setLoading(false);
        alert("added successfully!");
      }
    };


    const handleSave =  async (e: React.FormEvent) => {
      e.preventDefault();
      
      console.log("click");
  
      
  
      const formData = new FormData();
      formData.append('userID', selectedGameBet.id);
      formData.append('combination', selectedGameBet.combination);
      formData.append('combination_limit', selectedGameBet.combination_limit);
      formData.append('status', selectedGameBet.status);  
  
  
      const isAuthenticated = await updateCombinationLimit(formData);
      if (!isAuthenticated) {
        alert("an error occurred!");
        setshowGameDialog(false);
          
      }
      else
      { 
        const gamesData = await getGamesData(userID);
        setGamesInfo(gamesData);
        const combinationData = await getCombinationLimits(userID);
        setGamebets(combinationData);
        setFilteredGamebets(combinationData);
        setIsModalOpen(false);
        setshowGameDialog(false);
        alert("updated successfully!");
      }
    };


  // Filter gamebets based on search query
  const filteredBets = filteredGamebets.filter((bet) => {
    const matchesSearch = Object.values(bet).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesDate =
      !startDate ||
      new Date(bet.date).toDateString() === startDate.toDateString();
    return matchesSearch && matchesDate;
  });

  // Sort gamebets
  const sortedBets = [...filteredBets].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (fieldA < fieldB) {
      return sortDirection === "desc" ? -1 : 1;
    }
    if (fieldA > fieldB) {
      return sortDirection === "desc" ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedBets.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedBets = sortedBets.slice(startIndex, startIndex + rowsPerPage);

  // Handle sort toggle
  const handleSort = (field: keyof any) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // CSV headers for export
  const csvHeaders = [
    { label: "Created Date", key: "created_date" },
    { label: "Created Time", key: "created_time" },
    { label: "Game Name", key: "game_name" },
    { label: "Game Type", key: "game_type_name" },
    { label: "Draw Date", key: "draw_date" },
    { label: "Draw Time", key: "draw_time" },
    { label: "User Mobile", key: "user_mobile" },
    { label: "Bets", key: "bets" },
    { label: "Bet Amount", key: "bet" },
    { label: "Reward", key: "jackpot" },
    { label: "Agent Name", key: "bakas_fullname" },
    { label: "Agent Bank", key: "bakas_bank" },
    { label: "Agent Account", key: "bakas_account" },
    { label: "Status", key: "status" },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Button
            onClick={() => navigate(-1)} // Navigate to the previous route
            className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
        >
            <ArrowBigLeft className="mr-2" /> {/* Arrow icon */}
            Back
        </Button>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Combination Limits for {gamesInfo[0].name} game</h2>
        <Button onClick={() => setshowGameDialog(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Combination
        </Button>
      </div>

      {/* Export Button */}
      <div className="flex justify-end mb-4">
      <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-[300px] mr-4"
        />
              {/* <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                placeholderText="Filter by Date"
                className="border p-2 rounded-md mr-4"
              /> */}
        <CSVLink
          data={filteredBets}
          headers={csvHeaders}
          filename="pisoplays_players_bets.csv"
          className="btn btn-primary px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Export to CSV
        </CSVLink>
      </div>

      <div className="overflow-x-auto">
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">
                    <div
                      className="flex items-center justify-center cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      Date
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                    </TableHead>
                    <TableHead className="text-center">
                    <div
                      className="flex items-center justify-center cursor-pointer"
                      onClick={() => handleSort("time")}
                    >
                      Time
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div
                      className="flex items-center justify-center cursor-pointer"
                      onClick={() => handleSort("combination")}
                    >
                      Combination
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div
                      className="flex items-center justify-center cursor-pointer"
                      onClick={() => handleSort("combination_limit")}
                    >
                      Limit
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div
                      className="flex items-center justify-center cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      Status
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    
                      Update
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBets.map((product) => (
                  <TableRow
                    key={product.id}
                    
                  >
                    <TableCell className="text-center">{product.date}</TableCell>
                    <TableCell className="text-center">{product.time}</TableCell>
                    <TableCell className="text-center">{product.combination}</TableCell>
                    <TableCell className="text-center">{product.combination_limit}</TableCell>
                    <TableCell className="text-center">{product.status}</TableCell>
                    <TableCell className="text-center">
                                    
                      <Button
                        className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                        onClick={() => handleEditClick(product)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedBets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No Combinations found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + rowsPerPage, sortedBets.length)} of{" "}
          {sortedBets.length} bets
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>








 {/* Edit Game Dialog */}
 {isModalOpen && (
  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
    <DialogContent className="bg-gray-50 border-[#34495e] max-h-[90vh] w-96 overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl text-blue-600">Update Game Bets</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
      <form onSubmit={handleSave}>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Combination
          <Input
            type="text"
            name="combination"
            value={selectedGameBet.combination || ""}
            onChange={handleChange}
            required
            className="border p-1 mt-2 w-full"
            placeholder="Enter Combination"
          />
        </label>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Combination Limit
          <Input
            type="number"
            name="combination_limit"
            value={selectedGameBet?.combination_limit || ""}
            onChange={handleChange}
            required
            className="border p-1 mt-2 w-full"
            placeholder="Enter Limit"
          />
        </label>



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
      Set Status
    </option>
    <option value="enabled">Enabled</option>
    <option value="disabled">Disabled</option>
  </select>
</div>

        <br/>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          {!updating ? (<Button
            variant="outline" 
            className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
            type='submit'
          >
            Update
          </Button>) : (<>Updating....</>)}
          <Button
            variant="outline" 
            className="w-full sm:w-auto border-red-500 text-red-600 hover:bg-red-900/20"
            onClick={() => setIsModalOpen(false)}
            type='button'
          >
            Cancel
          </Button>
        </DialogFooter>
        </form>
      </div>
    </DialogContent>
  </Dialog>
)}








        {/* Add Game Dialog */}
                <Dialog open={showGameDialog} onOpenChange={setshowGameDialog}>
                  <DialogContent className="bg-gray-50 border-[#34495e] max-h-[90vh] w-96 overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl text-blue-600">Add Combination</DialogTitle>
        
                    </DialogHeader>
                    <form onSubmit={handleAddData}>
                      <div className="space-y-3">
                      
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Combination</label>
                          <Input 
                          name='combination'
                          value={combinationAdd || ""}
                          onChange={(e) => setCombinationAdd(e.target.value)}
                          type="text" 
                          required
                          placeholder="e.g 1-2-3" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Set limit</label>
                          <Input 
                          name='combination_limit' 
                          type="number" 
                          value={combinationLimitAdd || ""}
                          onChange={(e) => setCombinationLimitAdd(e.target.value)}
                          required
                          placeholder="Enter limit"  />
                        </div>
                        
                      </div>
        
                        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                          <Button 
                            variant="outline" 
                            type='submit'
                            className="w-full sm:w-auto bg-green-500 border-green-500 text-black-600 hover:bg-green-500/20 hover:text-green-700"
                          >
                            Add
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setshowGameDialog(false)}
                            className="w-full sm:w-auto border-red-500 text-red-600 hover:bg-red-900/20"
                          >
                            Cancel
                          </Button>
                        </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
      </div>
    </div>
  );
}