import React, { useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Download,
  FileText,
  Mail,
  Printer,
  Search,
  Eye,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";

// Mock Invoices Data
const invoicesData = [
  {
    id: "INV-2023-001",
    orderId: "ORD-2023-001",
    customerId: "CUST-001",
    customerName: "Infosys Ltd.",
    contactPerson: "Rajat Sharma",
    amount: 510000,
    date: "2023-07-15",
    dueDate: "2023-08-15",
    status: "paid" as InvoiceStatus,
    paymentDate: "2023-07-16",
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
    id: "INV-2023-002",
    orderId: "ORD-2023-002",
    customerId: "CUST-002",
    customerName: "TCS Limited",
    contactPerson: "Priya Patel",
    amount: 85000,
    date: "2023-07-16",
    dueDate: "2023-08-16",
    status: "partially_paid" as InvoiceStatus,
    paymentDate: "2023-07-18",
    paymentMethod: "UPI",
    amountPaid: 42500,
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
    id: "INV-2023-003",
    orderId: "ORD-2023-003",
    customerId: "CUST-003",
    customerName: "Wipro Technologies",
    contactPerson: "Vikram Singh",
    amount: 125000,
    date: "2023-07-17",
    dueDate: "2023-08-17",
    status: "paid" as InvoiceStatus,
    paymentDate: "2023-07-17",
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
    id: "INV-2023-004",
    orderId: "ORD-2023-004",
    customerId: "CUST-004",
    customerName: "Tech Mahindra",
    contactPerson: "Ananya Sharma",
    amount: 56000,
    date: "2023-07-18",
    dueDate: "2023-08-18",
    status: "unpaid" as InvoiceStatus,
    paymentMethod: null,
    items: [
      {
        id: "ITEM-005",
        name: "HP Laptops",
        qty: 2,
        price: 28000,
        total: 56000,
      },
    ],
  },
  {
    id: "INV-2023-005",
    orderId: "ORD-2023-005",
    customerId: "CUST-005",
    customerName: "HCL Technologies",
    contactPerson: "Rahul Mehta",
    amount: 240000,
    date: "2023-07-19",
    dueDate: "2023-08-19",
    status: "overdue" as InvoiceStatus,
    paymentMethod: null,
    items: [
      {
        id: "ITEM-006",
        name: "HP Workstation",
        qty: 2,
        price: 120000,
        total: 240000,
      },
    ],
  },
];

type InvoiceStatus = "paid" | "partially_paid" | "unpaid" | "overdue";

interface Invoice {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  contactPerson: string;
  amount: number;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  paymentDate?: string;
  paymentMethod: string | null;
  amountPaid?: number;
  items: Array<{
    id: string;
    name: string;
    qty: number;
    price: number;
    total: number;
  }>;
}

type StatusBadge = {
  [key in InvoiceStatus]: {
    label: string;
    color: string;
    icon: React.ReactNode;
  };
};

const InvoiceManagement: React.FC = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
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
    paid: {
      label: "Paid",
      color: "bg-green-100 text-green-800",
      icon: <Check className="h-4 w-4 text-green-600" />,
    },
    partially_paid: {
      label: "Partially Paid",
      color: "bg-blue-100 text-blue-800",
      icon: <AlertCircle className="h-4 w-4 text-blue-600" />,
    },
    unpaid: {
      label: "Unpaid",
      color: "bg-yellow-100 text-yellow-800",
      icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
    },
    overdue: {
      label: "Overdue",
      color: "bg-red-100 text-red-800",
      icon: <AlertCircle className="h-4 w-4 text-red-600" />,
    },
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const toggleDetails = (id: string) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // This would actually generate and download the invoice in a real application
    console.log(`Downloading invoice for ${invoice.id}`);
  };

  const handleEmailInvoice = (invoice: Invoice) => {
    // This would send an email with the invoice in a real application
    console.log(`Emailing invoice for ${invoice.id} to customer`);
  };

  const handlePrintInvoice = () => {
    // In a real application, this would use react-to-print to print the invoice
    console.log("Printing invoice");
    window.print();
  };

  // Filter invoices
  const filteredInvoices = invoicesData.filter((invoice) => {
    // Status filter
    if (statusFilter !== "all" && invoice.status !== statusFilter) {
      return false;
    }

    // Search filter
    const searchFields = [
      invoice.id,
      invoice.orderId,
      invoice.customerName,
      invoice.contactPerson,
    ]
      .join(" ")
      .toLowerCase();

    if (searchQuery && !searchFields.includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Stats
  const stats = {
    all: invoicesData.length,
    paid: invoicesData.filter((i) => i.status === "paid").length,
    unpaid: invoicesData.filter((i) => i.status === "unpaid").length,
    partially_paid: invoicesData.filter((i) => i.status === "partially_paid")
      .length,
    overdue: invoicesData.filter((i) => i.status === "overdue").length,
  };

  return (
    <div className="space-y-6">
      {/* Filter controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search invoices by ID, customer, order..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="p-2 border rounded-md"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Invoices ({stats.all})</option>
          <option value="paid">Paid ({stats.paid})</option>
          <option value="partially_paid">
            Partially Paid ({stats.partially_paid})
          </option>
          <option value="unpaid">Unpaid ({stats.unpaid})</option>
          <option value="overdue">Overdue ({stats.overdue})</option>
        </select>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className={`cursor-pointer ${
            statusFilter === "all" ? "border-primary" : ""
          }`}
          onClick={() => setStatusFilter("all")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">All Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.all}</div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer ${
            statusFilter === "paid" ? "border-green-500" : ""
          }`}
          onClick={() => setStatusFilter("paid")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.paid}
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer ${
            statusFilter === "unpaid" ? "border-yellow-500" : ""
          }`}
          onClick={() => setStatusFilter("unpaid")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unpaid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.unpaid}
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer ${
            statusFilter === "overdue" ? "border-red-500" : ""
          }`}
          onClick={() => setStatusFilter("overdue")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.overdue}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No invoices found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <React.Fragment key={invoice.id}>
                  <TableRow>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDetails(invoice.id)}
                        className="h-8 w-8 p-0"
                      >
                        {expandedRow === invoice.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{invoice.customerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {invoice.contactPerson}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(invoice.date)}</TableCell>
                    <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {formatCurrency(invoice.amount)}
                      </div>
                      {invoice.status === "partially_paid" &&
                        invoice.amountPaid !== undefined && (
                          <div className="text-xs text-muted-foreground">
                            Paid: {formatCurrency(invoice.amountPaid)}
                          </div>
                        )}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusBadges[invoice.status].color
                        }`}
                      >
                        <span className="mr-1">
                          {statusBadges[invoice.status].icon}
                        </span>
                        {statusBadges[invoice.status].label}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewInvoice(invoice)}
                        >
                          <span className="sr-only">View</span>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDownloadInvoice(invoice)}
                        >
                          <span className="sr-only">Download</span>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEmailInvoice(invoice)}
                        >
                          <span className="sr-only">Email</span>
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row */}
                  {expandedRow === invoice.id && (
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={8} className="p-4">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <div>
                              <div className="font-semibold">
                                Order #{invoice.orderId}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Issued: {formatDate(invoice.date)}
                              </div>
                            </div>
                            {invoice.status === "paid" &&
                              invoice.paymentDate && (
                                <div>
                                  <div className="font-semibold">
                                    Payment Details
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Paid on: {formatDate(invoice.paymentDate)}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Method: {invoice.paymentMethod}
                                  </div>
                                </div>
                              )}
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
                              {invoice.items.map((item) => (
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
                                  Subtotal
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  {formatCurrency(invoice.amount)}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  colSpan={3}
                                  className="text-right font-medium"
                                >
                                  GST (0%)
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  {formatCurrency(0)}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  colSpan={3}
                                  className="text-right font-medium"
                                >
                                  Total
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  {formatCurrency(invoice.amount)}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Invoice Modal */}
      <Dialog open={showInvoiceModal} onOpenChange={setShowInvoiceModal}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice {selectedInvoice?.id}</DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div ref={invoiceRef} className="p-4 bg-white rounded-lg">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
                  <p className="text-gray-600">{selectedInvoice.id}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold text-gray-800">
                    B2B Supplies Ltd.
                  </h3>
                  <p className="text-gray-600">123 Business Park</p>
                  <p className="text-gray-600">Bangalore, Karnataka 560001</p>
                  <p className="text-gray-600">GSTIN: 29ABCDE1234F1Z5</p>
                </div>
              </div>

              {/* Invoice Info */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Bill To:</h4>
                  <p className="font-medium">{selectedInvoice.customerName}</p>
                  <p className="text-gray-600">
                    Attn: {selectedInvoice.contactPerson}
                  </p>
                  <p className="text-gray-600">
                    Customer ID: {selectedInvoice.customerId}
                  </p>
                </div>
                <div className="text-right">
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-gray-600 font-medium">Invoice Date:</p>
                    <p className="text-gray-800">
                      {formatDate(selectedInvoice.date)}
                    </p>
                    <p className="text-gray-600 font-medium">Due Date:</p>
                    <p className="text-gray-800">
                      {formatDate(selectedInvoice.dueDate)}
                    </p>
                    <p className="text-gray-600 font-medium">Status:</p>
                    <div
                      className={`inline-flex items-center justify-end px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusBadges[selectedInvoice.status].color
                      }`}
                    >
                      <span className="mr-1">
                        {statusBadges[selectedInvoice.status].icon}
                      </span>
                      {statusBadges[selectedInvoice.status].label}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="mb-6">
                <p className="text-gray-600">
                  Order Ref: {selectedInvoice.orderId}
                </p>
              </div>

              {/* Invoice Items */}
              <table className="w-full mb-8 border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 text-left font-medium text-gray-700 border-b">
                      Description
                    </th>
                    <th className="py-2 px-4 text-right font-medium text-gray-700 border-b">
                      Quantity
                    </th>
                    <th className="py-2 px-4 text-right font-medium text-gray-700 border-b">
                      Unit Price
                    </th>
                    <th className="py-2 px-4 text-right font-medium text-gray-700 border-b">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3 px-4">{item.name}</td>
                      <td className="py-3 px-4 text-right">{item.qty}</td>
                      <td className="py-3 px-4 text-right">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan={3}
                      className="py-3 px-4 text-right font-medium"
                    >
                      Subtotal
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {formatCurrency(selectedInvoice.amount)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={3}
                      className="py-3 px-4 text-right font-medium"
                    >
                      GST (0%)
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {formatCurrency(0)}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="py-3 px-4 text-right font-bold">
                      Total
                    </td>
                    <td className="py-3 px-4 text-right font-bold">
                      {formatCurrency(selectedInvoice.amount)}
                    </td>
                  </tr>
                  {selectedInvoice.status === "partially_paid" &&
                    selectedInvoice.amountPaid !== undefined && (
                      <>
                        <tr>
                          <td
                            colSpan={3}
                            className="py-3 px-4 text-right font-medium text-green-600"
                          >
                            Amount Paid
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-green-600">
                            {formatCurrency(selectedInvoice.amountPaid)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan={3}
                            className="py-3 px-4 text-right font-medium text-red-600"
                          >
                            Balance Due
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-red-600">
                            {formatCurrency(
                              selectedInvoice.amount -
                                selectedInvoice.amountPaid
                            )}
                          </td>
                        </tr>
                      </>
                    )}
                </tfoot>
              </table>

              {/* Payment Info & Terms */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    Payment Information
                  </h4>
                  <p className="text-gray-600">Bank: HDFC Bank</p>
                  <p className="text-gray-600">Account: 12345678901234</p>
                  <p className="text-gray-600">IFSC: HDFC0001234</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    Terms & Conditions
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Payment is due within 30 days from the date of invoice. Late
                    payments may be subject to a 1.5% monthly interest charge.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-gray-500 text-sm mt-12">
                <p>Thank you for your business!</p>
                <p>
                  For any questions regarding this invoice, please contact
                  accounts@b2bsupplies.com
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between items-center sm:justify-end gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={handlePrintInvoice}
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() =>
                  selectedInvoice && handleDownloadInvoice(selectedInvoice)
                }
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() =>
                  selectedInvoice && handleEmailInvoice(selectedInvoice)
                }
              >
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Button>
            </div>
            <Button type="button" onClick={() => setShowInvoiceModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceManagement;
