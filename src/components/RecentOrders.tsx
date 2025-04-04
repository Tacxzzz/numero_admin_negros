import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {  loginAdmin } from "./api/apiCalls";
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


export function RecentOrders() {
  const { user,getAccessTokenSilently , logout} = useAuth0();
  const [userID, setUserID] = useState("none");
  const [dbUpdated, setDbUpdated] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  
  useEffect(() => {
    const handleUpdate = async () => {
      const dataUpdated= await loginAdmin(user,getAccessTokenSilently);
      if(dataUpdated.dbUpdate)
      {
        setDbUpdated(dataUpdated.dbUpdate);
        setUserID(dataUpdated.userID);
        setLoading(false);
      }
      else
      {
        alert("UNAUTHORIZED USER!");
        logout({ logoutParams: { returnTo: window.location.origin } });
      }
    };
    handleUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateClick = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  


    if (loading ) {
      return <div>...</div>;
    }


    const betTransactions = [
      {
        id: "2D001",
        gametype: "2D",
        date: "2024-01-15",
        player: "John Doe",
        amount: "₱1125.99",
        status: "Completed",
      },
      {
        id: "3D001",
        gametype: "3D",
        date: "2024-01-14",
        player: "Jane Smith",
        amount: "₱125.99",
        status: "Pending",
      },
      {
        id: "3DS01",
        gametype: "3D",
        date: "2024-01-13",
        player: "Bob Johnson",
        amount: "₱199.99",
        status: "Failed",
      },
      {
        id: "4D001",
        gametype: "4D",
        date: "2024-01-12",
        player: "Rey Johnson",
        amount: "₱599.99",
        status: "Completed",
      },
    ];

    const filteredTransactions = betTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date).getTime();
      const start = startDate ? new Date(startDate).getTime() : null;
      const end = endDate ? new Date(endDate).getTime() : null;
  
      return (
        (!start || transactionDate >= start) &&
        (!end || transactionDate <= end)
      );
    });

    const resetDateFilters = () => {
      setStartDate("");
      setEndDate("");
    };

  return (
    <div className="overflow-x-auto">
    <div className="mb-4 flex flex-wrap justify-end items-center gap-4">
      <div className="w-full sm:w-auto">
        <label htmlFor="startDate" className="block text-sm font-medium">
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full sm:w-auto border rounded px-2 py-1"
        />
      </div>
      <div className="w-full sm:w-auto">
        <label htmlFor="endDate" className="block text-sm font-medium">
          End Date
        </label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full sm:w-auto border rounded px-2 py-1"
        />
      </div>
      <div className="w-full sm:w-auto">
        <Button
          onClick={resetDateFilters}
          className="w-full sm:w-auto mt-4 px-4 py-2 bg-gray-500 text-white rounded"
        >
          Reset
        </Button>
      </div>
    </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="text-center">Game Type</TableHead>
            <TableHead className="text-center">Date</TableHead>
            <TableHead className="text-center">Player</TableHead>
            {/* <TableHead>Recipient</TableHead> */}
            <TableHead className="text-center">Amount</TableHead>
            <TableHead className="text-center">Status</TableHead>
            {/* <TableHead>Update</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>


        {filteredTransactions.map((betTransactions) => (
            <TableRow key={betTransactions.id}>
              <TableCell className="font-medium">{betTransactions.id}</TableCell>
              <TableCell className="text-center">{betTransactions.gametype}</TableCell>
              <TableCell className="text-center">{betTransactions.date}</TableCell>
              <TableCell className="text-center">{betTransactions.player}</TableCell>
              <TableCell className="text-center">{betTransactions.amount}</TableCell>
              <TableCell className="text-center">{betTransactions.status}</TableCell>
            </TableRow>
          ))}


          {/* {transactions && transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  DTAKA{getTransCode(transaction.date)}{transaction.id}
                </TableCell>
                <TableCell>
                  {transaction.trans_type === "remit" ? (
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 border-blue-300"
                    >
                      Remit
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 border-green-300"
                    >
                      Redeem
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {transaction.date}
                </TableCell>
                <TableCell>
                  {transaction.sender_first_name} {transaction.sender_last_name}
                </TableCell>
                <TableCell>
                  {transaction.trans_type === "remit" ? (
                    <>
                      {transaction.recipient_first_name}{" "}
                      {transaction.recipient_last_name}
                    </>
                  ) : (
                    <> - </>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {formatPeso(transaction.amount)}
                </TableCell>
                <TableCell>
                  {transaction.status === "success" ? (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 border-green-300"
                    >
                      Success
                    </Badge>
                  ) : transaction.status === "processing" ? (
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 border-yellow-300"
                    >
                      Processing
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-red-100 text-red-800 border-red-300"
                    >
                      Failed
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {(transaction.status === "processing" || transaction.status === "failed") ? (
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                      <DialogTrigger asChild>
                        <Badge
                          variant="outline"
                          style={{ cursor: "pointer" }}
                          className={
                            transaction.status === "processing"
                              ? "bg-blue-100 text-blue-800 border-blue-300"
                              : "bg-red-100 text-red-800 border-red-300"
                          }
                          onClick={() => handleUpdateClick(transaction)}
                        >
                          {transaction.status === "processing" ? "Update" : "Re-Process"}
                        </Badge>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Transaction Details</DialogTitle>
                        </DialogHeader>
                        {selectedTransaction && (
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-500">Order ID</p>
                              <p className="font-medium">
                                DTAKA{getTransCode(selectedTransaction.date)}
                                {selectedTransaction.id}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Bank</p>
                              <p className="font-medium">
                                {selectedTransaction.bank || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Account Number
                              </p>
                              <p className="font-medium">
                                {selectedTransaction.account_number || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Account Name
                              </p>
                              <p className="font-medium">
                                {selectedTransaction.full_name || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Notes</p>
                              <textarea 
                              className="col-span-2 border rounded-md p-2 w-full text-gray-700 resize-none"
                              placeholder="Enter notes (optional)..."
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                            ></textarea>
                              
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                              <Button
                                variant="default"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => {
                                  handleApprove(transaction);
                                  setIsModalOpen(false);
                                }}
                              >
                                Set as Processed
                              </Button>
                              <Button
                                variant="default"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => {
                                  handleReject(transaction);
                                  setIsModalOpen(false);
                                }}
                              >
                                Set as Failed
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <> - </>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                No transactions found.
              </TableCell>
            </TableRow>
          )} */}


        </TableBody>
      </Table>
    </div>
  );
}