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
import { DollarSign, Package, ShoppingCart, Users, Boxes, ArrowBigLeft } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';


export function HierarchyFourth() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLguAccountOpen, setIsDirectReferralsOpen] = useState(false);
  const [isAccountStatusOpen, setIsAccountStatusOpen] = useState(false);
  const [showGameDialog, setshowGameDialog] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const userMobile = queryParams.get("user_mobile");

  const stats = [
    {
      title: "Level 1 ",
      subtitle: "Direct Referrals",
      value: (0),
      icon: Users,
    },
    {
      title: "Level 2",
      subtitle: "Second Referrals",
      value: (0),
      icon: Users,
    },
  ];

  const [gamebets, setGamebets] = useState([
    // {
    //   id: "USER001",
    //   user_mobile: "9654321987",
    //   user_creation: "03/16/2025",
    //   balance: 1500,
    //   wins: 0,
    //   commission: 0,
    //   referrals: 0,
    //   account_status: "Pending",
    //   lgu_account: "No",
    // },
    // {
    //   id: "USER001",
    //   user_mobile: "09994829352",
    //   user_creation: "03/16/2025",
    //   balance: 1500,
    //   wins: 0,
    //   commission: 0,
    //   referrals: 0,
    //   account_status: "Pending",
    //   lgu_account: "No",
    // },
    // {
    //   id: "USER001",
    //   user_mobile: "09994829352",
    //   user_creation: "03/16/2025",
    //   balance: 1500,
    //   wins: 0,
    //   commission: 0,
    //   referrals: 0,
    //   account_status: "Pending",
    //   lgu_account: "No",
    // },
    // {
    //   id: "USER001",
    //   user_mobile: "0999482935211",
    //   user_creation: "03/16/2025",
    //   balance: 1500,
    //   wins: 0,
    //   commission: 1000,
    //   referrals: 3,
    //   account_status: "Pending",
    //   lgu_account: "No",
    // },
    // {
    //   id: "USER002",
    //   user_mobile: "09323322589",
    //   user_creation: "03/16/2025 03:38:50 am",
    //   balance: 1500,
    //   wins: 0,
    //   commission: 100,
    //   referrals: 10,
    //   account_status: "Pending",
    //   lgu_account: "No",
    // },
    // {
    //   id: "USER003",
    //   user_mobile: "0994829352",
    //   user_creation: "03/16/2025 03:50:32 am",
    //   balance: 1500,
    //   wins: 0,
    //   commission: 100,
    //   referrals: 10,
    //   account_status: "Pending",
    //   lgu_account: "No",
    // },
    // {
    //   id: "USER004",
    //   user_mobile: "0994829352",
    //   user_creation: "03/17/2025 10:53:25 am",
    //   balance: 1500,
    //   wins: 0,
    //   commission: 100,
    //   referrals: 10,
    //   account_status: "Pending",
    //   lgu_account: "No",
    // },
  ]);

  

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

        <Button
            onClick={() => navigate(-1)} // Navigate to the previous route
            className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
        >
            <ArrowBigLeft className="mr-2" /> {/* Arrow icon */}
            Back
        </Button>

      <h2 className="text-2xl md:text-3xl font-bold">Hierarchy Stats</h2>
      
      {userMobile && (
        <div className="text-lg font-medium">
         User's Mobile: (+63){userMobile}
        </div>
      )}

