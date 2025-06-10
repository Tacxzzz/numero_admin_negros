import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpDown, Search, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ExportButton } from "./export-button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

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

// Mock transaction data for cash out
const cashOutTransactionData = [
  { 
    date: "2023-05-30", 
    time: "07:15", 
    user: "John Doe", 
    clientNo: "CL-1234", 
    orderNo: "ORD-5678", 
    source: "Commissions", 
    amount: "₱25,000.00", 
    name: "John Doe",
    bank: "Chase Bank",
    account: "****1234",
    status: "Completed" 
  },
  { 
    date: "2023-05-30", 
    time: "07:32", 
    user: "Jane Smith", 
    clientNo: "CL-5678", 
    orderNo: "ORD-6789", 
    source: "Winnings", 
    amount: "₱25,000.00", 
    name: "Jane Smith",
    bank: "Bank of America",
    account: "****5678",
    status: "Completed" 
  },
  { 
    date: "2023-05-30", 
    time: "11:05", 
    user: "Robert Johnson", 
    clientNo: "CL-9012", 
    orderNo: "ORD-7890", 
    source: "Commissions", 
    amount: "₱5,000.00", 
    name: "Robert Johnson",
    bank: "Wells Fargo",
    account: "****9012",
    status: "Completed" 
  },
  { 
    date: "2023-05-30", 
    time: "00:12", 
    user: "Emily Davis", 
    clientNo: "CL-3456", 
    orderNo: "ORD-8901", 
    source: "Winnings", 
    amount: "₱1,000.00", 
    name: "Emily Davis",
    bank: "Citibank",
    account: "****3456",
    status: "Completed" 
  },
];

// Mock transaction data for cash in
const cashInTransactionData = [
  { id: 1001, date: "2023-05-30", time: "07:15", user: "John Doe", clientNo: "CL-1234", orderNo: "ORD-5678", amountPaid: "₱25,000.00", credit: "₱25,000.00", status: "Completed" },
  { id: 1002, date: "2023-05-30", time: "07:32", user: "Jane Smith", clientNo: "CL-5678", orderNo: "ORD-6789", amountPaid: "₱25,000.00", credit: "₱25,000.00", status: "Completed" },
  { id: 1003, date: "2023-05-30", time: "11:05", user: "Robert Johnson", clientNo: "CL-9012", orderNo: "ORD-7890", amountPaid: "₱5,000.00", credit: "₱5,000.00", status: "Completed" },
  { id: 1004, date: "2023-05-30", time: "00:12", user: "Emily Davis", clientNo: "CL-3456", orderNo: "ORD-8901", amountPaid: "₱1,000.00", credit: "₱1,000.00", status: "Completed" },
];

// Mock bet transaction data
const betTransactionData = [
  { 
    date: "2023-05-30", 
    time: "14:15", 
    game: "Target", 
    gameType: "2D", 
    player: "John Doe", 
    combination: "42", 
    betAmount: "₱100.00", 
    reward: "₱4,200.00", 
    playerFromAgent: "Yes",
    status: "Won" 
  },
  { 
    date: "2023-05-30", 
    time: "14:32", 
    game: "Rambol", 
    gameType: "3D", 
    player: "Jane Smith", 
    combination: "123", 
    betAmount: "₱50.00", 
    reward: "₱0.00", 
    playerFromAgent: "No",
    status: "Lost" 
  },
  { 
    date: "2023-05-30", 
    time: "17:05", 
    game: "Target", 
    gameType: "3D", 
    player: "Robert Johnson", 
    combination: "456", 
    betAmount: "₱75.00", 
    reward: "₱3,750.00", 
    playerFromAgent: "Yes",
    status: "Won" 
  },
  { 
    date: "2023-05-30", 
    time: "20:12", 
    game: "Pick 3", 
    gameType: "6/58", 
    player: "Emily Davis", 
    combination: "12-34-45", 
    betAmount: "₱20.00", 
    reward: "₱0.00", 
    playerFromAgent: "No",
    status: "Lost" 
  },
];

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

// Cash out breakdown data
const cashOutBreakdownData = {
  total: 56000.00,
  fromCommissions: 30000.00,
  fromWinnings: 26000.00
};

// Bet breakdown data
const betBreakdownData = {
  totalBetsEarned: 215780.00,
  totalSelfBetsEarned: 145320.00,
  totalBetsFromNonRegisteredPlayers: 70460.00,
  paidBets: 210350.00,
  freeBets: 5430.00
};

