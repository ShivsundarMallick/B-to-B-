import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  ChartBar,
  CreditCard,
  FileText,
  Receipt,
  ChevronDown,
  Filter,
  Search,
} from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import PaymentDashboard from "./PaymentDashboard";
import TransactionRequests from "./TransactionRequests";
import PaymentHistory from "./PaymentHistory";
import InvoiceManagement from "./InvoiceManagement";

const PaymentManagementModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Payment Management</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by order ID, customer..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button className="flex items-center gap-2">Export</Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Status
            </label>
            <select className="w-full rounded-md border border-gray-300 p-2">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="partial">Partial</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Date Range
            </label>
            <select className="w-full rounded-md border border-gray-300 p-2">
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Payment Method
            </label>
            <select className="w-full rounded-md border border-gray-300 p-2">
              <option value="">All Methods</option>
              <option value="credit_card">Credit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="upi">UPI</option>
              <option value="net_banking">Net Banking</option>
              <option value="cash">Cash</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Amount Range
            </label>
            <div className="flex items-center gap-2">
              <Input placeholder="Min" type="number" className="w-full" />
              <span>-</span>
              <Input placeholder="Max" type="number" className="w-full" />
            </div>
          </div>
          <div className="sm:col-span-2 md:col-span-4 flex justify-end gap-2">
            <Button variant="outline">Reset</Button>
            <Button>Apply Filters</Button>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-gray-100 p-1 rounded-lg mb-6">
          <TabsTrigger value="dashboard" className="flex-1">
            <ChartBar className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="transaction-requests" className="flex-1">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Transaction Requests</span>
          </TabsTrigger>
          <TabsTrigger value="payment-history" className="flex-1">
            <Receipt className="h-4 w-4" />
            <span className="hidden sm:inline">Payment History</span>
          </TabsTrigger>
          <TabsTrigger value="invoice-management" className="flex-1">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Invoice Management</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <PaymentDashboard />
        </TabsContent>

        <TabsContent value="transaction-requests">
          <TransactionRequests />
        </TabsContent>

        <TabsContent value="payment-history">
          <PaymentHistory />
        </TabsContent>

        <TabsContent value="invoice-management">
          <InvoiceManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentManagementModule;
