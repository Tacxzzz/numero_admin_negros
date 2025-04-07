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
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getDraws } from "./api/apiCalls";

export function DrawsResults() {
  const [draws, setDraws] = useState<any[]>([]);
  const [filteredDraws, setFilteredDraws] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDrawId, setSelectedDrawId] = useState<number | null>(null);
  const [updatedResult, setUpdatedResult] = useState("");

  useEffect(() => {
    const fetchDraws = async () => {
      const data = await getDraws();
      setDraws(data);
      setFilteredDraws(data);
    };
    fetchDraws();
  }, []);

  useEffect(() => {
    let filtered = draws;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((draw) =>
        draw.game_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter((draw) => {
        const drawDate = new Date(draw.date);
        return drawDate.toDateString() === selectedDate.toDateString();
      });
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredDraws(filtered);
  }, [searchQuery, selectedDate, sortOrder, draws]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const openModal = (drawId: number) => {
    setSelectedDrawId(drawId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDrawId(null);
    setUpdatedResult("");
  };

  const updateResult = () => {
    if (selectedDrawId !== null) {
      setDraws((prevDraws) =>
        prevDraws.map((draw) =>
          draw.id === selectedDrawId ? { ...draw, results: updatedResult } : draw
        )
      );
      setFilteredDraws((prevFilteredDraws) =>
        prevFilteredDraws.map((draw) =>
          draw.id === selectedDrawId ? { ...draw, results: updatedResult } : draw
        )
      );
      closeModal();
    }
  };

  if (!draws.length) {
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
          placeholder="Search by Game Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/3"
        />
        {/* <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => setSelectedDate(date)}
          placeholderText="Filter by Date"
          className="border p-2 rounded-md"
        />
        <Button
          onClick={toggleSortOrder}
          className="text-white px-4 py-2 rounded-md"
        >
          Sort by Date ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </Button> */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Card className="lg:col-span-7">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Time</TableHead>
                  <TableHead className="text-center">Game</TableHead>
                  <TableHead className="text-center">Result</TableHead>
                  <TableHead className="text-center">Prize Pool</TableHead>
                  {/* <TableHead className="text-center">Current number of bets</TableHead> */}
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDraws.map((draw) => (
                  <TableRow key={draw.id}>
                    <TableCell className="text-center">{draw.date}</TableCell>
                    <TableCell className="text-center">{draw.time}</TableCell>
                    <TableCell className="text-center">{draw.game_name}</TableCell>
                    <TableCell className="text-center">{draw.results}</TableCell>
                    <TableCell className="text-center">₱{draw.ceiling}</TableCell>
                    {/* <TableCell className="text-center">{draw.total_bets}</TableCell> */}
                    <TableCell className="text-center">{draw.status}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        onClick={() => openModal(draw.id)}
                        className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700 mr-2 mb-2"
                      >
                        Update Winning Result
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md space-y-4">
            <h3 className="text-xl font-bold">Enter the Winning Results</h3>
            <Input
              type="text"
              placeholder="Enter Winning result"
              value={updatedResult}
              onChange={(e) => setUpdatedResult(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-end gap-2">
              <Button onClick={updateResult} className="text-white bg-blue-500 px-4 py-2 rounded-md">
                Save
              </Button>
              {/* <Button onClick={closeModal} className="w-full sm:w-auto border-red-500 text-red-600 hover:bg-red-900/20">
                Cancel
              </Button> */}

          <Button
            variant="outline" 
            className="w-full sm:w-auto border-red-500 text-red-600 hover:bg-red-900/20"
            onClick={closeModal}
            type='button'
          >
            Cancel
          </Button>
            </div>



          </div>
        </div>
      )}
    </div>
  );
}