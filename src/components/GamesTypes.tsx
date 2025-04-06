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
import { loginAdmin,getGames, updateGame, getGamesTypes, updateGameType } from './api/apiCalls';
import { formatPeso } from './utils/utils';


export function GamesTypes() {

  const { user,getAccessTokenSilently , logout} = useAuth0();
  const [showGameDialog, setshowGameDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userID, setUserID] = useState("none");
  const [dbUpdated, setDbUpdated] = useState(false);
  const [gamebets, setGamebets] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGameBet, setSelectedGameBet] = useState(null);
  const API_URL = import.meta.env.VITE_DATABASE_URL;
  const [imagePreview, setImagePreview] = useState<string | null>(null);
const [selectedFile, setSelectedFile] = useState<File | null>(null);


  useEffect(() => {
      if (user && !dbUpdated) {
        const handleUpdate = async () => {
          const dataUpdated= await loginAdmin(user,getAccessTokenSilently);
          if(dataUpdated.dbUpdate)
          {
            setDbUpdated(dataUpdated.dbUpdate);
            setUserID(dataUpdated.userID);
            setLoading(false);
  
            const gamesData = await getGamesTypes();
            setGamebets(gamesData);
        
  
            
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
  
    if (loading ) {
      return <div>...</div>;
    }

  const handleEditClick = (game) => {
    setImagePreview(null);
    setSelectedGameBet(game);
    setIsModalOpen(true);
  };

  const handleSave =  async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    console.log("click");

    

    const formData = new FormData();
    formData.append('userID', selectedGameBet.id);
    formData.append('game_type', selectedGameBet.game_type);
    formData.append('bet', selectedGameBet.bet);
    formData.append('jackpot', selectedGameBet.jackpot);
    formData.append('status', selectedGameBet.status);

   


    setLoading(true);
    const isAuthenticated = await updateGameType(formData);
    if (!isAuthenticated) {
        
      setUpdating(false);
        setIsModalOpen(false);
        setLoading(false);
        
    }
    else
    { 
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
    setSelectedGameBet((prev) => ({ ...prev, [name]: value, }));
  };

  const handleGameDialog = () => {
    setshowGameDialog(false);
  };

  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedGameBet) { // Make sure selectedGameBet is not null
      
  
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
  
      // Update selectedGameBet dynamically
      setSelectedGameBet((prev) => ({
        ...prev!,
        picture: file, // Save the renamed filename or path to the database later
      }));
    }
  };
  
  
  
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">Game Types</h2>
       {/*  <Button onClick={() => setshowGameDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Bet Games
        </Button> */}
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
            {gamebets.map((product) => (
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




<label className="block text-sm font-medium text-gray-700 mb-2">
          Bet
          <Input
            type="number"
            name="bet"
            value={selectedGameBet?.bet || ""}
            onChange={handleChange}
            required
            className="border p-1 mt-2 w-full"
            placeholder="Enter Range Start"
            style={{ appearance: 'textfield' }}
          />
            <style>{`
                      input[type=number]::-webkit-outer-spin-button,
                      input[type=number]::-webkit-inner-spin-button {
                      -webkit-appearance: none;
                      margin: 0;
                      }
                      input[type=number] {
                      -moz-appearance: textfield;
                      }
                      `}
            </style> 
</label>
<label className="block text-sm font-medium text-gray-700 mb-2">
          Jackpot
          <Input
            type="number"
            name="jackpot"
            value={selectedGameBet?.jackpot || ""}
            onChange={handleChange}
            required
            className="border p-1 mt-2 w-full"
            placeholder="Enter Range Start"
            style={{ appearance: 'textfield' }}
          />
            <style>{`
                      input[type=number]::-webkit-outer-spin-button,
                      input[type=number]::-webkit-inner-spin-button {
                      -webkit-appearance: none;
                      margin: 0;
                      }
                      input[type=number] {
                      -moz-appearance: textfield;
                      }
                      `}
            </style> 
</label>


      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Status</label>
        <select
          name="status"
          value={selectedGameBet?.status || ""}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="" disabled>
            Select a Game Option
          </option>
          <option value="enabled">Enabled</option>
          <option value="hidden">Hidden</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>

                <br/><br/>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          {!updating ? (<Button
            variant="outline" 
            className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
            type='submit'
          >
            Update
          </Button>) : (<>Updating....</>)}
          <Button
            variant="outline" 
            className="w-full sm:w-auto border-red-500 text-red-600 hover:bg-red-900/20"
            onClick={() => setIsModalOpen(false)}
            type='button'
          >
            Cancel
          </Button>
        </DialogFooter>
        </form>
      </div>
    </DialogContent>
  </Dialog>
)}

        {/* Add Game Dialog */}
        <Dialog open={showGameDialog} onOpenChange={setshowGameDialog}>
          <DialogContent className="bg-gray-50 border-[#34495e] max-h-[90vh] w-96 overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl text-blue-600">Add Betting Game</DialogTitle>

            </DialogHeader>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Game Name</label>
                  <Input name='game_name' type="text" placeholder="Enter Game Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Game Description</label>
                  <Input name='game_description' type="text" placeholder="Enter Game Short Description" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Game Type</label>
                  <select name="options" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> 
                    <option value="" disabled selected>Select an Game Option</option>
                    <option value="lotto">Lotto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Available Days</label>
                  <select name="options" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> 
                    <option value="" disabled selected>Select an Option</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount Ceiling Applies</label>
                  <Input name='ceiling' type="number" placeholder="Enter win amount ceiling applies" style={{ appearance: 'textfield' }}/>
                    <style>{`
                      input[type=number]::-webkit-outer-spin-button,
                      input[type=number]::-webkit-inner-spin-button {
                      -webkit-appearance: none;
                      margin: 0;
                      }
                      input[type=number] {
                      -moz-appearance: textfield;
                      }
                      `}
                    </style>                  
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount Ceiling Percentage</label>
                  <Input name='ceiling' type="number" placeholder="Enter ceiling % applies" style={{ appearance: 'textfield' }}/>
                    <style>{`
                      input[type=number]::-webkit-outer-spin-button,
                      input[type=number]::-webkit-inner-spin-button {
                      -webkit-appearance: none;
                      margin: 0;
                      }
                      input[type=number] {
                      -moz-appearance: textfield;
                      }
                      `}
                    </style>                  
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Game Image</label>
                  <input 
                    name="picture" 
                    type="file" 
                    accept="image/*" 
                    className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                  />
                </div>
              </div>

                <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                  <Button 
                    variant="outline" 
                    onClick={() => setshowGameDialog(false)}
                    disabled
                    className="w-full sm:w-auto bg-green-500 border-green-500 text-black-600 hover:bg-green-500/20 hover:text-green-700"
                  >
                    Add
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setshowGameDialog(false)}
                    className="w-full sm:w-auto border-red-500 text-red-600 hover:bg-red-900/20"
                  >
                    Cancel
                  </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}