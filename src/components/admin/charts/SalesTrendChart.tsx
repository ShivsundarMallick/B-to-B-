import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TimeFilter } from "../AdminDashboard";

// Generate mock data for charts
const generateMockData = (timeFilter: TimeFilter) => {
  switch (timeFilter) {
    case "day":
      return Array.from({ length: 24 }, (_, i) => ({
        name: `${i}:00`,
        sales: Math.floor(Math.random() * 400) + 100,
        orders: Math.floor(Math.random() * 15) + 5,
      }));
    case "week":
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return days.map((day) => ({
        name: day,
        sales: Math.floor(Math.random() * 3000) + 1000,
        orders: Math.floor(Math.random() * 100) + 30,
      }));
    case "month":
      return Array.from({ length: 30 }, (_, i) => ({
        name: `${i + 1}`,
        sales: Math.floor(Math.random() * 5000) + 2000,
        orders: Math.floor(Math.random() * 200) + 50,
      }));
    default:
      return [];
  }
};

interface SalesTrendChartProps {
  timeFilter: TimeFilter;
}

const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ timeFilter }) => {
  const data = generateMockData(timeFilter);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
          />
          <YAxis
            tickFormatter={(value) => `$${value}`}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
          />
          <Tooltip
            formatter={(value) => [`$${value}`, "Sales"]}
            labelFormatter={(label) => `Time: ${label}`}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, stroke: "white", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#10B981"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, stroke: "white", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesTrendChart;