// Time slot bet data
const timeSlotBetData = [
  {
    time: "2:00 PM",
    games: [
      { game: "2D", bets: "₱1,250.00", wins: "₱4,200.00" },
      { game: "3D", bets: "₱750.00", wins: "₱0.00" },
      { game: "4D", bets: "₱500.00", wins: "₱0.00" }
    ]
  },
  {
    time: "5:00 PM",
    games: [
      { game: "2D", bets: "₱2,100.00", wins: "₱8,400.00" },
      { game: "3D", bets: "₱1,500.00", wins: "₱7,500.00" },
      { game: "4D", bets: "₱800.00", wins: "₱0.00" }
    ]
  },
  {
    time: "9:00 PM",
    games: [
      { game: "2D", bets: "₱3,200.00", wins: "₱12,800.00" },
      { game: "3D", bets: "₱2,400.00", wins: "₱12,000.00" },
      { game: "4D", bets: "₱1,200.00", wins: "₱0.00" },
      { game: "PICK 3 6/49", bets: "₱600.00", wins: "₱0.00" },
      { game: "PICK 3 6/55", bets: "₱450.00", wins: "₱0.00" },
      { game: "PICK 3 6/58", bets: "₱350.00", wins: "₱0.00" }
    ]
  }
];

// Game-specific bet data
const gameSpecificBetData = {
  "2D": [
    { game: "TARGET", bets: "₱4,500.00", wins: "₱18,000.00" },
    { game: "RAMBOL", bets: "₱2,050.00", wins: "₱7,400.00" }
  ],
  "3D": [
    { game: "TARGET", bets: "₱3,200.00", wins: "₱16,000.00" },
    { game: "RAMBOL", bets: "₱1,450.00", wins: "₱3,500.00" }
  ],
  "4D": [
    { game: "TOTAL BETS", bets: "₱2,500.00", wins: "₱0.00" },
    { game: "TOTAL WINS", bets: "₱0.00", wins: "₱0.00" }
  ],
  "PICK 3": [
    { game: "6/49", bets: "₱600.00", wins: "₱0.00" },
    { game: "6/55", bets: "₱450.00", wins: "₱0.00" },
    { game: "6/58", bets: "₱350.00", wins: "₱0.00" }
  ],
  "FIRST TWO": [
    { game: "6/42", bets: "₱300.00", wins: "₱0.00" },
    { game: "6/45", bets: "₱250.00", wins: "₱0.00" },
    { game: "6/49", bets: "₱200.00", wins: "₱0.00" },
    { game: "6/55", bets: "₱150.00", wins: "₱0.00" },
    { game: "6/58", bets: "₱100.00", wins: "₱0.00" }
  ]
};

// Generic sortable and filterable table component
interface SortableTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    label: string;
  }[];
  className?: string;
}

