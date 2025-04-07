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
import { loginAdmin, getBetsHistoryWinners } from './api/apiCalls';

export function WinnerBets() {
  const { user, getAccessTokenSilently, logout } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [dbUpdated, setDbUpdated] = useState(false);
  const [gamebets, setGamebets] = useState<any[]>([]);
  const [filteredGamebets, setFilteredGamebets] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [startDate, setStartDate] = useState<Date | null>(null);

  useEffect(() => {
    if (user && !dbUpdated) {
      const handleUpdate = async () => {
        const dataUpdated = await loginAdmin(user, getAccessTokenSilently);
        if (dataUpdated.dbUpdate) {
          setDbUpdated(dataUpdated.dbUpdate);
          setLoading(false);
          const gamesData = await getBetsHistoryWinners();
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
    let filtered = [...gamebets];

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

  const sortedGamebets = [...filteredGamebets].sort((a, b) => {
    const dateA = new Date(a.created_date).getTime();
    const dateB = new Date(b.created_date).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">Winners History</h2>
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
                  <TableHead className="text-center">Game</TableHead>
                  <TableHead className="text-center">Player</TableHead>
                  <TableHead className="text-center">Bet</TableHead>
                  <TableHead className="text-center">If Player from agent</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedGamebets.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="text-center">
                      {product.created_date}
                      <br />
                      {product.created_time}
                    </TableCell>
                    <TableCell className="text-center">
                      {product.game_name}
                      <br />
                      {product.game_type_name}
                      <br />
                      {product.draw_date} {product.draw_time}
                    </TableCell>
                    <TableCell className="text-center">{product.user_mobile}</TableCell>
                    <TableCell className="text-center">{product.bets}</TableCell>
                    <TableCell className="text-center">
                      {product.bakas_fullname}
                      <br />
                      {product.bakas_bank}
                      <br />
                      {product.bakas_account}
                    </TableCell>
                    <TableCell className="text-center">{product.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}