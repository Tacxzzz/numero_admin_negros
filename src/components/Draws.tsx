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
import { useAuth0 } from '@auth0/auth0-react';
import { loginAdmin,getGames, updateGame, getGamesTypes, updateGameType } from './api/apiCalls';
import { formatPeso } from './utils/utils';

export function Draws() {

  const { user,getAccessTokenSilently , logout} = useAuth0();
  const [showGameDialog, setshowGameDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userID, setUserID] = useState("none");
  const [dbUpdated, setDbUpdated] = useState(false);
  const [draws, setDraws] = useState<any[]>([]);
  const [filteredDraws, setFilteredDraws] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortedDraws, setSortedDraws] = useState<any[]>([]);
  const [permissionsString, setPermissionsString] = useState([]);


  useEffect(() => {
        if (user && !dbUpdated) {
          const handleUpdate = async () => {
            const dataUpdated= await loginAdmin(user,getAccessTokenSilently);
            if(dataUpdated.dbUpdate)
            {
              setDbUpdated(dataUpdated.dbUpdate);
              setUserID(dataUpdated.userID);
              setPermissionsString(JSON.parse(dataUpdated.permissions));
              setLoading(false);
              
              const data = await getDraws();
              setDraws(data);
              setFilteredDraws(data);
              setSortedDraws(data); // Initialize sorted data
              
            }
            else
            {
              alert("UNAUTHORIZED USER!");
              logout({ logoutParams: { returnTo: window.location.origin } });
            }
            
          };
          handleUpdate();
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [user]);
    
      

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

    setFilteredDraws(filtered);
  }, [searchQuery, selectedDate, draws]);

  useEffect(() => {
    // Sort the filtered draws by date
    const sorted = [...filteredDraws].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setSortedDraws(sorted);
  }, [sortOrder, filteredDraws]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  if (loading ) {
    return <div>...</div>;
  }

  if(!permissionsString.includes("draws"))
  {
    return <div>Not allowed to manage this page</div>
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
        <DatePicker
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
                  <TableHead className="text-center">Time</TableHead>
                  <TableHead className="text-center">Game</TableHead>
                  <TableHead className="text-center">Result</TableHead>
                  <TableHead className="text-center">Current Ceiling</TableHead>
                  <TableHead className="text-center">Current number of bets</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedDraws.map((draw) => (
                  <TableRow key={draw.id}>
                    <TableCell className="text-center">{draw.date}</TableCell>
                    <TableCell className="text-center">{draw.time}</TableCell>
                    <TableCell className="text-center">{draw.game_name}</TableCell>
                    <TableCell className="text-center">{draw.results}</TableCell>
                    <TableCell className="text-center">{draw.ceiling}</TableCell>
                    <TableCell className="text-center">{draw.total_bets}</TableCell>
                    <TableCell className="text-center">{draw.status}</TableCell>
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