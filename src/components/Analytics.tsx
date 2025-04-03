import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logs } from "./Logs";

export function Analytics() {
  

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold">Logs</h2>
      <Card>
        <CardHeader>
        </CardHeader>
        <CardContent>
          <Logs />
        </CardContent>
      </Card>
    </div>
  );
}