function SortableTable<T>({ data, columns, className }: SortableTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'ascending' | 'descending';
  } | null>(null);
  
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filteredData, setFilteredData] = useState<T[]>(data);

  // Handle sorting
  const requestSort = (key: keyof T) => {
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
    let sortedData = [...data];
    
    // Apply filters
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        sortedData = sortedData.filter(item => {
          const itemValue = String(item[key as keyof T]).toLowerCase();
          return itemValue.includes(filters[key].toLowerCase());
        });
      }
    });
    
    // Apply sorting
    if (sortConfig !== null) {
      sortedData.sort((a, b) => {
        const aValue = String(a[sortConfig.key]);
        const bValue = String(b[sortConfig.key]);
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
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
                            <ArrowUpDown className="ml-2 h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => requestSort(column.key)}>
                            Sort {sortConfig?.key === column.key && sortConfig?.direction === 'ascending' 
                              ? 'Descending' 
                              : 'Ascending'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center space-x-1">
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
                    </div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={`${index}-${String(column.key)}`} className="whitespace-nowrap">
                    {String(row[column.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-4">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
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
  const [filteredData, setFilteredData] = useState<typeof data>(data);

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
    let sortedData = [...data];
    
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
        const aValue = String(a[sortConfig.key]);
        const bValue = String(b[sortConfig.key]);
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
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
              {['GAME', 'BETS', 'WINS'].map((header, index) => (
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
                <td className="border p-2 text-center">{game.bets}</td>
                <td className="border p-2 text-center">{game.wins}</td>
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

export function MetricDetailView() {
  const { metricId } = useParams<{ metricId: string }>();
  const navigate = useNavigate();
  const [transactionData, setTransactionData] = useState<any[]>([]);
  
  // Get the title for the current metric
  const metricTitle = metricId ? metricTitles[metricId] || "METRIC HISTORY" : "METRIC HISTORY";
  
  // Total value (sum of all hourly values)
  const totalValue = hourlyData.reduce((sum, item) => sum + item.value, 0);

  // Set appropriate transaction data based on metric type
  useEffect(() => {
    if (metricId === "total-cash-outs-paid") {
      setTransactionData(cashOutTransactionData);
    } else if (metricId === "total-bets-earned" || metricId === "total-wins" || metricId === "total-free-bets" || metricId === "total-bets-conversions") {
      setTransactionData(betTransactionData);
    } else {
      setTransactionData(cashInTransactionData);
    }
  }, [metricId]);

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
          <h2 className="text-center font-bold bg-cyan-500 text-white py-2 px-4 flex-grow">HOURLY {metricTitle}</h2>
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
            data={cashInTransactionData} 
            filename={`transactions_${metricId}`} 
            className="ml-2"
          />
        </div>
        
        <SortableTable 
          data={cashInTransactionData}
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'date', label: 'Date' },
            { key: 'time', label: 'Time' },
            { key: 'user', label: 'User' },
            { key: 'clientNo', label: 'Client No' },
            { key: 'orderNo', label: 'Order No' },
            { key: 'amountPaid', label: 'Amount Paid' },
            { key: 'credit', label: 'Credit' },
            { key: 'status', label: 'Status' }
          ]}
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
              <span className="font-bold">₱{cashOutBreakdownData.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">CASH OUT FROM COMMISSIONS</span>
              <span className="font-bold">₱{cashOutBreakdownData.fromCommissions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">CASH OUT FROM WINNINGS</span>
              <span className="font-bold">₱{cashOutBreakdownData.fromWinnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
            data={cashOutTransactionData} 
            filename="cash_out_transactions" 
            className="ml-2"
          />
        </div>
        
        <SortableTable 
          data={cashOutTransactionData}
          columns={[
            { key: 'date', label: 'Date' },
            { key: 'time', label: 'Time' },
            { key: 'user', label: 'User' },
            { key: 'clientNo', label: 'Client No' },
            { key: 'orderNo', label: 'Order No' },
            { key: 'source', label: 'Source' },
            { key: 'amount', label: 'Amount' },
            { key: 'name', label: 'Name' },
            { key: 'bank', label: 'Bank' },
            { key: 'account', label: 'Account' },
            { key: 'status', label: 'Status' }
          ]}
        />
      </div>
    </>
  );

  // Render bet history view
  const renderBetHistoryView = () => (
    <>
      {/* Bet Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <Card className="bg-yellow-100">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">TOTAL BETS EARNED</span>
              <span className="font-bold">₱{betBreakdownData.totalBetsEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-100">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">TOTAL SELF BETS EARNED</span>
              <span className="font-bold">₱{betBreakdownData.totalSelfBetsEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">TOTAL BETS FROM NON-REGISTERED PLAYER</span>
              <span className="font-bold">₱{betBreakdownData.totalBetsFromNonRegisteredPlayers.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
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
        </Card>
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
          <GameTable data={gameSpecificBetData["2D"]} title="2D" />

          {/* PICK 3 Games */}
          <GameTable data={gameSpecificBetData["PICK 3"]} title="PICK 3" />

          {/* FIRST TWO Games */}
          <GameTable data={gameSpecificBetData["FIRST TWO"]} title="FIRST TWO" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* 3D Games */}
          <GameTable data={gameSpecificBetData["3D"]} title="3D" />

          {/* 4D Games */}
          <GameTable data={gameSpecificBetData["4D"]} title="4D" />
        </div>
      </div>

      {/* Transaction Details Table */}
      <div>
        <div className="flex justify-between items-center mb-2">
          {/* <div className="bg-cyan-100 p-2 text-center text-sm flex-grow">
            Note: Each column with sort and filter. Enable file download.
          </div> */}
          <ExportButton 
            data={betTransactionData} 
            filename="bet_transactions" 
            className="ml-2"
          />
        </div>
        
        <SortableTable 
          data={betTransactionData}
          columns={[
            { key: 'date', label: 'Date' },
            { key: 'time', label: 'Time' },
            { key: 'game', label: 'Game' },
            { key: 'gameType', label: 'Game Type' },
            { key: 'player', label: 'Player' },
            { key: 'combination', label: 'Combination' },
            { key: 'betAmount', label: 'Bet Amount' },
            { key: 'reward', label: 'Reward' },
            { key: 'playerFromAgent', label: 'If Player from agent' },
            { key: 'status', label: 'Status' }
          ]}
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
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm">START DATE</span>
              <input type="text" className="border p-1 w-32" value="01/01/2023" readOnly />
              <span className="text-sm">END DATE</span>
              <input type="text" className="border p-1 w-32" value="05/30/2023" readOnly />
            </div>
            <ExportButton 
              data={transactionData} 
              filename={`${metricId}_history_data`} 
            />
          </div>
        </div>

        {/* Render appropriate view based on metric type */}
        {metricId === "total-cash-outs-paid" 
          ? renderCashOutView() 
          : metricId === "total-bets-earned" || metricId === "total-wins" || metricId === "total-free-bets" || metricId === "total-bets-conversions"
            ? renderBetHistoryView()
            : renderCashInView()}
      </div>
    </div>
  );
}