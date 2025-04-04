import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data for top products
const data = [
  {
    name: "Wireless Earbuds",
    sales: 1200,
  },
  {
    name: "Smart Watch",
    sales: 980,
  },
  {
    name: "Portable Charger",
    sales: 860,
  },
  {
    name: "Bluetooth Speaker",
    sales: 730,
  },
  {
    name: "USB-C Hub",
    sales: 650,
  },
];

const TopProductsChart: React.FC = () => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{
            top: 15,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
            opacity={0.2}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
            width={120}
          />
          <Tooltip
            formatter={(value) => [`${value} units`, "Sales"]}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          />
          <Bar
            dataKey="sales"
            name="Sales"
            fill="#4F46E5"
            radius={[0, 4, 4, 0]}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopProductsChart;
