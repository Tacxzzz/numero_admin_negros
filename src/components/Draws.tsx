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


export function Draws() {
  const [showGameDialog, setshowGameDialog] = useState(false);
  const [gamebets, setGamebets] = useState([
    {
      id: "GAME001",
      game_name: "2D Game",
      winning_draw_date: "03/29/2025", 
      winning_draw_time: "02:00:00 pm",
      results: "4-14",
      defult_ceiling: 10000,
      base_ceiling: 10000,
      percentage_ceiling: 50,
      collection_percentage: 50,
      winning_status: "Done",
    },
    {
      id: "GAME002",
      game_name: "3D Game",
      winning_draw_date: "03/29/2025", 
      winning_draw_time: "02:00:00 pm",
      results: "1-11-16",
      defult_ceiling: 10000,
      base_ceiling: 10000,
      percentage_ceiling: 50,
      collection_percentage: 50,
      winning_status: "Done",
    },
    {
      id: "GAME003",
      game_name: "3D STL Game",
      winning_draw_date: "03/29/2025", 
      winning_draw_time: "02:00:00 pm",
      results: "3-4-7",
      defult_ceiling: 10000,
      base_ceiling: 10000,
      percentage_ceiling: 50,
      collection_percentage: 50,
      winning_status: "Done",
    },
    {
      id: "GAME004",
      game_name: "4D Game",
      winning_draw_date: "03/29/2025", 
      winning_draw_time: "02:00:00 pm",
      results: "6-15-17-19",
      defult_ceiling: 10000,
      base_ceiling: 10000,
      percentage_ceiling: 50,
      collection_percentage: 50,
      winning_status: "Pending",
    },
  ]);

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
        <h2 className="text-2xl md:text-3xl font-bold">Draw Bets Schedules</h2>
        <Button onClick={() => setshowGameDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Draws Schedule
        </Button>
      </div>
      
      <div className="overflow-x-auto">

      <Card className="lg:col-span-7">
         
          <CardContent>
          <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead className="w-[100px] text-center">ID</TableHead> */}
              <TableHead className="text-center">Game Name</TableHead>
              <TableHead className="text-center">Winning Draw Date</TableHead>
              <TableHead className="text-center">Winning Draw Time</TableHead>
              <TableHead className="text-center">Results</TableHead>
              <TableHead className="text-center">Default Ceiling</TableHead>
              <TableHead className="text-center">Base Ceiling</TableHead>
              <TableHead className="text-center">Amount Ceiling Percentage</TableHead>
              <TableHead className="text-center">Collection Percentage</TableHead>
              <TableHead className="text-center">Winning Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gamebets.map((product) => (
              <TableRow key={product.id}>
                {/* <TableCell className="font-medium">{product.id}</TableCell> */}
                <TableCell className="text-center">{product.game_name}</TableCell>
                <TableCell className="text-center">{product.winning_draw_date}</TableCell>
                <TableCell className="text-center">{product.winning_draw_time}</TableCell>
                <TableCell className="text-center">{product.results}</TableCell>
                <TableCell className="text-center">₱{product.defult_ceiling}</TableCell>
                <TableCell className="text-center">₱{product.base_ceiling}</TableCell>
                <TableCell className="text-center">{product.percentage_ceiling} %</TableCell>
                <TableCell className="text-center">{product.collection_percentage} %</TableCell>
                <TableCell className="text-center">{product.winning_status}</TableCell>
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
        <DialogTitle className="text-xl text-blue-600">Update Draw Bets</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">


        <label className="block text-sm font-medium text-gray-700 mb-2">
          Game Name
          <Input
            type="text"
            name="game_name"
            value={selectedGameBet.game_name || ""}
            onChange={handleChange}
            className="border p-1 mt-2 w-full"
            placeholder="Enter Game Name"
          />
        </label>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Game Description
          <Input
            type="text"
            name="game_desc"
            value={selectedGameBet?.game_desc || ""}
            onChange={handleChange}
            className="border p-1 mt-2 w-full"
            placeholder="Enter Game Description"
          />
        </label>



<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Select Game Type</label>
  <select
    name="game_type"
    value={selectedGameBet?.game_type || ""}
    onChange={handleChange}
    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  >
    <option value="" disabled>
      Select a Game Option
    </option>
    <option value="Lotto">Lotto</option>
    <option value="2D">2D</option>
    <option value="3D">3D</option>
    <option value="4D">4D</option>
    <option value="Pick 3">Pick 3</option>
  </select>
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Select Available Days</label>
  <select
    name="game_type"
    value={selectedGameBet?.game_availabledays || ""}
    onChange={handleChange}
    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  >
    <option value="" disabled>
      Select an Option
    </option>
    <option value="Daily">Daily</option>
  </select>
</div>

<label className="block text-sm font-medium text-gray-700 mb-2">
          Amount Ceiling Applies
          <Input
            type="text"
            name="game_ceiling"
            value={selectedGameBet?.game_ceiling || ""}
            onChange={handleChange}
            className="border p-1 mt-2 w-full"
            placeholder="Enter Ceiling Applies"
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
          Amount Ceiling Percentage
          <Input
            type="text"
            name="game_ceiling_percentage"
            value={selectedGameBet?.game_ceiling_percentage || ""}
            onChange={handleChange}
            className="border p-1 mt-2 w-full"
            placeholder="Enter Ceiling Percentage"
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
        

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline" 
            className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
            onClick={handleSave}
          >
            Update
          </Button>
          <Button
            variant="outline" 
            className="w-full sm:w-auto border-red-500 text-red-600 hover:bg-red-900/20"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
)}

        {/* Add Game Dialog */}
        <Dialog open={showGameDialog} onOpenChange={setshowGameDialog}>
          <DialogContent className="bg-gray-50 border-[#34495e] max-h-[90vh] w-96 overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl text-blue-600">Add Draw Result</DialogTitle>

            </DialogHeader>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Game</label>
                  <select name="options" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> 
                    <option value="" disabled selected>Select an Game Option</option>
                    <option value="lotto">Lotto</option>
                    <option value="2d">2D</option>
                    <option value="3d">3D</option>
                    <option value="4d">4D</option>
                    <option value="pick3">Pick 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Game Draw Date</label>
                  <Input name='winning_draw_date' type="date" placeholder="Select Date" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Game Draw Time</label>
                  <Input name='winning_draw_time' type="time" placeholder="Select Time" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Game Winning Result</label>
                  <Input name='results' type="text" placeholder="Enter Winning Result" />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Game Type</label>
                  <select name="options" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> 
                    <option value="" disabled selected>Select an Game Option</option>
                    <option value="lotto">Lotto</option>
                    <option value="2d">2D</option>
                    <option value="3d">3D</option>
                    <option value="4d">4D</option>
                    <option value="pick3">Pick 3</option>
                  </select>
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Ceiling</label>
                  <Input name='default_ceiling' type="number" placeholder="Enter default ceiling " style={{ appearance: 'textfield' }}/>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Ceiling</label>
                  <Input name='base_ceiling' type="number" placeholder="Enter default ceiling" style={{ appearance: 'textfield' }}/>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Percentage Ceiling</label>
                  <Input name='percentage_ceiling' type="number" placeholder="Enter Percentage ceiling" style={{ appearance: 'textfield' }}/>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Add Collection Percentage</label>
                  <Input name='collection_percentage' type="number" placeholder="Enter Percentage ceiling" style={{ appearance: 'textfield' }}/>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Winning Staus</label>
                  <select name="options" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> 
                    <option value="" disabled selected>Select Winning Status</option>
                    <option value="Done">Done</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Game Image</label>
                  <input 
                    name="file_upload" 
                    type="file" 
                    accept="image/*" 
                    className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                  />
                </div> */}
              </div>

                <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                  <Button 
                    variant="outline" 
                    onClick={() => setshowGameDialog(false)}
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
