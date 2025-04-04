import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { ArrowUpRight, BanknoteIcon, Wallet } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Mock data for the charts
const dailyPaymentData = [
  { date: "Mon", completed: 42000, pending: 5000, partial: 15000 },
  { date: "Tue", completed: 38000, pending: 12000, partial: 8000 },
  { date: "Wed", completed: 55000, pending: 8000, partial: 20000 },
  { date: "Thu", completed: 62000, pending: 10000, partial: 18000 },
  { date: "Fri", completed: 48000, pending: 15000, partial: 12000 },
  { date: "Sat", completed: 35000, pending: 6000, partial: 5000 },
  { date: "Sun", completed: 20000, pending: 4000, partial: 3000 },
];

const paymentMethodData = [
  { name: "Credit Card", value: 40, color: "#4f46e5" },
  { name: "Bank Transfer", value: 30, color: "#06b6d4" },
  { name: "UPI", value: 15, color: "#22c55e" },
  { name: "Net Banking", value: 10, color: "#eab308" },
  { name: "Cash", value: 5, color: "#f97316" },
];

const PaymentDashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month">(
    "week"
  );

  // Summary data
  const summaryData = {
    today: {
      totalPayments: "₹45,000",
      pendingPayments: "₹8,500",
      completedPayments: "₹34,000",
      partialPayments: "₹2,500",
      totalCount: 12,
      pendingCount: 3,
      completedCount: 8,
      partialCount: 1,
    },
    week: {
      totalPayments: "₹3,20,000",
      pendingPayments: "₹60,000",
      completedPayments: "₹2,40,000",
      partialPayments: "₹20,000",
      totalCount: 87,
      pendingCount: 18,
      completedCount: 62,
      partialCount: 7,
    },
    month: {
      totalPayments: "₹12,80,000",
      pendingPayments: "₹2,20,000",
      completedPayments: "₹9,60,000",
      partialPayments: "₹1,00,000",
      totalCount: 345,
      pendingCount: 56,
      completedCount: 268,
      partialCount: 21,
    },
  };

  const currentData = summaryData[timeFilter];

  return (
    <div className="space-y-6">
      {/* Time filter */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              timeFilter === "today"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } border border-gray-200`}
            onClick={() => setTimeFilter("today")}
          >
            Today
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              timeFilter === "week"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } border-t border-b border-gray-200`}
            onClick={() => setTimeFilter("week")}
          >
            This Week
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              timeFilter === "month"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } border border-gray-200`}
            onClick={() => setTimeFilter("month")}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Payments
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentData.totalPayments}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {currentData.totalCount} transactions
            </p>
            <div className="flex items-center pt-4">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs font-medium text-green-500">+12.5%</span>
              <span className="text-xs text-gray-500 ml-1">
                from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pending Payments
            </CardTitle>
            <div className="p-2 bg-yellow-100 rounded-full">
              <BanknoteIcon className="h-4 w-4 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentData.pendingPayments}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {currentData.pendingCount} transactions
            </p>
            <div className="flex items-center pt-4">
              <ArrowUpRight className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-xs font-medium text-red-500">+5.2%</span>
              <span className="text-xs text-gray-500 ml-1">
                from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Completed Payments
            </CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <BanknoteIcon className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentData.completedPayments}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {currentData.completedCount} transactions
            </p>
            <div className="flex items-center pt-4">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs font-medium text-green-500">+18.7%</span>
              <span className="text-xs text-gray-500 ml-1">
                from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Partial Payments
            </CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <BanknoteIcon className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentData.partialPayments}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {currentData.partialCount} transactions
            </p>
            <div className="flex items-center pt-4">
              <ArrowUpRight className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-xs font-medium text-blue-500">+3.4%</span>
              <span className="text-xs text-gray-500 ml-1">
                from last period
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Daily Payment Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyPaymentData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`₹${value}`, undefined]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="completed"
                    stackId="a"
                    name="Completed"
                    fill="#22c55e"
                  />
                  <Bar
                    dataKey="partial"
                    stackId="a"
                    name="Partial"
                    fill="#3b82f6"
                  />
                  <Bar
                    dataKey="pending"
                    stackId="a"
                    name="Pending"
                    fill="#eab308"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentDashboard;
