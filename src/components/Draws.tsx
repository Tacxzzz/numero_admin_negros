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
import { getDraws } from "./api/apiCalls";
import { formatPeso, getTransCode } from './utils/utils';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";

export function Draws() {
  const [loading, setLoading] = useState(true);
  const [draws, setDraws] = useState<any[]>([]);
  const [filteredDraws, setFilteredDraws] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [sortField, setSortField] = useState<keyof any>("game_name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        const data = await getDraws();
        setDraws(data);
        setFilteredDraws(data);
      } catch (error) {
        console.error("Error fetching draws:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDraws();
  }, []);

  // Filter draws based on search query and selected date
  const filteredData = filteredDraws.filter((draw) => {
    const matchesSearch = Object.values(draw).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesDate =
      !startDate ||
      new Date(draw.date).toDateString() === startDate.toDateString();
    return matchesSearch && matchesDate;
  });

  // Sort draws
  const sortedData = [...filteredData].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">Draws</h2>
      </div>
      {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Input
                type="text"
                placeholder="Search..."
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
              <CSVLink
                data={filteredDraws}
                headers={csvHeaders}
                filename="pisoplays_draws.csv"
                className="btn btn-primary px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                Export to CSV
              </CSVLink>
            </div>

      

      {/* Table */}
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
                      onClick={() => handleSort("id")}
                    >
                      Draw ID
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div
                      className="flex items-center justify-center cursor-pointer"
                      onClick={() => handleSort("game_name")}
                    >
                      Games
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div
                      className="flex items-center justify-center cursor-pointer"
                      onClick={() => handleSort("results")}
                    >
                      Result
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div
                      className="flex items-center justify-center cursor-pointer"
                      onClick={() => handleSort("ceiling")}
                    >
                      Current Ceiling
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div
                      className="flex items-center justify-center cursor-pointer"
                      onClick={() => handleSort("total_bets")}
                    >
                      Current number of bets
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((draw) => (
                  <TableRow key={draw.id}
                  className={`${
                    draw.status === "done"
                      ? "bg-green-200"
                      : draw.status === "pending"
                      ? "bg-orange-200"
                      : ""
                  } hover:font-semibold`}
                >
                    <TableCell className="text-center">{draw.date}</TableCell>
                    <TableCell className="text-center">{draw.time}</TableCell>
                    <TableCell className="text-center">DRAW{getTransCode(draw.date + ' ' + draw.time)}-{draw.id}</TableCell>
                    <TableCell className="text-center">{draw.game_name}</TableCell>
                    <TableCell className="text-center">{draw.results}</TableCell>
                    <TableCell className="text-center">{draw.ceiling}</TableCell>
                    <TableCell className="text-center">{draw.total_bets}</TableCell>
                    <TableCell className="text-center">{draw.status}</TableCell>
                  </TableRow>
                ))}
                {paginatedData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No draws found
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
          {Math.min(startIndex + rowsPerPage, sortedData.length)} of{" "}
          {sortedData.length} draws
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