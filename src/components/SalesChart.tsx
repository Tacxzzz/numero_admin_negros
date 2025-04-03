import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function SalesChart() {
  const data = [
    { name: "Jan", total: 2400 },
    { name: "Feb", total: 1398 },
    { name: "Mar", total: 9800 },
    { name: "Apr", total: 3908 },
    { name: "May", total: 4800 },
    { name: "Jun", total: 3800 },
    { name: "Jul", total: 4300 },
  ];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#888888" />
        <YAxis stroke="#888888" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#8884d8"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}