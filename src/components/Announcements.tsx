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
import { loginAdmin,getGames, updateGame, getAnnouncements, addAnnouncement, updateAnnouncement } from './api/apiCalls';
import { formatPeso } from './utils/utils';
import { Textarea } from '@/components/ui/textarea';
import { Bets } from './Bets';


export function Announcements() {

  const { user,getAccessTokenSilently , logout} = useAuth0();
  const [showGameDialog, setshowGameDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState("none");
  const [dbUpdated, setDbUpdated] = useState(false);
  const [gamebets, setGamebets] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGameBet, setSelectedGameBet] = useState(null);
    // New states for search and sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [permissionsString, setPermissionsString] = useState([]);
  const [announcement, setAnnouncement] = useState("");

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
  
            const gamesData = await getAnnouncements();
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
    setSelectedGameBet(game);
    setIsModalOpen(true);
  };

  const handleSave =  async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("click");

    

    const formData = new FormData();
    formData.append('userID', selectedGameBet.id);
    formData.append('announcement', selectedGameBet.announcement);
    formData.append('status', selectedGameBet.status);
    console.log(selectedGameBet.picture);
    if (selectedGameBet.picture) {
        formData.append('picture', selectedGameBet.picture);
    }


    setLoading(true);
    const isAuthenticated = await updateAnnouncement(formData);
    if (!isAuthenticated) {
      alert("an error occurred!");
        setIsModalOpen(false);
        setLoading(false);
        
    }
    else
    { 
      setIsModalOpen(false);
      setLoading(false);
        alert("announcement updated successfully.");
        const gamesData = await getAnnouncements();
            setGamebets(gamesData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedGameBet((prev) => ({ ...prev, [name]: value, }));
  };




  const addAnnouncementHandle =  async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("click");

    
    const formData = new FormData();
    formData.append('announcement', announcement);

    
    const isAuthenticated = await addAnnouncement(formData);
    if (!isAuthenticated) {
        alert("an error occurred!");
        setIsModalOpen(false);
        setLoading(false);
        setAnnouncement("");
        
    }
    else
    { 
        setIsModalOpen(false);
      
        alert("announcement updated successfully.");
        const gamesData = await getAnnouncements();
        setGamebets(gamesData);

        setLoading(false);
        setAnnouncement("");
    }
  };
  
  
  

    if(!permissionsString.includes("admin_management"))
      {
        return <div>Not allowed to manage this page</div>
      }
  
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">Announcements</h2>
        <Button onClick={() => setshowGameDialog(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-row justify-end items-center gap-4">
        <Input
          type="text"
          placeholder="Search announcement..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        />
        
      </div>
      
      <div className="overflow-x-auto">

      <Card className="lg:col-span-7">
         
          <CardContent>
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Announcement</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gamebets.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="text-center">{product.announcement}</TableCell>
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
        <DialogTitle className="text-xl text-blue-600">Update Announcement</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
      <form onSubmit={handleSave}>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Announcement
          <Textarea
            name="announcement"
            value={selectedGameBet.announcement || ""}
            onChange={handleChange}
            required
            className="border p-1 mt-2 w-full"
            placeholder="Enter Announcement"
          />
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
          <option value="live">Live</option>
          <option value="off">Off</option>
        </select>
      </div>

      <br/>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
         <Button
            variant="outline" 
            className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
            type='submit'
          >
            Update
          </Button>
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
              <DialogTitle className="text-xl text-blue-600">Add Announcement</DialogTitle>

            </DialogHeader>
            <form onSubmit={addAnnouncementHandle} >
              <div className="space-y-3">
              
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Announcement</label>
                  <Textarea name='announcement' value={announcement} onChange={(e) => setAnnouncement(e.target.value)} placeholder="Enter Announcement" />
                </div>
                
              </div>
                <br/>
                <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                  <Button 
                    variant="outline" 
                    type='submit'
                    className="w-full sm:w-auto bg-green-500 border-green-500 text-black-600 hover:bg-green-500/20 hover:text-green-700"
                  >
                    Add
                  </Button>
                  <Button 
                    type='button'
                    variant="outline" 
                    onClick={() => setshowGameDialog(false)}
                    className="w-full sm:w-auto border-red-500 text-red-600 hover:bg-red-900/20"
                  >
                    Cancel
                  </Button>
                </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}