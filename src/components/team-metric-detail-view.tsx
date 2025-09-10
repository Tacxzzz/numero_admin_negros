import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpDown, Search, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ExportButton } from "./export-button";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { addBalance, cashinHourlyData, cashinHourlyDataTeam, cashoutHourlyData, cashoutHourlyDataTeam, countBetsEarned, countBetsEarnedFreeCreditsTeam, countBetsEarnedTeam, countClientBetsEarned, countClientBetsEarnedTeam, countSelfBetsEarned, countSelfBetsEarnedTeam, getBetsData, getBetsDataTeam, getBetsWins4D, getBetsWins4DTeam, getBetsWinsPerGame, getBetsWinsPerGameTeam, getBetsWinsPerGameType, getBetsWinsPerGameTypeTeam, getBetsWinsPerTimeSlot, getBetsWinsPerTimeSlotTeam, getCashinData, getCashinDataTeam, getCashoutData, getCashoutDataTeam, getCommissionsData, getCommissionsDataTeam, getPlayersAdminChoice, getPlayersData, getPlayersDataTeam, getTotalBetsDataTeam, getTotalCashinDataTeam, getTotalConversionDataTeam, getWinnersData, getWinnersDataTeam, loginAdmin, totalCashoutFromCommissions, totalCashoutFromCommissionsTeam, totalCashoutFromWinnings, totalCashoutFromWinningsTeam, totalCommissions, totalCommissionsTeam, totalPlayers, totalPlayersActive, totalPlayersActiveTeam, totalPlayersInactive, totalPlayersInactiveTeam, totalPlayersTeam, totalWins, totalWinsTeam, updatePlayer, updatePlayerTeam } from "./api/apiCalls";
import { useAuth0 } from "@auth0/auth0-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// Mock data for hourly cash history
const hourlyData = [
  { hour: "0:00", value: 1000.00 },
  { hour: "1:00", value: 0 },
  { hour: "2:00", value: 0 },
  { hour: "3:00", value: 0 },
  { hour: "4:00", value: 0 },
  { hour: "5:00", value: 0 },
  { hour: "6:00", value: 0 },
  { hour: "7:00", value: 50000.00 },
  { hour: "8:00", value: 0 },
  { hour: "9:00", value: 0 },
  { hour: "10:00", value: 0 },
  { hour: "11:00", value: 5000.00 },
  { hour: "12:00", value: 0 },
  { hour: "13:00", value: 0 },
  { hour: "14:00", value: 0 },
  { hour: "15:00", value: 0 },
  { hour: "16:00", value: 0 },
  { hour: "17:00", value: 0 },
  { hour: "18:00", value: 0 },
  { hour: "19:00", value: 0 },
  { hour: "20:00", value: 0 },
  { hour: "21:00", value: 0 },
  { hour: "22:00", value: 0 },
  { hour: "23:00", value: 0 },
];

// Format hourly data for CSV export
const hourlyExportData = hourlyData.map(item => ({
  hour: item.hour,
  value: item.value > 0 ? `₱${item.value.toFixed(2)}` : "₱0.00"
}));

// Metric title mapping
const metricTitles: Record<string, string> = {
  "total-cash-in": "CASH IN HISTORY",
  "total-cash-outs-paid": "CASH OUT HISTORY",
  "net-cash": "NET CASH HISTORY",
  "total-players": "PLAYERS HISTORY",
  "active-players": "ACTIVE PLAYERS HISTORY",
  "inactive-players": "INACTIVE PLAYERS HISTORY",
  "total-bets-earned": "BET HISTORY",
  "total-commissions": "COMMISSIONS HISTORY",
  "total-wins": "WINS HISTORY",
  "total-free-bets": "FREE BETS HISTORY",
  "total-bets-conversions": "BETS CONVERSIONS HISTORY",
  "net-income-bets": "NET INCOME HISTORY"
};

// Generic sortable and filterable table component
interface SortableTableProps<T> {
  data: T[];
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  startDate: string;
  endDate: string;
  playerStatus: string;
  columns: {
    key: keyof T;
    label: string;
  }[];
  className?: string;
  addBalancePermission: boolean;
  adminChoice: any[];
}

function formatCellValue<T>(columnKey: string, columnLabel: string, row: T): string {
  const value = row[columnKey as keyof T];

  if (columnKey === 'referrer_mobile' || columnKey === 'under_admin_mail') {
    return String(value) === 'null' ? '' : String(value);
  }

  if (columnKey === 'has_maintaining_balance' || columnKey === 'employer' || columnKey === 'bypass_device') {
    return String(value) === '' ? 'no' : String(value);
  }

  if (columnLabel === 'Player Status') {
    return String(value) === 'pending' ? 'Active' : 'Inactive';
  }

  if (['amount', 'balance', 'wins', 'commissions', 'maintaining_balance', 'quota'].includes(columnKey)) {
    return Number(value).toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    });
  }

  if (
    ['bet_commission_percent', 'level_one_percent', 'level_two_percent', 'nolimit_percent'].includes(columnKey)
  ) {
    return String(value) + '%';
  }

  return String(value);
}

