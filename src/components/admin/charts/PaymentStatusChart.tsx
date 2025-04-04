import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

// Mock data for payment status
const data = [
  { name: "Paid", value: 68 },
  { name: "Partial", value: 22 },
  { name: "Pending", value: 10 },
];

// Colors for each payment status
const COLORS = ["#10B981", "#F59E0B", "#6B7280"];

const PaymentStatusChart: React.FC = () => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value}%`, "Percentage"]}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingTop: 20 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PaymentStatusChart;
