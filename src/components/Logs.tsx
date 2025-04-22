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
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { loginAdmin, getBetsHistory, getLogs } from "./api/apiCalls";
import { formatPeso } from "./utils/utils";
import { CSVLink } from "react-csv"; // Import CSVLink for exporting data
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function Logs() {
  const { user, getAccessTokenSilently, logout } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [dbUpdated, setDbUpdated] = useState(false);
  const [gamebets, setGamebets] = useState<any[]>([]);
  const [filteredGamebets, setFilteredGamebets] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof any>("game_name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const rowsPerPage = 10;

  useEffect(() => {
    if (user && !dbUpdated) {
      const handleUpdate = async () => {
        try {
          const dataUpdated = await loginAdmin(user, getAccessTokenSilently);
          if (dataUpdated.dbUpdate) {
            setDbUpdated(dataUpdated.dbUpdate);
            const gamesData = await getLogs();
            setGamebets(gamesData);
            setFilteredGamebets(gamesData);
          } else {
            alert("UNAUTHORIZED USER!");
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
      return sortDirection === "asc" ? -1 : 1;
    }
    if (fieldA > fieldB) {
      return sortDirection === "asc" ? 1 : -1;
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Logs</h2>
        
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
                      onClick={() => handleSort("created_time")}
                    >
                      Logs
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBets.map((product) => (
                  <TableRow
                    key={product.id}
                    
                  >
                    
                    <TableCell className="text-center">{product.activity}</TableCell>
                  </TableRow>
                ))}
                {paginatedBets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No logs found
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
      </div>
    </div>
  );
}