function SortableTable<T>({ data, columns, className, setData, startDate, endDate, playerStatus, addBalancePermission, adminChoice }: SortableTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'ascending' | 'descending';
  } | null>(null);

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filteredData, setFilteredData] = useState<T[]>(data);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [updating, setUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddBalanceModalOpen, setIsAddBalanceModalOpen] = useState(false);
  const [selectedGameBet, setSelectedGameBet] = useState(null);

  const navigate = useNavigate();

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
  
      const isAuthenticated = await updatePlayerTeam(formData);
  
      setUpdating(false);
      setIsModalOpen(false);

      if (isAuthenticated) {
        const updatedData = await getPlayersData(startDate, endDate, playerStatus === 'active' ? 'pending' : playerStatus === 'inactive' ? 'verification' : playerStatus);
        setData(updatedData);
      }
  
      if (!isAuthenticated) {
        alert("An error occurred!");
        return;
      }
  
      alert("Player updated successfully.");
   };

  const handleAddBalanceClick = (game) => {
      setSelectedGameBet(game);
      setIsAddBalanceModalOpen(true);
   };
  
   const handleAddbalance = async (e: React.FormEvent) => { 
    e.preventDefault();
      setUpdating(true);
  
      const formData = new FormData();
      formData.append('userID', selectedGameBet.id);
      formData.append('amount', selectedGameBet.amount);
  
      const isAuthenticated = await addBalance(formData);
  
      setUpdating(false);
      setIsAddBalanceModalOpen(false);

      if (isAuthenticated) {
        const updatedData = await getPlayersData(startDate, endDate, playerStatus);
        setData(updatedData);
      }
  
      if (!isAuthenticated) {
        alert("An error occurred!");
        return;
      }
  
      alert("Added balance successfully.");
   };

  const requestSort = (key: keyof T) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1); // reset to first page on filter change
  };

  const clearFilter = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    setCurrentPage(1); // reset to first page on clear
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedGameBet((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    let sortedData = [...data];

    // Filtering
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        sortedData = sortedData.filter((item) => {
          const col = columns.find((c) => c.key === key);
          const displayValue = col ? formatCellValue(key, col.label, item) : String(item[key as keyof T]);
          return displayValue.toLowerCase().includes(filters[key].toLowerCase());
        });
      }
    });


    // Sorting
    if (sortConfig !== null) {
    sortedData.sort((a, b) => {
      const col = columns.find((c) => c.key === sortConfig.key);
      const aValue = col ? formatCellValue(sortConfig.key as string, col.label, a) : String(a[sortConfig.key]);
      const bValue = col ? formatCellValue(sortConfig.key as string, col.label, b) : String(b[sortConfig.key]);

      if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
}

    setFilteredData(sortedData);
  }, [data, sortConfig, filters]);

  return (
    <div className={className}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)} className="whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                            {column.label}
                            {column.label !== 'Action' && (<ArrowUpDown className="ml-2 h-3 w-3" />)}
                          </Button>
                        </DropdownMenuTrigger>
                        {column.label !== 'Action' && (<DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => requestSort(column.key)}>
                            Sort {sortConfig?.key === column.key && sortConfig?.direction === 'ascending'
                              ? 'Descending'
                              : 'Ascending'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>)}
                      </DropdownMenu>
                    </div>
                    {column.label !== "Action" && (<div className="flex items-center space-x-1">
                      <Input
                        placeholder={`Filter ${column.label}`}
                        value={filters[column.key as string] || ''}
                        onChange={(e) => handleFilterChange(column.key as string, e.target.value)}
                        className="h-7 text-xs"
                      />
                      {filters[column.key as string] && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => clearFilter(column.key as string)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div> )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={`${index}-${String(column.key)}`} className="whitespace-nowrap">
                    { column.key === 'referrer_mobile' || column.key === 'under_admin_mail' ? String(row[column.key]) === 'null' ? '' : String(row[column.key])
                     : column.key === 'has_maintaining_balance' || column.key === 'employer' || column.key === 'bypass_device' ? String(row[column.key]) === '' ? 'no' : String(row[column.key])
                     : column.label === 'Player Status' ? String(row[column.key]) === 'pending' ? 'Active' : 'Inactive'
                     : column.key === 'amount' || column.key === 'total_amount' || column.key === 'balance' || column.key === 'wins' || column.key === 'commissions' || column.key === 'maintaining_balance' || column.key === 'quota' || column.key === 'bet'? 
                     Number(row[column.key]).toLocaleString("en-PH", {
                        style: "currency",
                        currency: "PHP",
                        minimumFractionDigits: 2
                      })
                     : column.key === 'bet_commission_percent' || column.key === 'level_one_percent' || column.key === 'level_two_percent' || column.key === 'nolimit_percent' ? String(row[column.key]) + '%'
                     : column.key === 'action' ? (
                      <>
                        <div className="flex gap-2 align-items-center justify-center mt-2">
                          <Button
                            className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                            onClick={() => handleEditClick(row)}
                          >
                            Edit
                          </Button>
                          <Button
                            className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                            onClick={() => navigate(`/hierarchy?user_mobile=${String(row['mobile'])}&user_id=${String(row['id'])}`)}
                          >
                            Referrals
                          </Button>
                          <Button
                            className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                            onClick={() => navigate('/logsuser', { state: { userID: String(row['id']) } })}
                          >
                            Logs
                          </Button>
                        </div>
                      </>
                     )
                     : String(row[column.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-4">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 gap-3 px-2 text-sm">
        {/* Left Side: Page info and size selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <span>
            Page {currentPage} of {totalPages}
          </span>

          {/* Page Size Selector */}
          <div className="flex items-center gap-1">
            <label htmlFor="pageSize" className="text-xs">Rows per page:</label>
            <select
              id="pageSize"
              value={itemsPerPage}
              onChange={(e) => {
                const newSize = parseInt(e.target.value);
                setCurrentPage(1); // reset to first page
                setItemsPerPage(newSize);
              }}
              className="border rounded px-1 py-0.5 text-xs"
            >
              {[5, 10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Side: Pagination buttons and jump */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>

          {/* Jump to Page */}
          <div className="flex items-center gap-1">
            <label htmlFor="jumpToPage" className="text-xs">Go to:</label>
            <input
              id="jumpToPage"
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = Math.max(1, Math.min(Number(e.target.value), totalPages));
                setCurrentPage(page);
              }}
              className="w-16 border rounded px-1 py-0.5 text-xs text-center"
            />
          </div>
        </div>
      </div>

      {/* Edit Game Dialog */}
              {isModalOpen && (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogContent className="bg-gray-50 border-[#34495e] max-h-[90vh] w-96 overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl text-blue-600">Update Status</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <form onSubmit={handleSave}>
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
                              Select a Status
                            </option>
                            <option value="pending">Active</option>
                            <option value="blocked">Blocked</option>
                          </select>
                        </div>
                        <br />
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

      {/* Add Balance Dialog */}
        {isAddBalanceModalOpen && (
          <Dialog open={isAddBalanceModalOpen} onOpenChange={setIsAddBalanceModalOpen}>
            <DialogContent className="bg-gray-50 border-[#34495e] max-h-[90vh] w-96 overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl text-blue-600">Add Balance to {selectedGameBet.mobile}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <form onSubmit={handleAddbalance}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Balance : {selectedGameBet.balance}
                <Input
                  type="number"
                  name="amount"
                  value={selectedGameBet?.amount || ""}
                  onChange={handleChange}
                  required
                  className="border p-1 mt-2 w-full"
                  placeholder="Enter balance to add"
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
                    {!updating ? (
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                        type="submit"
                      >
                        Add Balance
                      </Button>
                    ) : (
                      <>Updating....</>
                    )}
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-red-500 text-red-600 hover:bg-red-900/20"
                      onClick={() => setIsAddBalanceModalOpen(false)}
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
  );
}

// Sortable and filterable game table component
interface GameTableProps {
  data: { game: string; bets: string; wins: string }[];
  title?: string;
  className?: string;
}

function GameTable({ data, title, className }: GameTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: 'game' | 'bets' | 'wins';
    direction: 'ascending' | 'descending';
  } | null>(null);
  
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filteredData, setFilteredData] = useState<typeof data>(data || []);

  // Handle sorting
  const requestSort = (key: 'game' | 'bets' | 'wins') => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle filtering
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const clearFilter = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
  };

  // Apply sorting and filtering
  useEffect(() => {
    let sortedData = [...data || []];
    
    // Apply filters
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        sortedData = sortedData.filter(item => {
          const itemValue = String(item[key as keyof typeof item]).toLowerCase();
          return itemValue.includes(filters[key].toLowerCase());
        });
      }
    });
    
    // Apply sorting
    if (sortConfig !== null) {
      sortedData.sort((a, b) => {
        const key = sortConfig.key;

        if (key === 'game') {
          const aValue = String(a[key]);
          const bValue = String(b[key]);

          return sortConfig.direction === 'ascending'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          const aValue = parseFloat(String(a[key]).replace(/[^0-9.-]+/g, '')) || 0;
          const bValue = parseFloat(String(b[key]).replace(/[^0-9.-]+/g, '')) || 0;

          return sortConfig.direction === 'ascending'
            ? aValue - bValue
            : bValue - aValue;
        }
      });
    }
    
    setFilteredData(sortedData);
  }, [data, sortConfig, filters]);

  return (
    <div className={className}>
      {title && (
        <div className="bg-cyan-100 p-2 font-bold text-center mb-2">
          {title}
        </div>
      )}
      <div className="overflow-x-auto border">
        <table className="w-full">
          <thead>
            <tr>
              {title !== '4D' && ['GAME', 'BETS', 'WINS'].map((header, index) => (
                <th key={index} className="border p-2 text-center">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 text-xs"
                        onClick={() => requestSort(header.toLowerCase() as 'game' | 'bets' | 'wins')}
                      >
                        {header}
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-1 px-1">
                      <Input
                        placeholder={`Filter ${header}`}
                        value={filters[header.toLowerCase()] || ''}
                        onChange={(e) => handleFilterChange(header.toLowerCase(), e.target.value)}
                        className="h-6 text-xs"
                      />
                      {filters[header.toLowerCase()] && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0" 
                          onClick={() => clearFilter(header.toLowerCase())}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((game, gameIndex) => (
              <tr key={gameIndex}>
                <td className="border p-2 text-center">{game.game}</td>
                <td className="border p-2 text-center">₱{Number(game.bets).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                {title !== '4D' && <td className="border p-2 text-center">₱{Number(game.wins).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={3} className="border p-2 text-center">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface HourData {
  hour: string;
  value: number;
}

const normalizeHourlyData = (apiData: HourData[]): HourData[] => {
  const fullHours: HourData[] = [];

  for (let i = 0; i < 24; i++) {
    const found = apiData.find((item) => item.hour === i.toString());
    fullHours.push({
      hour: i.toString(),
      value: found ? found.value : 0,
    });
  }

  return fullHours;
};

export function TeamMetricDetailView() {
   const initialStartDate = new Date();
          initialStartDate.setDate(initialStartDate.getDate() - 20); // Subtract 20 days from the current date

          const startDateDefault = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Manila',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).format(initialStartDate).split('/').reverse().join('-'); // Format the date as YYYY-MM-DD
          
          const endDateDefault = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Manila',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).format(new Date()).split('/').reverse().join('-');
  const { metricId } = useParams<{ metricId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [transactionData, setTransactionData] = useState<any[]>([]);
  const [hourlyData, setHourlyData] = useState<HourData[]>([]);
  const { user, getAccessTokenSilently, logout } = useAuth0();
  const [userID, setUserID] = useState("none");
  const [loading, setLoading] = useState(true);
  const [dbUpdated, setDbUpdated] = useState(false);
  const [permissionsString, setPermissionsString] = useState([]);
  const [startDate, setStartDate] = useState<string>(() => searchParams.get('startDate') ?? startDateDefault);
  const [endDate, setEndDate] = useState<string>(() => searchParams.get('endDate') ?? endDateDefault);
  const [cashoutFromCommission, setCashoutFromCommission] = useState(0);
  const [cashoutFromWinnings, setCashoutFromWinnings] = useState(0);
  const [totalPlayersAmount, setTotalPlayersAmount] = useState(0);
  const [playerStatus, setPlayerStatus] = useState(() => searchParams.get('status') ?? "all");
  const [adminChoice, setAdminChoice] = useState<any[]>([]);
  const [totalBetsEarned, setTotalBetsEarned] = useState(0);
  const [totalBetsFreeCredits, setTotalBetsFreeCredits] = useState(0);
  const [totalSelfBetsEarned, setSelfTotalBetsEarned] = useState(0);
  const [totalClientBetsEarned, setTotalClientBetsEarned] = useState(0);
  const [totalCommissionsCount, setTotalCommissionsCount] = useState(0);
  const [totalWinsCount, setTotalWinsCount] = useState(0);
  
  // Get the title for the current metric
  const metricTitle = metricId ? metricTitles[metricId] || "METRIC HISTORY" : "METRIC HISTORY";
  
  // Total value (sum of all hourly values)
  const totalValue = hourlyData.reduce((sum, item) => sum + Number(item.value), 0);

  const [timeSlotBetData, setTimeSlotBetData] = useState([]);
  const [gameTypeBetData, setGameTypeBetData] = useState({});

  const hasInitializedRef = useRef(false);

  //tableColumns
  const cashinTransactionColumn = [
    { key: 'id', label: 'ID' },
    { key: 'date', label: 'Date' },
    { key: 'mobile', label: 'User' },
    { key: 'trans_num', label: 'Client No' },
    { key: 'invoice', label: 'Order No' },
    { key: 'amount', label: 'Amount Paid' },
    { key: 'status', label: 'Status' }
  ];
  
  const cashoutTransactionColumn = [
    { key: 'id', label: 'ID' },
    { key: 'date', label: 'Date' },
    { key: 'mobile', label: 'User' },
    { key: 'trans_num', label: 'Client No' },
    { key: 'invoice', label: 'Order No' },
    { key: 'source', label: 'Source' },
    { key: 'amount', label: 'Amount Paid' },
    { key: 'status', label: 'Status' }
  ];

  const playersColumn = [
            { key: 'id', label: 'ID' },
            { key: 'mobile', label: 'User Mobile' },
            { key: 'created', label: 'Created' },
            { key: 'balance', label: 'Account Balance' },
            { key: 'wins', label: 'Wins' },
            { key: 'commissions', label: 'Commissions' },
            { key: 'referrer_mobile', label: 'Referred by' },
            { key: 'referral_count', label: '# of Referrals' },
            { key: 'status', label: 'Player Status' },
            { key: 'action', label: 'Action' }
          ];
  
  const betsColumn = [
            { key: 'created_date', label: 'Date' },
            { key: 'created_time', label: 'Time' },
            { key: 'game_name', label: 'Game' },
            { key: 'game_type_name', label: 'Game Type' },
            { key: 'draw_date', label: 'Draw Date' },
            { key: 'draw_time', label: 'Draw Time' },
            { key: 'user_mobile', label: 'Player' },
            { key: 'bets', label: 'Combination' },
            { key: 'bet', label: 'Bet' },
            { key: 'jackpot', label: 'Reward' },
            { key: 'bakas_fullname', label: 'Client Name' },
            { key: 'bakas_bank', label: 'Client Bank' },
            { key: 'bakas_account', label: 'Client Account' },
            { key: 'status', label: 'Status' }
          ];

  const commissionsColumn = [
    { key: 'user', label: 'User' },
    { key: 'amount', label: 'Amount' },
    { key: 'referral', label: 'Referral' },
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
  ];

  const winnersColumn = [
    {key: 'created_date', label: 'Date'},
    {key: 'created_time', label: 'Time'},
    {key: 'draw_date', label: 'Draw Date'},
    {key: 'draw_time', label: 'Draw Time'},
    {key: 'game_name', label: 'Game'},
    {key: 'game_type', label: 'Game Type'},
    {key: 'user_mobile', label: 'Player'},
    {key: 'bets', label: 'Combination'},
    {key: 'bet', label: 'Bet'},
    {key: 'jackpot', label: 'Reward'},
    {key: 'status', label: 'Status'},
  ]

  const totalCashinColumn = [
    { key: 'mobile', label: 'User' },
    { key: 'total_amount', label: 'Total Cashin' }
  ];

  const totalConversionColumn = [
    { key: 'mobile', label: 'User' },
    { key: 'total_amount', label: 'Total Conversion' }
  ];

  const totalBetsColumn = [
    { key: 'mobile', label: 'User' },
    { key: 'total_amount', label: 'Total Bets' }
  ];

  const formatExportData = (data: any[], columns: { key: string; label: string }[]) => {
    return data.map((row) => {
      const formattedRow: Record<string, any> = {};

      columns.forEach((column) => {
        const value = row[column.key];

        let formattedValue: any = '';

        if (column.key === 'referrer_mobile' || column.key === 'under_admin_mail') {
          formattedValue = String(value) === 'null' ? '' : String(value);
        } else if (
          column.key === 'has_maintaining_balance' ||
          column.key === 'employer' ||
          column.key === 'bypass_device'
        ) {
          formattedValue = String(value) === '' ? 'no' : String(value);
        } else if (column.label === 'Player Status') {
          formattedValue = String(value) === 'pending' ? 'Active' : 'Inactive';
        } else if (
          column.key === 'bet_commission_percent' ||
          column.key === 'level_one_percent' ||
          column.key === 'level_two_percent' ||
          column.key === 'nolimit_percent'
        ) {
          formattedValue = String(value) + '%';
        } else {
          formattedValue = String(value ?? '');
        }

        formattedRow[column.label] = formattedValue;
      });
      return formattedRow;
    });
  };

  const formattedCashinExportData = useMemo(() => {
    return formatExportData(transactionData, cashinTransactionColumn);
  }, [transactionData, cashinTransactionColumn]);

  const formattedCashoutExportData = useMemo(() => {
    return formatExportData(transactionData, cashoutTransactionColumn);
  }, [transactionData, cashoutTransactionColumn]);

  const formattedPlayersExportData = useMemo(() => {
    return formatExportData(transactionData, playersColumn);
  }, [transactionData, playersColumn]);

  const formattedBetsExportData = useMemo(() => {
    return formatExportData(transactionData, betsColumn);
  }, [transactionData, betsColumn]);

  const formattedCommissionsExportData = useMemo(() => {
    return formatExportData(transactionData, commissionsColumn);
  }, [transactionData, commissionsColumn]);

  const formattedWinnersExportData = useMemo(() => {
    return formatExportData(transactionData, winnersColumn);
  }, [transactionData, winnersColumn]);

  const formattedTotalCashinExportData = useMemo(() => {
    return formatExportData(transactionData, totalCashinColumn);
  }, [transactionData, totalCashinColumn]);

  const formattedTotalConversionExportData = useMemo(() => {
    return formatExportData(transactionData, totalConversionColumn);
  }, [transactionData, totalConversionColumn]);

  const formattedTotalBetsExportData = useMemo(() => {
    return formatExportData(transactionData, totalBetsColumn);
  }, [transactionData, totalBetsColumn]);

  const [activeTab, setActiveTab] = useState<'players' | 'cashin' | 'conversion' | 'bets'>('players');
  const tabs = ['players', 'cashin', 'conversion', 'bets'] as const;

  // Set appropriate transaction data based on metric type
  useEffect(() => {
      if (user && !dbUpdated) {
        const handleUpdate = async () => {
          const dataUpdated = await loginAdmin(user, getAccessTokenSilently);
          if (dataUpdated.dbUpdate) {
            setDbUpdated(dataUpdated.dbUpdate);
            setUserID(dataUpdated.userID);
            setPermissionsString(JSON.parse(dataUpdated.permissions));
            setLoading(false);
            const adminData = await getPlayersAdminChoice();
            setAdminChoice(adminData);
          } else {
            alert("UNAUTHORIZED USER!");
            logout({ logoutParams: { returnTo: window.location.origin } });
          }
        };
        handleUpdate();
      }
    }, [user, dbUpdated, getAccessTokenSilently, logout, metricId]);

    useEffect(() => {
      try {
        console.log('initializing..');

        const handleUpdate = async () => {
          setSearchParams({
            startDate: startDate,
            endDate: endDate,
            status: playerStatus
          });
          const dataUpdated = await loginAdmin(user, getAccessTokenSilently);
          if (metricId === "total-cash-outs-paid") {
              const dataHourly = await cashoutHourlyDataTeam(startDate, endDate, dataUpdated.userID);
              const completeData = normalizeHourlyData(dataHourly);
              setHourlyData(completeData);

              const totalCashoutCommission = await totalCashoutFromCommissionsTeam(startDate, endDate, dataUpdated.userID);
              setCashoutFromCommission(totalCashoutCommission.count);

              const totalCashoutWinnings = await totalCashoutFromWinningsTeam(startDate, endDate, dataUpdated.userID);
              setCashoutFromWinnings(totalCashoutWinnings.count);

              const data = await getCashoutDataTeam(startDate, endDate, dataUpdated.userID);
              const cleanedData = data.map(row => {
                const cleanedRow: Record<string, any> = {};
                Object.keys(row).forEach(key => {
                  cleanedRow[key] = row[key] ?? '';
                });
                return cleanedRow;
              });
              setTransactionData(cleanedData);
            } else if (metricId === "total-bets-earned" || metricId === "total-free-bets" || metricId === "total-bets-conversions") {
              const totalBetsEarnedCount= await countBetsEarnedTeam(dataUpdated.userID,startDate,endDate);
              setTotalBetsEarned(totalBetsEarnedCount.count);

              const betsEarnedFreeCredits= await countBetsEarnedFreeCreditsTeam(dataUpdated.userID,startDate,endDate);
              setTotalBetsFreeCredits(betsEarnedFreeCredits.count);

              const totalSelfBetsEarnedCount= await countSelfBetsEarnedTeam(startDate,endDate,dataUpdated.userID);
              setSelfTotalBetsEarned(totalSelfBetsEarnedCount.count);

              const totalClientBetsEarnedCount= await countClientBetsEarnedTeam(startDate,endDate,dataUpdated.userID);
              setTotalClientBetsEarned(totalClientBetsEarnedCount.count);

              const newData = [];
              const newGameTypeData = {};

              const betWin2PM = await getBetsWinsPerTimeSlotTeam(startDate, endDate, '02:00:00 pm',dataUpdated.userID);
              newData.push({ time: "2:00 PM", games: betWin2PM });

              const betWin5PM = await getBetsWinsPerTimeSlotTeam(startDate, endDate, '05:00:00 pm',dataUpdated.userID);
              newData.push({ time: "5:00 PM", games: betWin5PM });

              const betWin9PM = await getBetsWinsPerTimeSlotTeam(startDate, endDate, '09:00:00 pm',dataUpdated.userID);
              newData.push({ time: "9:00 PM", games: betWin9PM });

              const betWin2D = await getBetsWinsPerGameTypeTeam(startDate, endDate, '2D',dataUpdated.userID);
              newGameTypeData["2D"] = [...betWin2D];

              const betWin3D = await getBetsWinsPerGameTypeTeam(startDate, endDate, '3D',dataUpdated.userID);
              newGameTypeData["3D"] = [...betWin3D];

              const betWin4D = await getBetsWins4DTeam(startDate, endDate,dataUpdated.userID);
              newGameTypeData["4D"] = [
                { game: 'TOTAL BETS', bets: betWin4D[0].bets, wins: '' },
                { game: 'TOTAL WINS', bets: betWin4D[0].wins, wins: '' }
              ];

              const betWinPick3 = await getBetsWinsPerGameTeam(startDate, endDate, 'Pick 3: ',dataUpdated.userID);
              newGameTypeData["PICK 3"] = [...betWinPick3];

              const betWinFirst2 = await getBetsWinsPerGameTeam(startDate, endDate, 'First 2: ',dataUpdated.userID);
              newGameTypeData["FIRST TWO"] = [...betWinFirst2];

              setTimeSlotBetData(newData);
              setGameTypeBetData(newGameTypeData);

              const data = await getBetsDataTeam(startDate, endDate,dataUpdated.userID);
              const cleanedData = data.map(row => {
                const cleanedRow: Record<string, any> = {};
                Object.keys(row).forEach(key => {
                  cleanedRow[key] = row[key] ?? '';
                });
                return cleanedRow;
              });
              setTransactionData(cleanedData);
            } else if (metricId === "total-cash-in") {
              const dataHourly = await cashinHourlyDataTeam(startDate, endDate, dataUpdated.userID);
              const completeData = normalizeHourlyData(dataHourly);
              setHourlyData(completeData);

              const data = await getCashinDataTeam(startDate, endDate, dataUpdated.userID);
              const cleanedData = data.map(row => {
                const cleanedRow: Record<string, any> = {};
                Object.keys(row).forEach(key => {
                  cleanedRow[key] = row[key] ?? '';
                });
                return cleanedRow;
              });
              setTransactionData(cleanedData);
            } else if ( metricId === "total-commissions") {
              const totalComm = await totalCommissionsTeam(dataUpdated.userID,startDate,endDate);
              setTotalCommissionsCount(totalComm.count);

              const data = await getCommissionsDataTeam(startDate, endDate, dataUpdated.userID);
              console.log(data)
              const cleanedData = data.map(row => {
                const cleanedRow: Record<string, any> = {};
                Object.keys(row).forEach(key => {
                  cleanedRow[key] = row[key] ?? '';
                });
                return cleanedRow;
              });
              setTransactionData(cleanedData);
            } else if (metricId === "total-wins") {
              const totalWinnings = await totalWinsTeam(dataUpdated.userID,startDate,endDate);
              setTotalWinsCount(totalWinnings.count);

              const data = await getWinnersDataTeam(startDate, endDate, dataUpdated.userID);
              const cleanedData = data.map(row => {
                const cleanedRow: Record<string, any> = {};
                Object.keys(row).forEach(key => {
                  cleanedRow[key] = row[key] ?? '';
                });
                return cleanedRow;
              });
              setTransactionData(cleanedData);
            } else {
              if (activeTab === "players")
              {
                if (playerStatus === "all") {
                const data5= await totalPlayersTeam( dataUpdated.userID,startDate,endDate);
                setTotalPlayersAmount(data5.count);
                } else if (playerStatus === "active") {
                    const data5= await totalPlayersActiveTeam(dataUpdated.userID,startDate,endDate);
                    setTotalPlayersAmount(data5.count);
                } else {
                    const data5= await totalPlayersInactiveTeam(startDate,endDate, dataUpdated.userID);
                    setTotalPlayersAmount(data5.count);
                }

                const data = await getPlayersDataTeam(startDate, endDate, playerStatus === 'active' ? 'pending' : playerStatus === 'inactive' ? 'verification' : playerStatus, dataUpdated.userID);
                const cleanedData = data.map(row => {
                    const cleanedRow: Record<string, any> = {};
                    Object.keys(row).forEach(key => {
                    cleanedRow[key] = row[key] ?? '';
                    });
                    return cleanedRow;
                });
                setTransactionData(cleanedData);
              } else if (activeTab === "cashin") {
                const data = await getTotalCashinDataTeam(startDate, endDate, dataUpdated.userID);
                const cleanedData = data.map(row => {
                    const cleanedRow: Record<string, any> = {};
                    Object.keys(row).forEach(key => {
                    cleanedRow[key] = row[key] ?? '';
                    });
                    return cleanedRow;
                });
                setTransactionData(cleanedData);
              } else if (activeTab === 'conversion') {
                const data = await getTotalConversionDataTeam(startDate, endDate, dataUpdated.userID);
                const cleanedData = data.map(row => {
                    const cleanedRow: Record<string, any> = {};
                    Object.keys(row).forEach(key => {
                    cleanedRow[key] = row[key] ?? '';
                    });
                    return cleanedRow;
                });
                setTransactionData(cleanedData);
              } else {
                const data = await getTotalBetsDataTeam(startDate, endDate, dataUpdated.userID);
                const cleanedData = data.map(row => {
                    const cleanedRow: Record<string, any> = {};
                    Object.keys(row).forEach(key => {
                    cleanedRow[key] = row[key] ?? '';
                    });
                    return cleanedRow;
                });
                setTransactionData(cleanedData);
              }
            }
        };
        handleUpdate();
      } catch (error) {
        
      }
    }, [startDate, endDate, playerStatus, metricId, activeTab]);

  const addBalancePermission = permissionsString.includes("add_balance");
  const cashinPermission = permissionsString.includes("team_cashin");
  const cashoutPermission = permissionsString.includes("team_cashout");

  // Render cash in view
  const renderCashInView = () => (
    <>
      {/* Total Value Display */}
      <div className="mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">TOTAL {metricTitle.replace(" HISTORY", "")}</span>
              <span className="font-bold">₱{totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly History Table */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-center font-bold bg-cyan-500 text-white py-2 px-4 flex-grow">HOURLY {metricTitle.replace(" HISTORY", "")}</h2>
          <ExportButton 
            data={hourlyExportData} 
            filename={`hourly_${metricId}_data`} 
            className="ml-2"
          />
        </div>
        <div className="border overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr>
                {hourlyData.map((item, index) => (
                  <th key={index} className="border p-2 text-center whitespace-nowrap">{item.hour}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {hourlyData.map((item, index) => (
                  <td key={index} className="border p-2 text-center whitespace-nowrap">
                    {item.value > 0 ? `₱${Number(item.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Table */}
      <div>
        <div className="flex justify-between items-center mb-2">
          {/* <div className="bg-cyan-100 p-2 text-center text-sm flex-grow">
            Note: Each column with sort and filter. Enable file download.
          </div> */}
          <ExportButton 
            data={formattedCashinExportData} 
            filename={`transactions_${metricId}`} 
            className="ml-2"
          />
        </div>
        
        <SortableTable 
          data={transactionData}
          setData={setTransactionData}
          startDate={startDate}
          endDate={endDate}
          playerStatus={playerStatus}
          columns={cashinTransactionColumn}
          addBalancePermission={addBalancePermission}
          adminChoice={adminChoice}
        />
      </div>
    </>
  );

  // Render cash out view
  const renderCashOutView = () => (
    <>
      {/* Cash Out Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">TOTAL CASH OUT</span>
              <span className="font-bold">₱{totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">CASH OUT FROM COMMISSIONS</span>
              <span className="font-bold">₱{cashoutFromCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">CASH OUT FROM WINNINGS</span>
              <span className="font-bold">₱{cashoutFromWinnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly History Table */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-center font-bold bg-cyan-500 text-white py-2 px-4 flex-grow">HOURLY CASH OUT HISTORY</h2>
          <ExportButton 
            data={hourlyExportData} 
            filename="hourly_cash_out_data" 
            className="ml-2"
          />
        </div>
        <div className="border overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr>
                {hourlyData.map((item, index) => (
                  <th key={index} className="border p-2 text-center whitespace-nowrap">{item.hour}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {hourlyData.map((item, index) => (
                  <td key={index} className="border p-2 text-center whitespace-nowrap">
                    {item.value > 0 ? `₱${item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Table */}
      <div>
        <div className="flex justify-between items-center mb-2">
          {/* <div className="bg-cyan-100 p-2 text-center text-sm flex-grow">
            Note: Each column with sort and filter. Enable file download.
          </div> */}
          <ExportButton 
            data={formattedCashoutExportData} 
            filename="cash_out_transactions" 
            className="ml-2"
          />
        </div>
        
        <SortableTable 
          data={transactionData}
          setData={setTransactionData}
          startDate={startDate}
          endDate={endDate}
          playerStatus={playerStatus}
          columns={cashoutTransactionColumn}
          addBalancePermission={addBalancePermission}
          adminChoice={adminChoice}
        />
      </div>
    </>
  );

  // Render players view
  const renderPlayersView = () => (
    <>
      {/* Total Value Display */}
      <div className="mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">TOTAL {metricTitle.replace(" HISTORY", "")}</span>
              <span className="font-bold">{totalPlayersAmount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {tabs
      .filter(tab => {
      if (tab === "cashin" && !cashinPermission) return false; // 👈 hide cashin if no permission
      return true;
      }).map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm 
                border border-gray-300 rounded-md ml-2 mb-6
                ${activeTab === tab ? 'bg-cyan-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
                {tab}
            </button>
            ))}

      {/* Transaction Details Table */}
      {activeTab === "players" ? (
        <div>
        <div className="flex justify-between items-center mb-2">
          {/* <div className="bg-cyan-100 p-2 text-center text-sm flex-grow">
            Note: Each column with sort and filter. Enable file download.
          </div> */}
          <ExportButton 
            data={formattedPlayersExportData} 
            filename={`transactions_${metricId}`} 
            className="ml-2"
          />
          <div>
            <select
              name="status"
              value={playerStatus}
              onChange={(e) => setPlayerStatus(e.target.value)}
              className="block w-full px-0 py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="all">
                All
              </option>
              <option value="active">
                Active
              </option>
              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>
        </div>
        
        <SortableTable 
          data={transactionData}
          setData={setTransactionData}
          startDate={startDate}
          endDate={endDate}
          playerStatus={playerStatus}
          columns={playersColumn}
          addBalancePermission={addBalancePermission}
          adminChoice={adminChoice}
        />
      </div>
      ) : activeTab === "cashin" ? (
        <div>
        <div className="flex justify-between items-center mb-2">
          {/* <div className="bg-cyan-100 p-2 text-center text-sm flex-grow">
            Note: Each column with sort and filter. Enable file download.
          </div> */}
          <ExportButton 
            data={formattedCashinExportData} 
            filename={`transactions_${metricId}`} 
            className="ml-2"
          />
        </div>
        
        <SortableTable 
          data={transactionData}
          setData={setTransactionData}
          startDate={startDate}
          endDate={endDate}
          playerStatus={playerStatus}
          columns={totalCashinColumn}
          addBalancePermission={addBalancePermission}
          adminChoice={adminChoice}
        />
      </div>
      ) : activeTab === "conversion" ? (
        <div>
        <div className="flex justify-between items-center mb-2">
          {/* <div className="bg-cyan-100 p-2 text-center text-sm flex-grow">
            Note: Each column with sort and filter. Enable file download.
          </div> */}
          <ExportButton 
            data={formattedTotalConversionExportData} 
            filename={`transactions_${metricId}`} 
            className="ml-2"
          />
        </div>
        
        <SortableTable 
          data={transactionData}
          setData={setTransactionData}
          startDate={startDate}
          endDate={endDate}
          playerStatus={playerStatus}
          columns={totalConversionColumn}
          addBalancePermission={addBalancePermission}
          adminChoice={adminChoice}
        />
      </div>
      ) : (
        <div>
        <div className="flex justify-between items-center mb-2">
          {/* <div className="bg-cyan-100 p-2 text-center text-sm flex-grow">
            Note: Each column with sort and filter. Enable file download.
          </div> */}
          <ExportButton 
            data={formattedTotalBetsExportData} 
            filename={`transactions_${metricId}`} 
            className="ml-2"
          />
        </div>
        
        <SortableTable 
          data={transactionData}
          setData={setTransactionData}
          startDate={startDate}
          endDate={endDate}
          playerStatus={playerStatus}
          columns={totalBetsColumn}
          addBalancePermission={addBalancePermission}
          adminChoice={adminChoice}
        />
      </div>
      )}
      
    </>
  );

  // Render bet history view
  const renderBetHistoryView = () => (
    <>
      {/* Bet Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-center">
              <span className="w-1/2 font-bold">TOTAL BETS EARNED</span>
              <span className="w-1/2 font-bold text-right">₱{totalBetsEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <span className="font-bold w-1/2">TOTAL SELF BETS EARNED</span>
              <span className="font-bold w-1/2 text-right">₱{totalSelfBetsEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold w-1/2">TOTAL BETS FROM NON-REGISTERED PLAYER</span>
              <span className="font-bold w-1/2 text-right">₱{totalClientBetsEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>

        {/* <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold w-1/2">TOTAL BETS FROM FREE CREDITS</span>
                      <span className="font-bold w-1/2 text-right">₱{totalBetsFreeCredits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </CardContent>
                </Card> */}

        {/* <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">PAID BETS</span>
              <span className="font-bold">₱{betBreakdownData.paidBets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-100">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">FREE BETS</span>
              <span className="font-bold">₱{betBreakdownData.freeBets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Time Slot Bets Section */}
      <div className="mb-6">
        <div className="bg-cyan-500 text-white py-2 px-4 text-center font-bold mb-4">
          TOTAL BETS vs WINS PER TIME SLOT
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {timeSlotBetData.map((timeSlot, index) => (
            <div key={index} className="space-y-2">
              <div className="bg-yellow-100 p-2 font-bold text-center">
                {timeSlot.time}
              </div>
              <GameTable data={timeSlot.games} />
            </div>
          ))}
        </div>
      </div>

      {/* Game-specific Bets Section */}
      <div className="mb-6">
        <div className="bg-cyan-500 text-white py-2 px-4 text-center font-bold mb-4">
          TOTAL BETS PER GAME
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* 2D Games */}
          <GameTable data={gameTypeBetData["2D"]} title="2D" />

          {/* PICK 3 Games */}
          <GameTable data={gameTypeBetData["PICK 3"]} title="PICK 3" />

          {/* FIRST TWO Games */}
          <GameTable data={gameTypeBetData["FIRST TWO"]} title="FIRST TWO" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* 3D Games */}
          <GameTable data={gameTypeBetData["3D"]} title="3D" />

          {/* 4D Games */}
          <GameTable data={gameTypeBetData["4D"]} title="4D" />
        </div>
      </div>

      {/* Transaction Details Table */}
      <div>
        <div className="flex justify-between items-center mb-2">
          {/* <div className="bg-cyan-100 p-2 text-center text-sm flex-grow">
            Note: Each column with sort and filter. Enable file download.
          </div> */}
          <ExportButton 
            data={formattedBetsExportData} 
            filename="bet_transactions" 
            className="ml-2"
          />
        </div>
        
        <SortableTable 
          data={transactionData}
          setData={setTransactionData}
          startDate={startDate}
          endDate={endDate}
          playerStatus={playerStatus}
          columns={betsColumn}
          addBalancePermission={addBalancePermission}
          adminChoice={adminChoice}
        />
      </div>
    </>
  );

  // Render commission nad winners view
  const renderCommmissionWinnersView = () => (
    <>
      {/* Total Value Display */}
      <div className="mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">TOTAL {metricTitle.replace(" HISTORY", "")}</span>
              <span className="font-bold">₱{(metricId === 'total-commissions' ? totalCommissionsCount : totalWinsCount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Details Table */}
      <div>
        <div className="flex justify-between items-center mb-2">
          {/* <div className="bg-cyan-100 p-2 text-center text-sm flex-grow">
            Note: Each column with sort and filter. Enable file download.
          </div> */}
          <ExportButton 
            data={metricId === 'total-commissions' ? formattedCommissionsExportData : formattedWinnersExportData} 
            filename={`transactions_${metricId}`} 
            className="ml-2"
          />
        </div>
        
        <SortableTable 
          data={transactionData}
          setData={setTransactionData}
          startDate={startDate}
          endDate={endDate}
          playerStatus={playerStatus}
          columns={metricId === 'total-commissions' ? commissionsColumn : winnersColumn}
          addBalancePermission={addBalancePermission}
          adminChoice={adminChoice}
        />
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-cyan-500 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-center">{metricTitle}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Back button and date picker */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => navigate('/teamdashboard')}
          >
            <ArrowLeft size={16} />
            Back to Team Dashboard
          </Button>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm">START DATE</span>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full sm:w-auto border rounded px-2 py-1"
              />
              <span className="text-sm">END DATE</span>
              <input
                type="date"
                id="startDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full sm:w-auto border rounded px-2 py-1"
              />
            </div>
            {/* <ExportButton 
              data={transactionData} 
              filename={`${metricId}_history_data`} 
            /> */}
          </div>
        </div>

        {/* Render appropriate view based on metric type */}
        {metricId === "total-cash-outs-paid" 
          ? renderCashOutView() 
          : metricId === "total-bets-earned" || metricId === "total-free-bets" || metricId === "total-bets-conversions"
            ? renderBetHistoryView()
            : metricId === "total-cash-in" ? renderCashInView() 
            : metricId === "total-wins" || metricId === "total-commissions" ? renderCommmissionWinnersView()
            : renderPlayersView()}
      </div>
    </div>
  );
}