import React, { useState } from "react";
import { mockCustomers } from "./CustomerManagement";
import { mockPayments } from "./PaymentInvoiceTable.tsx";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Search } from "lucide-react";
import PaymentInvoiceTable from "./PaymentInvoiceTable.tsx";

const PaymentManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter payments based on search and status
  const filteredPayments = mockPayments.filter((payment) => {
    // Status filter
    if (statusFilter !== "all" && payment.status !== statusFilter) {
      return false;
    }

    // Search query filter
    const customer = mockCustomers.find((c) => c.id === payment.customerId);
    const customerName = customer ? customer.name.toLowerCase() : "";

    return (
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.includes(searchQuery.toLowerCase())
    );
  });

  // Calculate payment stats
  const totalPayments = mockPayments.length;
  const totalAmount = mockPayments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = mockPayments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = mockPayments
    .filter((p) => p.status === "unpaid" || p.status === "partially_paid")
    .reduce((sum, p) => sum + (p.amountDue || 0), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Count payments by status
  const statusCounts = {
    all: mockPayments.length,
    paid: mockPayments.filter((p) => p.status === "paid").length,
    partially_paid: mockPayments.filter((p) => p.status === "partially_paid")
      .length,
    unpaid: mockPayments.filter((p) => p.status === "unpaid").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by payment ID, invoice number, or customer..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-1/3">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              All Payments ({statusCounts.all})
            </SelectItem>
            <SelectItem value="paid">Paid ({statusCounts.paid})</SelectItem>
            <SelectItem value="partially_paid">
              Partially Paid ({statusCounts.partially_paid})
            </SelectItem>
            <SelectItem value="unpaid">
              Unpaid ({statusCounts.unpaid})
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm font-medium text-gray-500">Total Invoices</p>
          <p className="text-2xl font-bold">{totalPayments}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm font-medium text-gray-500">Total Amount</p>
          <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm font-medium text-gray-500">Paid Amount</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(paidAmount)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm font-medium text-gray-500">Pending Amount</p>
          <p className="text-2xl font-bold text-amber-600">
            {formatCurrency(pendingAmount)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div
          className={`p-4 rounded-lg border cursor-pointer ${
            statusFilter === "all" ? "bg-primary/10 border-primary" : "bg-white"
          }`}
          onClick={() => setStatusFilter("all")}
        >
          <p className="text-sm font-medium">All</p>
          <p className="text-2xl font-bold">{statusCounts.all}</p>
        </div>
        <div
          className={`p-4 rounded-lg border cursor-pointer ${
            statusFilter === "paid"
              ? "bg-green-50 border-green-400"
              : "bg-white"
          }`}
          onClick={() => setStatusFilter("paid")}
        >
          <p className="text-sm font-medium">Paid</p>
          <p className="text-2xl font-bold">{statusCounts.paid}</p>
        </div>
        <div
          className={`p-4 rounded-lg border cursor-pointer ${
            statusFilter === "unpaid" ? "bg-red-50 border-red-400" : "bg-white"
          }`}
          onClick={() => setStatusFilter("unpaid")}
        >
          <p className="text-sm font-medium">Unpaid</p>
          <p className="text-2xl font-bold">{statusCounts.unpaid}</p>
        </div>
      </div>

      <PaymentInvoiceTable payments={filteredPayments} />
    </div>
  );
};

export default PaymentManagement;
