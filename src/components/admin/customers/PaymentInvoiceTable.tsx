import React, { useState } from "react";
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
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import {
  FileText,
  Download,
  CreditCard,
  PlusCircle,
  Edit,
  Printer,
  Send,
  RotateCcw,
} from "lucide-react";
import { Input } from "../../../components/ui/input";
import { mockCustomers } from "./CustomerManagement";

interface Payment {
  id: string;
  customerId: string;
  purchaseId: string;
  invoiceNumber: string;
  amount: number;
  date: string;
  status: "paid" | "partially_paid" | "unpaid";
  method: string | null;
  amountPaid?: number;
  amountDue?: number;
}

// Mock Payment Data
export const mockPayments: Payment[] = [
  {
    id: "pay-001",
    customerId: "cust-001",
    purchaseId: "pur-001",
    invoiceNumber: "INV-2023-001",
    amount: 510000,
    date: "2023-05-15",
    status: "paid",
    method: "Corporate Credit Card",
  },
  {
    id: "pay-002",
    customerId: "cust-001",
    purchaseId: "pur-002",
    invoiceNumber: "INV-2023-002",
    amount: 30000,
    date: "2023-06-10",
    status: "paid",
    method: "Bank Transfer",
  },
  {
    id: "pay-003",
    customerId: "cust-002",
    purchaseId: "pur-003",
    invoiceNumber: "INV-2023-003",
    amount: 636000,
    date: "2023-06-20",
    status: "paid",
    method: "Corporate Credit Card",
  },
  {
    id: "pay-004",
    customerId: "cust-003",
    purchaseId: "pur-004",
    invoiceNumber: "INV-2023-004",
    amount: 72000,
    date: "2023-07-05",
    status: "partially_paid",
    method: "Bank Transfer",
    amountPaid: 36000,
    amountDue: 36000,
  },
  {
    id: "pay-005",
    customerId: "cust-004",
    purchaseId: "pur-005",
    invoiceNumber: "INV-2023-005",
    amount: 84000,
    date: "2023-07-12",
    status: "unpaid",
    method: null,
    amountPaid: 0,
    amountDue: 84000,
  },
];

interface PaymentInvoiceTableProps {
  payments: Payment[];
}

const PaymentInvoiceTable: React.FC<PaymentInvoiceTableProps> = ({
  payments,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const getCustomerName = (customerId: string) => {
    const customer = mockCustomers.find((c) => c.id === customerId);
    return customer ? customer.name : "Unknown Customer";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Paid
          </span>
        );
      case "partially_paid":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Partially Paid
          </span>
        );
      case "unpaid":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Unpaid
          </span>
        );
      default:
        return null;
    }
  };

  const openPaymentDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    if (payment.amountDue) {
      setPaymentAmount(payment.amountDue.toString());
    } else {
      setPaymentAmount(payment.amount.toString());
    }
    setShowPaymentDialog(true);
  };

  const handleRecordPayment = () => {
    if (!selectedPayment) return;

    // In a real application, this would call an API to record the payment
    console.log(
      `Recording payment of ${paymentAmount} for invoice ${selectedPayment.invoiceNumber}`
    );

    setShowPaymentDialog(false);
    setSelectedPayment(null);
    setPaymentAmount("");
  };

  const handleRefund = (payment: Payment) => {
    // In a real application, this would call an API to process the refund
    console.log(`Processing refund for payment ${payment.id}`);
  };

  const handleSendReminder = (payment: Payment) => {
    // In a real application, this would call an API to send a payment reminder
    console.log(
      `Sending payment reminder for invoice ${payment.invoiceNumber}`
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No payments found matching your criteria.
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">
                  {payment.invoiceNumber}
                </TableCell>
                <TableCell>{getCustomerName(payment.customerId)}</TableCell>
                <TableCell>{formatDate(payment.date)}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {formatCurrency(payment.amount)}
                    </div>
                    {payment.status === "partially_paid" &&
                      payment.amountPaid !== undefined && (
                        <div className="text-sm text-gray-500">
                          Paid: {formatCurrency(payment.amountPaid)}
                        </div>
                      )}
                    {(payment.status === "partially_paid" ||
                      payment.status === "unpaid") &&
                      payment.amountDue !== undefined && (
                        <div className="text-sm text-gray-500">
                          Due: {formatCurrency(payment.amountDue)}
                        </div>
                      )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell>{payment.method || "—"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" title="View Invoice">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Download Invoice">
                      <Download className="h-4 w-4" />
                    </Button>
                    {payment.status !== "paid" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Record Payment"
                        onClick={() => openPaymentDialog(payment)}
                      >
                        <CreditCard className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                    {payment.status === "paid" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Process Refund"
                        onClick={() => handleRefund(payment)}
                      >
                        <RotateCcw className="h-4 w-4 text-amber-600" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Payment Dialog */}
      <Dialog
        open={showPaymentDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowPaymentDialog(false);
            setSelectedPayment(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedPayment && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Invoice</p>
                    <p className="font-medium">
                      {selectedPayment.invoiceNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Customer
                    </p>
                    <p>{getCustomerName(selectedPayment.customerId)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Amount
                    </p>
                    <p className="font-medium">
                      {formatCurrency(selectedPayment.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Outstanding
                    </p>
                    <p className="font-medium">
                      {formatCurrency(
                        selectedPayment.amountDue || selectedPayment.amount
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-500 mb-1.5 block">
                    Payment Amount
                  </label>
                  <Input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter payment amount"
                    min={0}
                    max={selectedPayment.amountDue || selectedPayment.amount}
                  />
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-500 mb-1.5 block">
                    Payment Method
                  </label>
                  <select className="w-full rounded-md border border-gray-300 p-2">
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-500 mb-1.5 block">
                    Payment Date
                  </label>
                  <Input
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowPaymentDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRecordPayment}
                    className="flex items-center gap-1.5"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Record Payment
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentInvoiceTable;
