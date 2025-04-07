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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { loginAdmin, getPlayersAgents, updatePlayer } from './api/apiCalls';
import { formatPeso } from './utils/utils';

export function Agents() {
  const navigate = useNavigate();
  const { user, getAccessTokenSilently, logout } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [dbUpdated, setDbUpdated] = useState(false);
  const [gamebets, setGamebets] = useState<any[]>([]);
  const [filteredGamebets, setFilteredGamebets] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGameBet, setSelectedGameBet] = useState(null);

  useEffect(() => {
    if (user && !dbUpdated) {
      const handleUpdate = async () => {
        const dataUpdated = await loginAdmin(user, getAccessTokenSilently);
        if (dataUpdated.dbUpdate) {
          setDbUpdated(dataUpdated.dbUpdate);
          setLoading(false);
          const gamesData = await getPlayersAgents();
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
    let filtered = gamebets;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((bet) =>
        bet.mobile.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by date
    if (startDate) {
      filtered = filtered.filter((bet) => {
        const betDate = new Date(bet.created);
        return betDate.toDateString() === startDate.toDateString();
      });
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.created).getTime();
      const dateB = new Date(b.created).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredGamebets(filtered);
  }, [searchQuery, startDate, sortOrder, gamebets]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleEditClick = (game) => {
    setSelectedGameBet(game);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append('userID', selectedGameBet.id);
    formData.append('status', selectedGameBet.status);
    formData.append('agent', selectedGameBet.agent);

    const isAuthenticated = await updatePlayer(formData);
    if (!isAuthenticated) {
      alert("An error occurred!");
      setUpdating(false);
      setIsModalOpen(false);
    } else {
      setUpdating(false);
      setIsModalOpen(false);
      alert("Player updated successfully.");
      const gamesData = await getPlayersAgents();
      setGamebets(gamesData);
      setFilteredGamebets(gamesData);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">List of Agents</h2>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Input
          type="text"
          placeholder="Search by Users Mobile Number"
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
          onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
          className="text-white px-4 py-2 rounded-md"
        >
          Sort by Date ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Card className="lg:col-span-7">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Users Mobile #</TableHead>
                  <TableHead className="text-center">Created</TableHead>
                  <TableHead className="text-center">Modified</TableHead>
                  <TableHead className="text-center">Account Balance</TableHead>
                  <TableHead className="text-center">Wins</TableHead>
                  <TableHead className="text-center">Commissions</TableHead>
                  <TableHead className="text-center">Referred By</TableHead>
                  <TableHead className="text-center"># of Referrals</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">is Agent</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGamebets.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="text-center">{product.mobile}</TableCell>
                    <TableCell className="text-center">{product.created}</TableCell>
                    <TableCell className="text-center">{product.modified}</TableCell>
                    <TableCell className="text-center">{formatPeso(product.balance)}</TableCell>
                    <TableCell className="text-center">{formatPeso(product.wins)}</TableCell>
                    <TableCell className="text-center">{formatPeso(product.commissions)}</TableCell>
                    <TableCell className="text-center">{product.referrer_mobile}</TableCell>
                    <TableCell className="text-center">{product.referral_count}</TableCell>
                    <TableCell className="text-center">{product.status === "pending" ? "Active" : "Inactive"}</TableCell>
                    <TableCell className="text-center">{product.agent === "yes" ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700 mr-2 mb-2"
                        onClick={() => handleEditClick(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                        onClick={() => navigate(`/hierarchy?user_mobile=${product.mobile}&user_id=${product.id}`)}
                      >
                        Referrals
                      </Button>
                    </TableCell>
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