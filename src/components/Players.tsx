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
import { loginAdmin,getGames, updateGame, getGamesTypes, updateGameType, getDraws, getTransactionsCashin, getTransactionsCashout, getBetsHistory } from './api/apiCalls';
import { formatPeso } from './utils/utils';


export function Players() {

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
  
            const gamesData = await getBetsHistory();
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
        <h2 className="text-2xl md:text-3xl font-bold">Bets History</h2>
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
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Game</TableHead>
              <TableHead className="text-center">Player</TableHead>
              
              <TableHead className="text-center">Bet</TableHead>
              <TableHead className="text-center">If Player from agent</TableHead>
              <TableHead className="text-center">Status</TableHead>
              {/* <TableHead className="text-center">Action</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {gamebets.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="text-center">{product.created_date}<br/>{product.created_time}</TableCell>
                <TableCell className="text-center">
                  {product.game_name}
                  <br/>{product.game_type_name}
                  <br/>{product.draw_date} {product.draw_time}</TableCell>
                <TableCell className="text-center">{product.user_mobile}</TableCell>
                
                <TableCell className="text-center">{product.bets}</TableCell>
                <TableCell className="text-center">
                {product.bakas_fullname}
                <br/>
                {product.bakas_bank}
                <br/>
                {product.bakas_account}
                </TableCell>
                <TableCell className="text-center">{product.status}</TableCell>
                {/* <TableCell className="text-center">
                  <Button
                    className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                    onClick={() => handleEditClick(product)}
                  >
                    Edit
                  </Button>
                </TableCell> */}
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