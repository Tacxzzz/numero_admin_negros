import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { formatPeso, formatUSD, getTransCode } from "./utils/utils";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { useAuth0 } from '@auth0/auth0-react';


export function Logs() {
  
  const [logs, setLogs] = useState<any[]>([]);

  
  useEffect(() => {
    const handleUpdate = async () => {
      
        //const getTransData = await getLogsAll();
        //setLogs(getTransData);
      
    };
    handleUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

  
  return <div>Not allowed to manage this page</div>
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead >Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead className="w-[200px]">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs && logs.length > 0 ? (
            logs.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {transaction.date}
                </TableCell>
                <TableCell>
                  {transaction.user_first_name} {transaction.user_last_name}
                </TableCell>
                <TableCell>
                  {transaction.admin_first_name} {transaction.admin_last_name}
                </TableCell>
                <TableCell>
                  {transaction.activity}
                </TableCell>
                <TableCell>
                  {transaction.note}
                </TableCell>
                
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                No transactions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}