import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { useTransactions } from "../../context/TransactionContext";
import { useToast } from "../ui/use-toast";
import { Badge } from "../ui/badge";
// import { Separator } from "../ui/separator";

export const AdminTransactionsPage: React.FC = () => {
  const {
    transactions,
    clearTransactions,
    getPendingTransactions,
    addDummyTransaction,
  } = useTransactions();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [, setRefreshCounter] = useState(0);
  const [storageDebugInfo, setStorageDebugInfo] = useState<string>("");

  // Check transactions periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCounter((prev) => prev + 1);
      console.log("Admin: Refreshing transactions...");
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Function to manually check localStorage
  const checkLocalStorage = () => {
    try {
      const rawData = localStorage.getItem("transactions");
      setStorageDebugInfo(rawData || "No transactions found in localStorage");
      console.log("localStorage transactions:", rawData);

      toast({
        title: "LocalStorage Check",
        description: rawData
          ? `Found ${JSON.parse(rawData).length} transactions in localStorage`
          : "No transactions found in localStorage",
      });
    } catch (error) {
      console.error("Error checking localStorage:", error);
      setStorageDebugInfo("Error parsing transactions from localStorage");
    }
  };

  // Add a demo transaction
  const handleAddDummyTransaction = () => {
    const newTransaction = addDummyTransaction();

    toast({
      title: "Demo Transaction Created",
      description: `Transaction ID: ${newTransaction.id} for $${newTransaction.requestedAmount}`,
      variant: "success",
    });

    console.log("Created demo transaction:", newTransaction);
  };

  // Handle clear transactions
  const handleClearTransactions = () => {
    if (window.confirm("Are you sure you want to clear all transactions?")) {
      clearTransactions();
      toast({
        title: "Transactions Cleared",
        description: "All transactions have been removed.",
      });
    }
  };

  // Force refresh transactions from storage
  const handleRefreshTransactions = () => {
    try {
      // Get transactions directly from localStorage
      const storedTransactions = JSON.parse(
        localStorage.getItem("transactions") || "[]"
      );
      console.log("Transactions from localStorage:", storedTransactions);

      // Update refresh counter to trigger useEffect
      setRefreshCounter((prev) => prev + 1);

      toast({
        title: "Refreshing Transactions",
        description: `Found ${storedTransactions.length} transactions in localStorage`,
      });
    } catch (error) {
      console.error("Error refreshing transactions:", error);
      toast({
        title: "Error",
        description: "Failed to refresh transactions from storage",
        variant: "destructive",
      });
    }
  };

  // Get the latest transactions by combining state and localStorage
  const getLatestTransactions = () => {
    // Get transactions from context
    const contextTransactions = [...transactions];

    // Get transactions from localStorage
    try {
      const storedTransactions = JSON.parse(
        localStorage.getItem("transactions") || "[]"
      );

      // Add any transaction from localStorage that isn't already in the context
      storedTransactions.forEach((storedTx: any) => {
        if (!contextTransactions.some((tx) => tx.id === storedTx.id)) {
          contextTransactions.push(storedTx);
        }
      });
    } catch (error) {
      console.error("Error getting transactions from localStorage:", error);
    }

    return contextTransactions;
  };

  // Sort transactions by createdAt (newest first)
  const sortedTransactions = getLatestTransactions().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">
            Manage transaction requests from customers
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button
            onClick={() => {
              localStorage.removeItem("isAdminAuthenticated");
              navigate("/admin/login");
            }}
            variant="outline"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Admin Actions */}
      <Card className="mb-6">
        <CardHeader className="bg-secondary/10">
          <CardTitle>Admin Actions</CardTitle>
          <CardDescription>
            Tools and utilities for managing the system
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleAddDummyTransaction} variant="default">
              Create Demo Transaction
            </Button>
            <Button onClick={handleRefreshTransactions} variant="outline">
              Refresh Transactions
            </Button>
            <Button onClick={checkLocalStorage} variant="outline">
              Debug Storage
            </Button>
            <Button onClick={handleClearTransactions} variant="destructive">
              Clear All Transactions
            </Button>
          </div>

          {storageDebugInfo && (
            <div className="mt-4 p-3 bg-gray-100 rounded-md overflow-auto max-h-40 text-xs">
              <pre>{storageDebugInfo}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction List */}
      <Card>
        <CardHeader className="bg-primary/10">
          <CardTitle>Transaction Requests</CardTitle>
          <CardDescription>
            {getPendingTransactions().length} pending requests require your
            attention
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {sortedTransactions.length > 0 ? (
            <div className="space-y-4">
              {sortedTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{transaction.customer}</h3>
                        <Badge
                          variant={
                            transaction.status === "pending"
                              ? "outline"
                              : transaction.status === "approved"
                              ? "success"
                              : "destructive"
                          }
                          className={
                            transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : transaction.status === "approved"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {transaction.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        Order #{transaction.orderId}
                      </p>
                      <p className="text-sm text-gray-500">
                        Created:{" "}
                        {new Date(transaction.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-right">
                        <span className="text-sm text-gray-500">
                          Requested:
                        </span>{" "}
                        <span className="font-semibold">
                          ${transaction.requestedAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">Total:</span>{" "}
                        <span className="font-semibold">
                          ${transaction.totalAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-2">
                        {transaction.status === "pending" ? (
                          <Button
                            onClick={() =>
                              navigate(`/admin/transactions/${transaction.id}`)
                            }
                            size="sm"
                          >
                            Review Request
                          </Button>
                        ) : (
                          <Button
                            onClick={() =>
                              navigate(`/admin/transactions/${transaction.id}`)
                            }
                            variant="outline"
                            size="sm"
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No transactions yet
              </h3>
              <p className="text-gray-500 mb-4">
                There are no transaction requests to display.
              </p>
              <Button onClick={handleAddDummyTransaction}>
                Create a Demo Transaction
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
