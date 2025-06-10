import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, CreditCard, Clock } from "lucide-react";
import { ExportButton } from "./export-button";
import { useState } from "react";

// Data for export
const betsEarnedData = [
  { category: "SELF BETS", value: "$145,320.00" },
  { category: "NON-REGISTERED PLAYERS", value: "$70,460.00" }
];

const commissionsData = [
  { category: "PAID", value: "$24,275.25" },
  { category: "PENDING", value: "$5,643.75" },
  { category: "INELIGIBLE FOR CASH OUT", value: "$2,448.00" }
];

const cashOutsPaidData = [
  { category: "PRIZES", value: "$54,014.75" },
  { category: "COMMISSIONS", value: "$24,275.25" }
];

const cashOutsPendingData = [
  { category: "PRIZES", value: "$12,530.00" },
  { category: "COMMISSIONS", value: "$5,643.75" }
];

const cashOutsIneligibleData = [
  { category: "PRIZES", value: "$5,432.00" },
  { category: "COMMISSIONS", value: "$2,448.00" }
];

export function DetailedBreakdownSection() {
  const [activeTab, setActiveTab] = useState("paid");

  // Get the current cash outs data based on active tab
  const getCurrentCashOutsData = () => {
    switch (activeTab) {
      case "paid": return cashOutsPaidData;
      case "pending": return cashOutsPendingData;
      case "ineligible": return cashOutsIneligibleData;
      default: return cashOutsPaidData;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Total Bets Earned Breakdown */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-700">TOTAL BETS EARNED BREAKDOWN</CardTitle>
          <ExportButton 
            data={betsEarnedData} 
            filename="bets_earned_breakdown" 
            className="h-8 px-2 py-1 text-xs"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">SELF BETS</TableCell>
                <TableCell className="text-right">$145,320.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">NON-REGISTERED PLAYERS</TableCell>
                <TableCell className="text-right">$70,460.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Total Commissions Breakdown */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-700">TOTAL COMMISSIONS BREAKDOWN</CardTitle>
          <ExportButton 
            data={commissionsData} 
            filename="commissions_breakdown" 
            className="h-8 px-2 py-1 text-xs"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">PAID</TableCell>
                <TableCell className="text-right">$24,275.25</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">PENDING</TableCell>
                <TableCell className="text-right">$5,643.75</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INELIGIBLE FOR CASH OUT</TableCell>
                <TableCell className="text-right">$2,448.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Total Cash Outs Breakdown */}
      <Card className="lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-700">TOTAL CASH OUTS BREAKDOWN</CardTitle>
          <ExportButton 
            data={getCurrentCashOutsData()} 
            filename={`cash_outs_${activeTab}`} 
            className="h-8 px-2 py-1 text-xs"
          />
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="paid" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="paid" className="flex items-center justify-center">
                <span className="md:hidden"><DollarSign size={16} /></span>
                <span className="hidden md:inline">Paid</span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center justify-center">
                <span className="md:hidden"><Clock size={16} /></span>
                <span className="hidden md:inline">Pending</span>
              </TabsTrigger>
              <TabsTrigger value="ineligible" className="flex items-center justify-center">
                <span className="md:hidden"><CreditCard size={16} /></span>
                <span className="hidden md:inline">Ineligible</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="paid" className="p-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">PRIZES</TableCell>
                    <TableCell className="text-right">$54,014.75</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">COMMISSIONS</TableCell>
                    <TableCell className="text-right">$24,275.25</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="pending" className="p-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">PRIZES</TableCell>
                    <TableCell className="text-right">$12,530.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">COMMISSIONS</TableCell>
                    <TableCell className="text-right">$5,643.75</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="ineligible" className="p-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">PRIZES</TableCell>
                    <TableCell className="text-right">$5,432.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">COMMISSIONS</TableCell>
                    <TableCell className="text-right">$2,448.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}