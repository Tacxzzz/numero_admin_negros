import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  backupAndCleanupDBLOGS,
  backupAndCleanupLOGS,
  createDraws,
  getTodayDraws,
  getWebData,
  loginAdmin,
  setDoubleDraw,
  setTripleDraw,
} from "./api/apiCalls";
import { useAuth0 } from "@auth0/auth0-react";
import { getFormattedDate } from "./utils/utils";

// ✅ Interface for draw results
interface DrawResult {
  id: number;
  drawDate: Date;
  drawTime: string;
  numbers: string;
}

export function DrawsResults() {
  const { user, getAccessTokenSilently, logout } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [dbUpdated, setDbUpdated] = useState(false);
  const [permissionsString, setPermissionsString] = useState<string[]>([]);
  const [draws, setDraws] = useState<any[]>([]);
  const [savedResults, setSavedResults] = useState<DrawResult[]>([]);

  // ✅ State for new result form
  const [drawDate, setDrawDate] = useState<Date | null>(new Date());
  const [drawTime, setDrawTime] = useState<string>("");
  const [numbers, setNumbers] = useState<string>("");
  // ✅ State for numbers separated
  const [digit1, setDigit1] = useState<string>("");
  const [digit2, setDigit2] = useState<string>("");
  const [digit3, setDigit3] = useState<string>("");

  // Helper for enforcing 1–40
  const clampNumber = (val: string) => {
    let n = parseInt(val, 10);
    if (isNaN(n)) return "";
    if (n < 1) n = 1;
    if (n > 40) n = 40;
    return String(n);
  };

  useEffect(() => {
    if (user && !dbUpdated) {
      const handleUpdate = async () => {
        const dataUpdated = await loginAdmin(user, getAccessTokenSilently);
        if (dataUpdated.dbUpdate) {
          setDbUpdated(dataUpdated.dbUpdate);
          setPermissionsString(JSON.parse(dataUpdated.permissions));
          setLoading(false);
        } else {
          alert("UNAUTHORIZED USER!");
          localStorage.setItem("isLoggedIn", "false");
          logout({ logoutParams: { returnTo: window.location.origin } });
        }
      };
      handleUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!permissionsString.includes("draws_results")) {
    return <div>Not allowed to manage this page</div>;
  }

  const handleBackup = async () => {
    const result = await backupAndCleanupDBLOGS();
    alert(result === "yes" ? "Backup successful!" : "Backup failed.");
  };

  const handleBackupAuditLogs = async () => {
    const result = await backupAndCleanupLOGS();
    alert(result === "yes" ? "Backup successful!" : "Backup failed.");
  };

  const createDrawsClicked = async () => {
    const result = await createDraws();
    alert(result === true ? "Created Draws Successfully!" : "Failed to create draws.");
  };

  // ✅ Format functions
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    // convert "HH:mm" to Date
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0); // ✅ force seconds and ms to 0

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit", // will always show "00"
      hour12: true,
    });
  };

  const handleSaveResult = async () => {
    if (!drawDate || !drawTime || !digit1 || !digit2 || !digit3) return;

    const formattedDate = formatDate(drawDate);   // "09/02/2025"
    const formattedTime = formatTime(drawTime);   // "02:00:00 PM"

    const numbers = `${digit1}-${digit2}-${digit3}`; // ✅ join into 1-2-3

    const newResult: DrawResult = {
      id: Date.now(),
      drawDate,
      drawTime: formattedTime,
      numbers,
    };

    setSavedResults([...savedResults, newResult]);

    // ✅ Build FormData
    const formData = new FormData();
    formData.append("date", formattedDate);
    formData.append("time", formattedTime);
    formData.append("results", numbers);

    console.log("Sending to API:", Object.fromEntries(formData.entries()));

    const successTriple = await setTripleDraw(formData);

    if (successTriple) {
      if (successTriple.authenticated) {
        alert("Draw result for Triple saved successfully!");
      } else {
        alert(successTriple.message ?? "Failed to save draw result.");
      }
    } else {
      alert("Error while saving draw result.");
    }

    const successDouble = await setDoubleDraw(formData);

    if (successDouble) {
      if (successDouble.authenticated) {
        alert("Draw result for Double saved successfully!");
      } else {
        alert(successDouble.message ?? "Failed to save draw result.");
      }
    } else {
      alert("Error while saving draw result.");
    }

  };

  if (loading) {
    return <div>...</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">SET DRAW RESULTS</h2>

        <div className="flex gap-2">
          <Button onClick={createDrawsClicked}>Create Draws</Button>
          <Button onClick={handleBackup}>Backup Logs</Button>
          <Button onClick={handleBackupAuditLogs}>Backup System Audit</Button>
        </div>
      </div>

      {/* ✅ Set Results Draw */}
      <div className="overflow-x-auto space-y-4">
        <Card>
          <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center">
            <DatePicker
              selected={drawDate}
              onChange={(date: Date | null) => setDrawDate(date)}
              dateFormat="MM/dd/yyyy"
              className="border p-2 rounded w-full sm:w-auto"
            />

            <Input
              type="time"
              value={drawTime}
              onChange={(e) => setDrawTime(e.target.value)}
              className="w-full sm:w-auto"
            />

            <div className="flex gap-2">
              <Input
                type="number"
                value={digit1}
                onChange={(e) => setDigit1(clampNumber(e.target.value))}
                placeholder="1–40"
                min={1}
                max={40}
                className="w-20"
              />
              <Input
                type="number"
                value={digit2}
                onChange={(e) => setDigit2(clampNumber(e.target.value))}
                placeholder="1–40"
                min={1}
                max={40}
                className="w-20"
              />
              <Input
                type="number"
                value={digit3}
                onChange={(e) => setDigit3(clampNumber(e.target.value))}
                placeholder="1–40"
                min={1}
                max={40}
                className="w-20"
              />
            </div>

            <Button onClick={handleSaveResult}>Save Result</Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
