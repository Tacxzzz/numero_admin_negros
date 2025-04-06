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
import { useNavigate } from 'react-router-dom';
import { getLevel1Referrals } from './api/apiCalls';
import { formatPeso } from './utils/utils';


export function HierarchyDirect({ user_id }) {
  const navigate = useNavigate();
  const [isLguAccountOpen, setIsDirectReferralsOpen] = useState(false);
  const [isAccountStatusOpen, setIsAccountStatusOpen] = useState(false);
  const [showGameDialog, setshowGameDialog] = useState(false);
  const [gamebets, setGamebets] = useState<any[]>([]);

  
    useEffect(() => {
      
        const handleUpdate = async () => {
            const gamesData = await getLevel1Referrals(user_id);
              setGamebets(gamesData);
          
        };
        handleUpdate();
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user_id]);
  


  const toggleDirectReferrals = () => setIsDirectReferralsOpen(!isLguAccountOpen);
  const toggleAccountStatus = () => setIsAccountStatusOpen(!isAccountStatusOpen);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGameBet, setSelectedGameBet] = useState(null);

  const handleEditClick = (game) => {
    setSelectedGameBet(game);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setGamebets((prev) =>
      prev.map((game) =>
        game.id === selectedGameBet.id ? selectedGameBet : game
      )
    );
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedGameBet((prev) => ({ ...prev, [name]: value, }));
  };

  const handleGameDialog = () => {
    setshowGameDialog(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* <h2 className="text-2xl md:text-3xl font-bold">List of Users</h2> */}
        {/* <Button onClick={() => setshowGameDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Draws Schedule
        </Button> */}
      </div>
      
      <div className="overflow-x-auto">

      <Card className="lg:col-span-7">
         
          <CardContent>
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Users Mobile #</TableHead>
              <TableHead className="text-center">Date Created</TableHead>
              <TableHead className="text-center">Commissions</TableHead>
              <TableHead className="text-center"># Direct Referrals</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gamebets.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="text-center">{product.mobile}</TableCell>
                <TableCell className="text-center">{product.created}</TableCell>
                
                <TableCell className="text-center">{formatPeso(product.commissions)}</TableCell>
                <TableCell className="text-center">{product.referral_count}</TableCell>
                
                <TableCell className="text-center">
                  <Button
                    className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                    onClick={() => navigate(`/hierarchy?user_mobile=${product.mobile}&user_id=${product.id}`)}
                  >
                    Go to Referrals
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
