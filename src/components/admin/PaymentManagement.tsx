import React, { useState } from "react";
import { Check, X, ChevronDown, CreditCard } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";

// Mock transaction data
const mockTransactions = [
  {
    id: "txn-001",
    customer: "Rahul Sharma",
    company: "Infosys",
    amount: 24500,
    requestedAmount: 24500,
    date: "2023-07-15T10:30:00",
    status: "pending",
    products: [{ id: "p1", name: "Dell Laptop", quantity: 2, price: 12250 }],
  },
  {
    id: "txn-002",
    customer: "Priya Patel",
    company: "TCS",
    amount: 35600,
    requestedAmount: 20000,
    date: "2023-07-14T14:45:00",
    status: "partial",
    products: [
      { id: "p2", name: "HP Monitor", quantity: 4, price: 5400 },
      { id: "p3", name: "Keyboard", quantity: 10, price: 1400 },
    ],
  },
  {
    id: "txn-003",
    customer: "Amit Kumar",
    company: "Wipro",
    amount: 15800,
    requestedAmount: 15800,
    date: "2023-07-13T09:15:00",
    status: "completed",
    products: [{ id: "p4", name: "External SSD", quantity: 5, price: 3160 }],
  },
  {
    id: "txn-004",
    customer: "Sneha Gupta",
    company: "Tech Mahindra",
    amount: 8700,
    requestedAmount: 5000,
    date: "2023-07-12T16:20:00",
    status: "partial",
    products: [{ id: "p5", name: "Wireless Mouse", quantity: 20, price: 435 }],
  },
  {
    id: "txn-005",
    customer: "Vikram Singh",
    company: "HCL",
    amount: 42300,
    requestedAmount: 0,
    date: "2023-07-11T11:10:00",
    status: "pending",
    products: [{ id: "p6", name: "Printer", quantity: 3, price: 14100 }],
  },
];

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const PaymentManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(
    null
  );

  // Filter transactions based on selected tab
  const filteredTransactions = mockTransactions.filter((txn) => {
    if (selectedTab === "pending") return txn.status === "pending";
    if (selectedTab === "partial") return txn.status === "partial";
    if (selectedTab === "completed") return txn.status === "completed";
    return true; // 'all' tab
  });

  const toggleExpand = (id: string) => {
    setExpandedTransaction(expandedTransaction === id ? null : id);
  };

  // Handle payment actions
  const approvePayment = (id: string) => {
    console.log(`Payment ${id} approved`);
    // In a real app, this would update the transaction status
  };

  const rejectPayment = (id: string) => {
    console.log(`Payment ${id} rejected`);
    // In a real app, this would update the transaction status
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Pending
          </Badge>
        );
      case "partial":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Partial
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
            Payment Management
          </CardTitle>
          <CardDescription>
            View and manage payment requests from customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="partial">Partial</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {renderTransactionList(filteredTransactions)}
            </TabsContent>
            <TabsContent value="pending" className="mt-0">
              {renderTransactionList(filteredTransactions)}
            </TabsContent>
            <TabsContent value="partial" className="mt-0">
              {renderTransactionList(filteredTransactions)}
            </TabsContent>
            <TabsContent value="completed" className="mt-0">
              {renderTransactionList(filteredTransactions)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  function renderTransactionList(transactions: typeof mockTransactions) {
    if (transactions.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No transactions found
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="border rounded-lg overflow-hidden"
          >
            <div
              className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100"
              onClick={() => toggleExpand(transaction.id)}
            >
              <div className="flex items-center space-x-4">
                <div>
                  <p className="font-semibold">{transaction.customer}</p>
                  <p className="text-sm text-gray-500">{transaction.company}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </p>
                </div>
                <div>{getStatusBadge(transaction.status)}</div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    expandedTransaction === transaction.id
                      ? "transform rotate-180"
                      : ""
                  }`}
                />
              </div>
            </div>

            {expandedTransaction === transaction.id && (
              <div className="p-4 border-t">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Transaction Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Transaction ID</p>
                      <p className="font-medium">{transaction.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium capitalize">
                        {transaction.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-medium">
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Requested Amount</p>
                      <p className="font-medium">
                        {formatCurrency(transaction.requestedAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Products
                  </h4>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Product
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Quantity
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transaction.products.map((product) => (
                          <tr key={product.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {product.name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {product.quantity}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(product.price)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(product.price * product.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {transaction.status !== "completed" && (
                  <div className="flex justify-end space-x-2">
                    {transaction.status === "pending" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => rejectPayment(transaction.id)}
                        className="flex items-center"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    )}

                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => approvePayment(transaction.id)}
                      className="flex items-center"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      {transaction.status === "partial"
                        ? "Mark as Completed"
                        : "Approve"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
};

export default PaymentManagement;
