import { useEffect, useState } from "react";
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
import { getDraws, getTodayDraws, getWebData, setResultsDraw } from "./api/apiCalls";
import { useAuth0 } from '@auth0/auth0-react';
import { loginAdmin,getGames, updateGame, getGamesTypes, updateGameType } from './api/apiCalls';
import { formatPeso, getFormattedDate, getTransCode } from './utils/utils';
import CountdownTimer from "./CountdownTimer";
import { useRef } from "react";


export function DrawsResults() {

  const { user,getAccessTokenSilently , logout} = useAuth0();
  const [showGameDialog, setshowGameDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userID, setUserID] = useState("none");
  const [dbUpdated, setDbUpdated] = useState(false);
  const [permissionsString, setPermissionsString] = useState([]);
  const [todaysDraws, setTodaysDraws] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [draws, setDraws] = useState([]);
  const triggeredMap = useRef(new Set()); // store triggered states
  const [savedResults, setSavedResults] = useState(new Set());
  const [failedResults, setFailedResults] = useState(new Set());





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

              if(permissionsString.includes("draws_results_unique"))
                {
                const todayData = await getTodayDraws();
                setGames(todayData); 


                console.log(todayData);
                 const allResults = [];

                 for (const draw of todayData) {
                  const data = await getWebData(draw.id); // data will be like { "1": [ {time, numbers}, ... ] }
                
                  const gameID = draw.id;
                  const results = data[gameID] || [];
                
                  allResults.push({
                    ...draw,
                    result: results
                  });
                }
                setDraws(allResults);
                console.log(allResults);
              
                }
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
    
      

  


  const formattedDate = getFormattedDate();

  const refetchResults = async (gameId) => {
    try {

      console.log("IS THIS CALLED?");
      const data = await getWebData(gameId);
      const newResults = data[gameId] || [];
  
      let updatedGame = null;
      console.log("IS THIS CALLED?"+newResults);
      setDraws((prevDraws) => {
        return prevDraws.map((game) => {
          if (game.id === gameId) {
            const oldResults = game.result || [];
            const nonEmptyNewResults = newResults.filter(
              (r) => r.numbers && r.numbers.trim() !== ""
            );
  
            const mergedResultsMap = new Map();
            oldResults.forEach((r) => mergedResultsMap.set(r.time, r));
            nonEmptyNewResults.forEach((r) => mergedResultsMap.set(r.time, r));
  
            const mergedResults = Array.from(mergedResultsMap.values()).sort(
              (a, b) => a.time.localeCompare(b.time)
            );
  
            updatedGame = {
              ...game,
              result: mergedResults,
            };
  
            return updatedGame;
          }
          return game;
        });
      });
  
      return updatedGame;
    } catch (err) {
      console.error("Failed to refetch draw results:", err);
      return null;
    }
  };
  
  
  
  
  
  

    const handleNumbersAvailable = (game, result) => {
      console.log("Numbers available!", result);
    };
    

    if (loading ) {
      return <div>...</div>;
    }
  
    if(!permissionsString.includes("draws_results_unique"))
    {
      return <div>Not allowed to manage this page</div>
    }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">WEB SCRAPE</h2>
      </div>


      {/* Table */}
      <div className="overflow-x-auto">
        <Card className="lg:col-span-7">
          <CardContent>
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Game</TableHead>
              <TableHead className="text-center">Time</TableHead>
              <TableHead className="text-center">Combination</TableHead>
              <TableHead className="text-center">Process</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
                {draws.map((game) =>
                  game.result?.map((res, index) => {
                    const key = `${game.id}-${res.time}`;
                    const alreadyTriggered = triggeredMap.current.has(key);

                    if (res.numbers !== "" && !alreadyTriggered) {
                      triggeredMap.current.add(key);
                      handleNumbersAvailable(game, res);
                    }

                    return (
                      <TableRow key={`${game.id}-${res.time}-${res.numbers}`}>
                        <TableCell className="text-center">{game.name}</TableCell>
                        <TableCell className="text-center">{res.time}</TableCell>
                        <TableCell className="text-center">{res.numbers}</TableCell>
                        <TableCell className="text-center">
                        {savedResults.has(`${game.id}-${res.time}`) ? (
                          <span>✅</span>
                        ) : failedResults.has(`${game.id}-${res.time}`) && res.numbers ? (
                          <span>DONE</span>
                        ) : (
                          <CountdownTimer
                            key={key}
                            date={formattedDate}
                            addMinutes={1}
                            time={"05:30:00 pm"}
                            onTimeUp={async () => {
                              console.log("⏱ Countdown finished for", game.name, res.time);
                            
                              const updatedGame = await refetchResults(game.id);
                              const updatedResult = updatedGame?.result?.find((r) => r.time === res.time);
                            
                              if (updatedResult && updatedResult.numbers && updatedResult.numbers.trim() !== "") {
                                const formData = new FormData();
                                formData.append("results", updatedResult.numbers);
                                formData.append("game_id", game.id);
                                formData.append("date", formattedDate);
                                formData.append("time", updatedResult.time);
                            
                                const isAuthenticated = await setResultsDraw(formData);
                            
                                if (isAuthenticated) {
                                  console.log("✅ Result saved on time-up:", updatedResult);
                                  setSavedResults((prev) => new Set(prev).add(`${game.id}-${res.time}`));
                                } else {
                                  console.log("❌ Failed to save on time-up:", updatedResult);
                                  setFailedResults((prev) => new Set(prev).add(`${game.id}-${res.time}`));
                                }
                              } else {
                                console.log("🕐 Still empty, will try again later");
                              }
                            }}
                            
                            
                            shouldRetry={() => {
                              console.log("retry");
                              const found = draws.find((d) => d.id === game.id);
                              const thisResult = found?.result?.find((r) => r.time === res.time);
                              return !thisResult?.numbers || thisResult.numbers.trim() === "";
                            }}
                          />


                        )}
                      </TableCell>



                      </TableRow>

                    );
                  })
                )}
              </TableBody>

        </Table>


          </CardContent>
        </Card>
      </div>
    </div>
  );
}