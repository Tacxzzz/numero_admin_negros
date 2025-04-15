import { useState, useEffect } from "react";
import { loginAdmin, getClients, updateClient } from "./api/apiCalls";
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
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth0 } from '@auth0/auth0-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";

interface Client {
  id: string;
  user_mobile: string;
  date: string;
  time: string;
  full_name: string;
  bank: string;
  account: string;
  status: string;
}

export function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof Client>("full_name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGameBet, setSelectedGameBet] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [gamebets, setGamebets] = useState<any[]>([]);
  const [filteredGamebets, setFilteredGamebets] = useState<any[]>([]);
  const [permissionsString, setPermissionsString] = useState([]);
  const { user, getAccessTokenSilently, logout } = useAuth0();
  const [dbUpdated, setDbUpdated] = useState(false);
  const [userID, setUserID] = useState("none");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const rowsPerPage = 10;

  useEffect(() => {
    if (user && !dbUpdated) {
      const handleUpdate = async () => {
        setLoading(true); // Start loading
        try {
          const dataUpdated = await loginAdmin(user, getAccessTokenSilently);
          console.log("loginAdmin response:", dataUpdated); // Debug loginAdmin response
          if (dataUpdated.dbUpdate) {
            setDbUpdated(dataUpdated.dbUpdate);
            setUserID(dataUpdated.userID);
            setPermissionsString(JSON.parse(dataUpdated.permissions));
  
            const gamesData = await getClients();
            console.log("getClients response:", gamesData); // Debug getClients response
            setClients(gamesData); // Update clients state
            setGamebets(gamesData);
            setFilteredGamebets(gamesData);
          } else {
            alert("UNAUTHORIZED USER!");
            logout({ logoutParams: { returnTo: window.location.origin } });
          }
        } catch (error) {
          console.error("Error in handleUpdate:", error); // Log errors
        } finally {
          setLoading(false); // Stop loading
        }
      };
      handleUpdate();
    }
  }, [user, dbUpdated, getAccessTokenSilently, logout]);

  const handleEditClick = (game) => {
    setSelectedGameBet({ ...game });
    setIsModalOpen(true);
  };

  // Filter clients based on search query
  const filteredClients = clients.filter((client) => {
    return (
      client.user_mobile.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
    // CSV headers for export
  const csvHeaders = [
    { label: "Agent", key: "user_mobile" },
    { label: "Date", key: "date" },
    { label: "Time", key: "time" },
    { label: "Full Name", key: "full_name" },
    { label: "Bank", key: "bank" },
    { label: "Account", key: "account" },
    { label: "Status", key: "status" },
  ];

  const filteredData = filteredGamebets.filter((draw) => {
    const matchesSearch = Object.values(draw).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesDate =
      !startDate ||
      new Date(draw.date).toDateString() === startDate.toDateString();
    return matchesSearch && matchesDate;
  });

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (fieldA < fieldB) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (fieldA > fieldB) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedClients.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedClients = sortedClients.slice(startIndex, startIndex + rowsPerPage);

  // Handle sort toggle
  const handleSort = (field: keyof Client) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
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

      //important
      const gamesData = await getClients();
      setClients(gamesData);
      setGamebets(gamesData);
      setFilteredGamebets(gamesData);
      setUpdating(false);
      alert("Player updated successfully.");
    }
    setLoading(false);
  };

  if(!permissionsString.includes("clients"))
  {
    return <div>Not allowed to manage this page</div>
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">List of Non-Registered Users from Agents</h2>
        

      </div> */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl md:text-1xl font-bold">List of Non-Registered Users from Agents</h2>
      </div>
      <div className="flex justify-end items-center mb-4">
        
        {/* <DatePicker
        selected={startDate}
        onChange={(date: Date | null) => setStartDate(date)}
        placeholderText="Filter by Date"
        className="border p-2 rounded-md mr-4"
        /> */}
              <Input
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-[300px] mr-4"
      />
        <CSVLink
          data={filteredGamebets}
          headers={csvHeaders}
          filename="pisoplays_clients.csv"
          className="btn btn-primary px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Export to CSV
        </CSVLink>
      </div>
      <div className="flex items-center justify-end mb-4">
      {/* <Input
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-[300px] mr-4"
      /> */}
      </div>
      

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">
                      <div
                        className="flex items-center justify-center cursor-pointer"
                        onClick={() => handleSort("user_mobile")}
                      >
                        Agent
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div
                        className="flex items-center justify-center cursor-pointer"
                        onClick={() => handleSort("date")}
                      >
                        Added
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div
                        className="flex items-center justify-center cursor-pointer"
                        onClick={() => handleSort("full_name")}
                      >
                        Full Name
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div
                        className="flex items-center justify-center cursor-pointer"
                        onClick={() => handleSort("bank")}
                      >
                        Bank
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
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedClients.map((client) => (
                    <TableRow key={client.id}
                    className={`${
                      client.status === "enabled"
                        ? "bg-green-200"
                        : client.status === "disabled"
                        ? "bg-red-200"
                        : ""
                    } hover:font-semibold`}
                  >
                    
                      <TableCell className="items-center text-center">{client.user_mobile}</TableCell>
                      <TableCell className="items-center text-center">
                        {client.date} {client.time}
                      </TableCell>
                      <TableCell className="items-center text-center">{client.full_name}</TableCell>
                      <TableCell className="items-center text-center">
                        {client.bank} - {client.account}
                      </TableCell>
                      <TableCell className="items-center text-center">{client.status}</TableCell>
                      
                      <TableCell className="text-center">

                      <Button
                        className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700 mr-2 mb-2"
                        onClick={() => handleEditClick(client)}
                      >
                        Edit
                      </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedClients.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No clients found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + rowsPerPage, sortedClients.length)} of{" "}
          {sortedClients.length} clients
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
                    value={selectedGameBet?.status || ""}
                    onChange={(e) => setSelectedGameBet((prev) => ({ ...prev, status: e.target.value }))}
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