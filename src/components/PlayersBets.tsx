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
import { loginAdmin, getBetsHistory } from './api/apiCalls';
import { formatPeso } from './utils/utils';

export function PlayersBets() {
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

  useEffect(() => {
    if (user && !dbUpdated) {
      const handleUpdate = async () => {
        const dataUpdated = await loginAdmin(user, getAccessTokenSilently);
        if (dataUpdated.dbUpdate) {
          setDbUpdated(dataUpdated.dbUpdate);
          setPermissionsString(JSON.parse(dataUpdated.permissions));
          setLoading(false);
          const gamesData = await getBetsHistory();
          setGamebets(gamesData);
          setFilteredGamebets(gamesData);
          setSortedGamebets(gamesData); // Initialize sorted data
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
      const lowerSearch = searchQuery.toLowerCase();
      filtered = filtered.filter((bet) => {
        return (
          bet.game_name.toLowerCase().includes(lowerSearch) ||
          bet.status.toLowerCase().includes(lowerSearch) ||
          String(bet.bets).toLowerCase().includes(lowerSearch) || // in case bets is a number
          bet.draw_time.toLowerCase().includes(lowerSearch) ||
          bet.draw_date.toLowerCase().includes(lowerSearch)
        );
      });
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if(!permissionsString.includes("bets"))
  {
    return <div>Not allowed to manage this page</div>
  }

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">Bets History</h2>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Input
          type="text"
          placeholder="Search by Game, Status, Draw Time e.g 09:00:00 pm, combination "
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
                  <TableHead className="text-center">Combination</TableHead>
                  <TableHead className="text-center">Bet</TableHead>
                  <TableHead className="text-center">Reward</TableHead>
                  <TableHead className="text-center">If Player from agent</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedGamebets.map((product) => (
                  <TableRow
                  key={product.id}
                  className={
                    product.status === "win"
                      ? "bg-green-200"
                      : product.status === "loss"
                      ? "bg-red-200"
                      : product.status === "pending"
                      ? "bg-yellow-100"
                      : ""
                  }
                >
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
                  <TableCell className="text-center">{formatPeso(product.bet)}</TableCell>
                  <TableCell className="text-center">{formatPeso(product.jackpot)}</TableCell>
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