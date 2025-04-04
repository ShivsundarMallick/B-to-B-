import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data for stock levels
const data = [
  {
    name: "Electronics",
    inStock: 122,
    lowStock: 28,
    backOrder: 12,
  },
  {
    name: "Accessories",
    inStock: 89,
    lowStock: 16,
    backOrder: 4,
  },
  {
    name: "Storage",
    inStock: 65,
    lowStock: 18,
    backOrder: 7,
  },
  {
    name: "Computers",
    inStock: 47,
    lowStock: 13,
    backOrder: 5,
  },
  {
    name: "Peripherals",
    inStock: 78,
    lowStock: 21,
    backOrder: 9,
  },
];

const StockLevelChart: React.FC = () => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12 }}
          />
          <Bar
            dataKey="inStock"
            name="In Stock"
            stackId="a"
            fill="#4ADE80"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="lowStock"
            name="Low Stock"
            stackId="a"
            fill="#FBBF24"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="backOrder"
            name="Back Order"
            stackId="a"
            fill="#F87171"
            radius={[0, 0, 4, 4]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockLevelChart;
