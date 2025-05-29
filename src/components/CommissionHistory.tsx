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
import { useAuth0 } from '@auth0/auth0-react';
import { loginAdmin, getCommission } from './api/apiCalls';
import { formatPeso, getTransCode } from './utils/utils';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function CommissionHistory() {
  const { user, getAccessTokenSilently, logout } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [dbUpdated, setDbUpdated] = useState(false);
  const [gamebets, setGamebets] = useState<any[]>([]);
  const [filteredGamebets, setFilteredGamebets] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [permissionsString, setPermissionsString] = useState([]);

  useEffect(() => {
    if (user && !dbUpdated) {
      const handleUpdate = async () => {
        const dataUpdated = await loginAdmin(user, getAccessTokenSilently);
        if (dataUpdated.dbUpdate) {
          setDbUpdated(dataUpdated.dbUpdate);
          setPermissionsString(JSON.parse(dataUpdated.permissions));
          setLoading(false);
          const gamesData = await getCommission();
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
    let filtered = [...gamebets]; // Create a copy of the original array

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((bet) =>
        bet.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bet.referrer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by date
    if (startDate) {
      filtered = filtered.filter((bet) => {
        const betDate = new Date(bet.date);
        return betDate.toDateString() === startDate.toDateString();
      });
    }

    // Sort by date
    filtered.sort((a, b) => {
        const dateTimeA = new Date(`${a.date} ${a.time}`).getTime();
        const dateTimeB = new Date(`${b.date} ${b.time}`).getTime();
        return sortOrder === "asc" ? dateTimeA - dateTimeB : dateTimeB - dateTimeA;
    });

    setFilteredGamebets(filtered);
  }, [searchQuery, startDate, sortOrder, gamebets]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if(!permissionsString.includes("cashin"))
  {
    return <div>Not allowed to manage this page</div>
  }

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">Commission History</h2>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Input
          type="text"
          placeholder="Search by User"
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
                <TableHead className="text-center">User</TableHead>
                  <TableHead className="text-center">Amount</TableHead>
                  <TableHead className="text-center">Referral</TableHead>
                  <TableHead className="text-center">Date Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGamebets.map((product) => (
                  <TableRow key={product.id}>
                    
                    <TableCell className="text-center">{product.user}</TableCell>
                    <TableCell className="text-center">{formatPeso(product.amount)}</TableCell>
                    <TableCell className="text-center">{product.referral}</TableCell>
                    <TableCell className="text-center">{product.date} {product.time}</TableCell>
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