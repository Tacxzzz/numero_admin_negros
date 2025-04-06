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
import { Card, CardContent } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { useAuth0 } from '@auth0/auth0-react';
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import { loginAdmin, getDraws } from './api/apiCalls';
import { formatPeso } from './utils/utils';

export function Draws() {
  const { user, getAccessTokenSilently, logout } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [dbUpdated, setDbUpdated] = useState(false);
  const [gamebets, setGamebets] = useState<any[]>([]);
  const [filteredGamebets, setFilteredGamebets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAscending, setIsAscending] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // State for selected date

  useEffect(() => {
    if (user && !dbUpdated) {
      const handleUpdate = async () => {
        const dataUpdated = await loginAdmin(user, getAccessTokenSilently);
        if (dataUpdated.dbUpdate) {
          setDbUpdated(dataUpdated.dbUpdate);
          setLoading(false);

          const gamesData = await getDraws();
          setGamebets(gamesData);
          setFilteredGamebets(gamesData);
        } else {
          alert("UNAUTHORIZED USER!");
          logout({ logoutParams: { returnTo: window.location.origin } });
        }
      };
      handleUpdate();
    }
  }, [user]);

  useEffect(() => {
    const filtered = gamebets.filter((game) =>
      game.game_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGamebets(filtered);
  }, [searchTerm, gamebets]);

  useEffect(() => {
    if (selectedDate) {
      const filteredByDate = gamebets.filter((game) =>
        new Date(game.date).toDateString() === selectedDate.toDateString()
      );
      setFilteredGamebets(filteredByDate);
    } else {
      setFilteredGamebets(gamebets);
    }
  }, [selectedDate, gamebets]);

  const handleSortToggle = () => {
    const sorted = [...filteredGamebets].sort((a, b) => {
      if (isAscending) {
        return a.game_name.localeCompare(b.game_name);
      } else {
        return b.game_name.localeCompare(a.game_name);
      }
    });
    setFilteredGamebets(sorted);
    setIsAscending(!isAscending);
  };

  if (loading) {
    return <div>...</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">Draws</h2>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by game name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2"
          />
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            placeholderText="Select a date"
            className="border p-2 rounded"
          />
          <Button
            onClick={handleSortToggle}
            className="border p-2 rounded"
          >
            {isAscending ? "Sort Descending" : "Sort Ascending"}
          </Button>
        </div>
      </div>

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
                {filteredGamebets.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="text-center">{product.date}</TableCell>
                    <TableCell className="text-center">{product.time}</TableCell>
                    <TableCell className="text-center">{product.game_name}</TableCell>
                    <TableCell className="text-center">{product.results}</TableCell>
                    <TableCell className="text-center">{formatPeso(product.ceiling)}</TableCell>
                    <TableCell className="text-center">{product.total_bets}</TableCell>
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