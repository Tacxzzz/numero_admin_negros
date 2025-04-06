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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth0 } from '@auth0/auth0-react';
import { loginAdmin, getGames, updateGame, getGamesTypes, updateGameType } from './api/apiCalls';
import { formatPeso } from './utils/utils';

export function GamesTypes() {
  const { user, getAccessTokenSilently, logout } = useAuth0();
  const [showGameDialog, setshowGameDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userID, setUserID] = useState("none");
  const [dbUpdated, setDbUpdated] = useState(false);
  const [gamebets, setGamebets] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // Added search query state
  const [statusFilter, setStatusFilter] = useState("enabled"); // Added status filter state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGameBet, setSelectedGameBet] = useState(null);
  const API_URL = import.meta.env.VITE_DATABASE_URL;
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (user && !dbUpdated) {
      const handleUpdate = async () => {
        const dataUpdated = await loginAdmin(user, getAccessTokenSilently);
        if (dataUpdated.dbUpdate) {
          setDbUpdated(dataUpdated.dbUpdate);
          setUserID(dataUpdated.userID);
          setLoading(false);

          const gamesData = await getGamesTypes();
          setGamebets(gamesData);
        } else {
          alert("UNAUTHORIZED USER!");
          logout({ logoutParams: { returnTo: window.location.origin } });
        }
      };
      handleUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) {
    return <div>...</div>;
  }

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleEditClick = (game) => {
    setImagePreview(null);
    setSelectedGameBet(game);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append('userID', selectedGameBet.id);
    formData.append('game_type', selectedGameBet.game_type);
    formData.append('bet', selectedGameBet.bet);
    formData.append('jackpot', selectedGameBet.jackpot);
    formData.append('status', selectedGameBet.status);

    setLoading(true);
    const isAuthenticated = await updateGameType(formData);
    if (!isAuthenticated) {
      alert("an error occurred!");
      setUpdating(false);
      setIsModalOpen(false);
      setLoading(false);
    } else {
      setUpdating(false);
      setIsModalOpen(false);
      setLoading(false);
      alert("game type updated successfully.");
      const gamesData = await getGamesTypes();
      setGamebets(gamesData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedGameBet((prev) => ({ ...prev, [name]: value }));
  };

  const handleGameDialog = () => {
    setshowGameDialog(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedGameBet) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setSelectedGameBet((prev) => ({
        ...prev!,
        picture: file,
      }));
    }
  };

  // Filter games based on search query and status filter
  const filteredGames = gamebets.filter(
    (game) =>
      game.game_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      game.status === statusFilter
  ).sort((a, b) => {
    if (sortOrder === "asc") {
      return a.game_name.localeCompare(b.game_name);
    } else {
      return b.game_name.localeCompare(a.game_name);
    }
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">Game Types</h2>
        <div className="flex items-center gap-2">
          {/* Search Box */}
          <Input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          />
          <Button
            className="border p-2 rounded"
            onClick={toggleSortOrder}
          >
            {sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Card className="lg:col-span-7">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Game Name</TableHead>
                  <TableHead className="text-center">Game Type</TableHead>
                  <TableHead className="text-center">Bet</TableHead>
                  <TableHead className="text-center">Jackpot</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGames.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="text-center">{product.game_name}</TableCell>
                    <TableCell className="text-center">{product.game_type}</TableCell>
                    <TableCell className="text-center">{formatPeso(product.bet)}</TableCell>
                    <TableCell className="text-center">{formatPeso(product.jackpot)}</TableCell>
                    <TableCell className="text-center">{product.status}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                        onClick={() => handleEditClick(product)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Game Dialog */}
        {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="bg-gray-50 border-[#34495e] max-h-[90vh] w-96 overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl text-blue-600">Update Game Type</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <form onSubmit={handleSave}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Game Name : {selectedGameBet.game_name}
                  </label>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Game Type Title
                    <Input
                      type="text"
                      name="game_type"
                      value={selectedGameBet.game_type || ""}
                      onChange={handleChange}
                      className="border p-1 mt-2 w-full"
                      placeholder="Enter Game Type Title"
                    />
                  </label>
                  {/* Other form fields */}
                  <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                    {!updating ? (
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                        type="submit"
                      >
                        Update
                      </Button>
                    ) : (
                      <>Updating....</>
                    )}
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-red-500 text-red-600 hover:bg-red-900/20"
                      onClick={() => setIsModalOpen(false)}
                      type="button"
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
    </div>
  );
}