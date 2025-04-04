import React, { useState } from "react";
import { format } from "date-fns";
import {
  Search,
  // Filter,
  // ChevronDown,
  FileText,
  Eye,
  Download,
  Mail,
  Printer,
} from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";

// Define interfaces for payment data
interface PaymentItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Payment {
  id: string;
  transactionId: string;
  customerId: string;
  customerName: string;
  amount: number;
  date: Date;
  paymentMethod: string;
  status: "successful" | "failed" | "pending" | "refunded";
  items: PaymentItem[];
}

const PaymentHistory: React.FC = () => {
  // States for UI interaction
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Mock payment data
  const payments: Payment[] = [
    {
      id: "PAY-001",
      transactionId: "TRX-001",
      customerId: "CUST-001",
      customerName: "ABC Company",
      amount: 12500,
      date: new Date(2023, 6, 15),
      paymentMethod: "Bank Transfer",
      status: "successful",
      items: [
        { id: "ITEM-001", name: "Product A", quantity: 5, price: 1500 },
        { id: "ITEM-002", name: "Product B", quantity: 2, price: 2000 },
      ],
    },
    {
      id: "PAY-002",
      transactionId: "TRX-002",
      customerId: "CUST-002",
      customerName: "XYZ Corp",
      amount: 8750,
      date: new Date(2023, 6, 18),
      paymentMethod: "Credit Card",
      status: "successful",
      items: [
        { id: "ITEM-003", name: "Product C", quantity: 3, price: 2500 },
        { id: "ITEM-004", name: "Product D", quantity: 1, price: 1250 },
      ],
    },
    {
      id: "PAY-003",
      transactionId: "TRX-003",
      customerId: "CUST-003",
      customerName: "123 Industries",
      amount: 6200,
      date: new Date(2023, 6, 20),
      paymentMethod: "UPI",
      status: "failed",
      items: [{ id: "ITEM-005", name: "Product E", quantity: 2, price: 3100 }],
    },
    {
      id: "PAY-004",
      transactionId: "TRX-004",
      customerId: "CUST-001",
      customerName: "ABC Company",
      amount: 9900,
      date: new Date(2023, 6, 25),
      paymentMethod: "Bank Transfer",
      status: "refunded",
      items: [{ id: "ITEM-006", name: "Product F", quantity: 3, price: 3300 }],
    },
    {
      id: "PAY-005",
      transactionId: "TRX-005",
      customerId: "CUST-004",
      customerName: "PQR Limited",
      amount: 15000,
      date: new Date(2023, 7, 2),
      paymentMethod: "Net Banking",
      status: "successful",
      items: [{ id: "ITEM-007", name: "Product G", quantity: 10, price: 1500 }],
    },
    {
      id: "PAY-006",
      transactionId: "TRX-006",
      customerId: "CUST-005",
      customerName: "LMN Enterprises",
      amount: 4500,
      date: new Date(2023, 7, 5),
      paymentMethod: "UPI",
      status: "pending",
      items: [{ id: "ITEM-008", name: "Product H", quantity: 1, price: 4500 }],
    },
  ];

  // Filter payments based on search and filters
  const filteredPayments = payments
    .filter((payment) => {
      if (search === "") return true;
      return (
        payment.id.toLowerCase().includes(search.toLowerCase()) ||
        payment.customerName.toLowerCase().includes(search.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(search.toLowerCase())
      );
    })
    .filter((payment) => {
      if (statusFilter === "all") return true;
      return payment.status === statusFilter;
    })
    .filter((payment) => {
      if (dateFilter === "all") return true;
      const today = new Date();
      const paymentDate = new Date(payment.date);

      if (dateFilter === "today") {
        return (
          paymentDate.getDate() === today.getDate() &&
          paymentDate.getMonth() === today.getMonth() &&
          paymentDate.getFullYear() === today.getFullYear()
        );
      } else if (dateFilter === "this-week") {
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        return paymentDate >= oneWeekAgo;
      } else if (dateFilter === "this-month") {
        return (
          paymentDate.getMonth() === today.getMonth() &&
          paymentDate.getFullYear() === today.getFullYear()
        );
      }
      return true;
    });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle view payment details
  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setViewDialogOpen(true);
  };

  // Get status badge
  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "successful":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Successful
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Failed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Pending
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Refunded
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with title and actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Payment History</h2>
          <p className="text-sm text-gray-500">
            View and manage all payment transactions
          </p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Button className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search payments..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="successful">Successful</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Payments table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  No payments found. Try changing your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.transactionId}</TableCell>
                  <TableCell>{payment.customerName}</TableCell>
                  <TableCell>{format(payment.date, "dd MMM yyyy")}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewPayment(payment)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Payment details dialog */}
      {selectedPayment && (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Payment ID
                  </p>
                  <p>{selectedPayment.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Transaction ID
                  </p>
                  <p>{selectedPayment.transactionId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer</p>
                  <p>{selectedPayment.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Customer ID
                  </p>
                  <p>{selectedPayment.customerId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p>{format(selectedPayment.date, "dd MMM yyyy, HH:mm")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p>{getStatusBadge(selectedPayment.status)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Payment Method
                  </p>
                  <p>{selectedPayment.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(selectedPayment.amount)}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-medium">Items</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPayment.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell>
                          {formatCurrency(item.price * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <DialogFooter>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewDialogOpen(false)}
                >
                  Close
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PaymentHistory;