<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {/* <CardTitle className="text-sm font-medium">
                {stat.subtitle}
              </CardTitle> */}
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                Counted # {stat.subtitle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

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
              {/* <TableHead className="w-[100px] text-center">ID</TableHead> */}
              <TableHead className="text-center">Users Mobile #</TableHead>
              <TableHead className="text-center">Date Starting Referrals</TableHead>
              {/* <TableHead className="text-center">Account Balance</TableHead>
              <TableHead className="text-center"># of Wins</TableHead> */}
              <TableHead className="text-center">Commission</TableHead>
              <TableHead className="text-center"># Direct Referrals</TableHead>
              {/* <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">LGU Account</TableHead> */}
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gamebets.map((product) => (
              <TableRow key={product.id}>
                {/* <TableCell className="font-medium">{product.id}</TableCell> */}
                <TableCell className="text-center">{product.user_mobile}</TableCell>
                <TableCell className="text-center">{product.user_creation}</TableCell>
                {/* <TableCell className="text-center">₱{product.balance}</TableCell>
                <TableCell className="text-center">{product.wins}</TableCell> */}
                <TableCell className="text-center">₱{product.commission}</TableCell>
                <TableCell className="text-center">{product.referrals}</TableCell>
                {/* <TableCell className="text-center">{product.account_status}</TableCell>
                <TableCell className="text-center">{product.lgu_account}</TableCell> */}
                <TableCell className="text-center">
                  <Button
                    className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                    // onClick={() => handleEditClick(product)}
                    // onClick={() => navigate('/hierarchysecond')}
                    onClick={() => navigate(`/hierarchysecond?user_mobile=${product.user_mobile}`)}
                  >
                    Details
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
        <DialogTitle className="text-xl text-blue-600">List of Referrals</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">


        {/* <label className="block text-sm font-medium text-gray-700 mb-2">
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
        </label> */}



{/* <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Select LGU Account</label>
  <select
    name="lgu_account"
    value={selectedGameBet?.lgu_account || ""}
    onChange={handleChange}
    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  >
    <option value="" disabled>
      Select LGU Status
    </option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Select LGU Account</label>
  <select
    name="account_status"
    value={selectedGameBet?.account_status || ""}
    onChange={handleChange}
    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  >
    <option value="" disabled>
      Select LGU Status
    </option>
    <option value="Pending">Pending</option>
    <option value="Approve">Approve</option>
    <option value="Suspend">Suspend</option>
  </select>
</div> */}

<div>
      {/* LGU Account Dropdown */}
      <div>
        <button
          onClick={toggleDirectReferrals}
          className="block w-full text-left text-sm font-medium text-gray-700 mb-1 focus:outline-none"
        >
          {isLguAccountOpen ? "▼ List of Direct Referrals" : "▶ View Direct Referrals (Lvl 1)"}
        </button>
        {isLguAccountOpen && (
          // <select
          //   name="lgu_account"
          //   value={selectedGameBet?.lgu_account || ""}
          //   onChange={handleChange}
          //   className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          // >
          //   <option value="" disabled>
          //     Select LGU Status
          //   </option>
          //   <option value="Yes">Yes</option>
          //   <option value="No">No</option>
          // </select>
          <label className="block text-sm font-medium text-gray-700 mb-2">
          Downline Mobile #
          <Input
            type="text"
            name="game_name"
            value={selectedGameBet.user_mobile || ""}
            readOnly
            onChange={handleChange}
            className="border p-1 mt-2 w-full"
            placeholder="Enter Game Name"
          />
          <Input
            type="text"
            name="game_name"
            value={selectedGameBet.user_mobile || ""}
            readOnly
            onChange={handleChange}
            className="border p-1 mt-2 w-full"
            placeholder="Enter Game Name"
          />
        </label>
        )}
      </div>

      {/* Account Status Dropdown */}
      <div className="mt-4">
        <button
          onClick={toggleAccountStatus}
          className="block w-full text-left text-sm font-medium text-gray-700 mb-1 focus:outline-none"
        >
          {isAccountStatusOpen ? "▼ Select Account Status" : "▶ Select Account Status"}
        </button>
        {isAccountStatusOpen && (
          <select
            name="account_status"
            value={selectedGameBet?.account_status || ""}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="" disabled>
              Select LGU Status
            </option>
            <option value="Pending">Pending</option>
            <option value="Approve">Approve</option>
            <option value="Suspend">Suspend</option>
          </select>
        )}
      </div>
    </div>



{/* <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
  <select
    name="game_type"
    value={selectedGameBet?.lgu_account || ""}
    onChange={handleChange}
    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  >
    <option value="" disabled>
      Select an Account Status Option
    </option>
    <option value="Approved">Approved</option>
    <option value="Pending">Pending</option>
    <option value="Suspend">Suspend</option>
  </select>
</div> */}

{/* <label className="block text-sm font-medium text-gray-700 mb-2">
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
</label> */}

{/* <label className="block text-sm font-medium text-gray-700 mb-2">
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
</label> */}
        

        {/* <DialogFooter className="flex flex-col gap-2 sm:flex-row">
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
        </DialogFooter> */}
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
