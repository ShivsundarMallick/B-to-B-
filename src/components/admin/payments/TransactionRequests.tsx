import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import {
  Check,
  X,
  AlertCircle,
  Clock,
  // Edit,
  Download,
  Printer,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

// Mock transaction data
const transactionData = [
  {
    id: "TXN-001",
    orderId: "ORD-2023-001",
    customerId: "CUST-001",
    customerName: "Infosys Ltd.",
    contactPerson: "Rajat Sharma",
    amount: 510000,
    requestedAmount: 510000,
    date: "2023-07-15T10:30:00",
    status: "pending" as TransactionStatus,
    paymentMethod: "Bank Transfer",
    items: [
      {
        id: "ITEM-001",
        name: "Dell XPS Laptop",
        qty: 5,
        price: 78000,
        total: 390000,
      },
      {
        id: "ITEM-002",
        name: "HP Monitor 27-inch",
        qty: 10,
        price: 12000,
        total: 120000,
      },
    ],
  },
  {
    id: "TXN-002",
    orderId: "ORD-2023-002",
    customerId: "CUST-002",
    customerName: "TCS Limited",
    contactPerson: "Priya Patel",
    amount: 85000,
    requestedAmount: 42500,
    date: "2023-07-16T14:15:00",
    status: "partial" as TransactionStatus,
    paymentMethod: "UPI",
    items: [
      {
        id: "ITEM-003",
        name: "Dell Latitude Laptop",
        qty: 1,
        price: 85000,
        total: 85000,
      },
    ],
  },
  {
    id: "TXN-003",
    orderId: "ORD-2023-003",
    customerId: "CUST-003",
    customerName: "Wipro Technologies",
    contactPerson: "Vikram Singh",
    amount: 125000,
    requestedAmount: 125000,
    date: "2023-07-17T09:45:00",
    status: "approved" as TransactionStatus,
    paymentMethod: "Credit Card",
    items: [
      {
        id: "ITEM-004",
        name: "Dell Servers",
        qty: 1,
        price: 125000,
        total: 125000,
      },
    ],
  },
  {
    id: "TXN-004",
    orderId: "ORD-2023-004",
    customerId: "CUST-004",
    customerName: "Tech Mahindra",
    contactPerson: "Ananya Sharma",
    amount: 56000,
    requestedAmount: 56000,
    date: "2023-07-18T11:20:00",
    status: "rejected" as TransactionStatus,
    paymentMethod: "Net Banking",
    rejectionReason: "Invalid payment details provided",
  },
  {
    id: "TXN-005",
    orderId: "ORD-2023-005",
    customerId: "CUST-005",
    customerName: "HCL Technologies",
    contactPerson: "Rahul Mehta",
    amount: 240000,
    requestedAmount: 240000,
    date: "2023-07-19T16:10:00",
    status: "pending" as TransactionStatus,
    paymentMethod: "Bank Transfer",
    items: [
      {
        id: "ITEM-005",
        name: "HP Workstation",
        qty: 2,
        price: 120000,
        total: 240000,
      },
    ],
  },
];

type TransactionStatus = "pending" | "approved" | "rejected" | "partial";

interface Transaction {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  contactPerson: string;
  amount: number;
  requestedAmount: number;
  date: string;
  status: TransactionStatus;
  paymentMethod: string;
  items?: Array<{
    id: string;
    name: string;
    qty: number;
    price: number;
    total: number;
  }>;
  rejectionReason?: string;
}

type StatusBadge = {
  [key in TransactionStatus]: {
    label: string;
    color: string;
    icon: React.ReactNode;
  };
};

const TransactionRequests: React.FC = () => {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [approvedAmount, setApprovedAmount] = useState<number>(0);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Status badge component
  const statusBadges: StatusBadge = {
    pending: {
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
      icon: <Clock className="h-4 w-4 text-yellow-600" />,
    },
    approved: {
      label: "Approved",
      color: "bg-green-100 text-green-800",
      icon: <Check className="h-4 w-4 text-green-600" />,
    },
    rejected: {
      label: "Rejected",
      color: "bg-red-100 text-red-800",
      icon: <X className="h-4 w-4 text-red-600" />,
    },
    partial: {
      label: "Partial",
      color: "bg-blue-100 text-blue-800",
      icon: <AlertCircle className="h-4 w-4 text-blue-600" />,
    },
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const handleApprove = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setApprovedAmount(transaction.requestedAmount);
    setShowApproveModal(true);
  };

  const handleReject = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const confirmApprove = () => {
    // In a real application, this would make an API call to approve the transaction
    console.log(
      `Approved transaction ${selectedTransaction?.id} for amount ${approvedAmount}`
    );
    setShowApproveModal(false);
    setSelectedTransaction(null);
  };

  const confirmReject = () => {
    // In a real application, this would make an API call to reject the transaction
    console.log(
      `Rejected transaction ${selectedTransaction?.id}. Reason: ${rejectionReason}`
    );
    setShowRejectModal(false);
    setSelectedTransaction(null);
  };

  const toggleDetails = (id: string) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  // Stats cards
  const stats = {
    pending: transactionData.filter((t) => t.status === "pending").length,
    approved: transactionData.filter((t) => t.status === "approved").length,
    rejected: transactionData.filter((t) => t.status === "rejected").length,
    partial: transactionData.filter((t) => t.status === "partial").length,
    totalRequested: transactionData.reduce(
      (sum, t) => sum + t.requestedAmount,
      0
    ),
    totalAmount: transactionData.reduce((sum, t) => sum + t.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pending Requests
            </CardTitle>
            <div className="p-2 bg-yellow-100 rounded-full">
              <Clock className="h-4 w-4 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Approved Payments
            </CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <Check className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-gray-500 mt-1">Successfully processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Partial Payments
            </CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <AlertCircle className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.partial}</div>
            <p className="text-xs text-gray-500 mt-1">Partially paid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Rejected Requests
            </CardTitle>
            <div className="p-2 bg-red-100 rounded-full">
              <X className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-gray-500 mt-1">Declined payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
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
            {transactionData.map((transaction) => {
              // Ensure transaction is properly typed
              const typedTransaction = transaction as Transaction;

              return (
                <React.Fragment key={typedTransaction.id}>
                  <TableRow>
                    <TableCell>
                      {typedTransaction.items && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleDetails(typedTransaction.id)}
                          className="h-8 w-8 p-0"
                        >
                          {expandedRow === typedTransaction.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {typedTransaction.id}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {typedTransaction.customerName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {typedTransaction.contactPerson}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(typedTransaction.date)}</TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {formatCurrency(typedTransaction.requestedAmount)}
                      </div>
                      {typedTransaction.requestedAmount !==
                        typedTransaction.amount && (
                        <div className="text-xs text-muted-foreground">
                          of {formatCurrency(typedTransaction.amount)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{typedTransaction.paymentMethod}</TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusBadges[typedTransaction.status].color
                        }`}
                      >
                        <span className="mr-1">
                          {statusBadges[typedTransaction.status].icon}
                        </span>
                        {statusBadges[typedTransaction.status].label}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewDetails(typedTransaction)}
                        >
                          <span className="sr-only">View details</span>
                          <DollarSign className="h-4 w-4" />
                        </Button>
                        {typedTransaction.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleApprove(typedTransaction)}
                            >
                              <span className="sr-only">Approve</span>
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => handleReject(typedTransaction)}
                            >
                              <span className="sr-only">Reject</span>
                              <ThumbsDown className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row */}
                  {expandedRow === typedTransaction.id &&
                    typedTransaction.items && (
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={8} className="p-4">
                          <div className="space-y-2">
                            <div className="font-medium">
                              Order #{typedTransaction.orderId}
                            </div>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Item</TableHead>
                                  <TableHead className="text-right">
                                    Qty
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Unit Price
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Total
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {typedTransaction.items.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell className="text-right">
                                      {item.qty}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {formatCurrency(item.price)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {formatCurrency(item.total)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                                <TableRow>
                                  <TableCell
                                    colSpan={3}
                                    className="text-right font-medium"
                                  >
                                    Total
                                  </TableCell>
                                  <TableCell className="text-right font-medium">
                                    {formatCurrency(typedTransaction.amount)}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* View Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Transaction ID
                  </p>
                  <p className="text-sm font-semibold">
                    {selectedTransaction.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Order ID</p>
                  <p className="text-sm font-semibold">
                    {selectedTransaction.orderId}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer</p>
                  <p className="text-sm font-semibold">
                    {selectedTransaction.customerName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Contact Person
                  </p>
                  <p className="text-sm font-semibold">
                    {selectedTransaction.contactPerson}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-sm">
                    {formatDate(selectedTransaction.date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div
                    className={`inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium ${
                      statusBadges[selectedTransaction.status].color
                    }`}
                  >
                    <span className="mr-1">
                      {statusBadges[selectedTransaction.status].icon}
                    </span>
                    {statusBadges[selectedTransaction.status].label}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Payment Method
                  </p>
                  <p className="text-sm">{selectedTransaction.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p className="text-sm font-semibold">
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
                {selectedTransaction.requestedAmount !==
                  selectedTransaction.amount && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Requested Amount
                    </p>
                    <p className="text-sm font-semibold">
                      {formatCurrency(selectedTransaction.requestedAmount)}
                    </p>
                  </div>
                )}
                {selectedTransaction.rejectionReason && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">
                      Rejection Reason
                    </p>
                    <p className="text-sm text-red-600">
                      {selectedTransaction.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Printer className="h-4 w-4" />
                  <span>Print</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Payment Modal */}
      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Payment</DialogTitle>
            <DialogDescription>
              Review and approve this payment request
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4 py-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Transaction:</span>
                  <span>{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Customer:</span>
                  <span>{selectedTransaction.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Full Amount:</span>
                  <span className="font-medium">
                    {formatCurrency(selectedTransaction.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Requested Amount:</span>
                  <span className="font-medium">
                    {formatCurrency(selectedTransaction.requestedAmount)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Approve Amount</label>
                <Input
                  type="number"
                  value={approvedAmount}
                  onChange={(e) => setApprovedAmount(Number(e.target.value))}
                  max={selectedTransaction.amount}
                  min={0}
                />
                {approvedAmount < selectedTransaction.requestedAmount && (
                  <div className="text-sm text-amber-600 flex items-center mt-1">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    You're approving less than the requested amount
                  </div>
                )}
              </div>

              <DialogFooter className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowApproveModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={confirmApprove} className="gap-1">
                  <Check className="h-4 w-4" />
                  Approve Payment
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Payment Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this payment request
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4 py-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Transaction:</span>
                  <span>{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Customer:</span>
                  <span>{selectedTransaction.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Requested Amount:</span>
                  <span className="font-medium">
                    {formatCurrency(selectedTransaction.requestedAmount)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Reason for Rejection
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full min-h-[100px] border border-input rounded-md p-2"
                  placeholder="Please provide details about why you're rejecting this payment request..."
                  required
                />
              </div>

              <DialogFooter className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmReject}
                  variant="destructive"
                  className="gap-1"
                  disabled={!rejectionReason.trim()}
                >
                  <X className="h-4 w-4" />
                  Reject Payment
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionRequests;
