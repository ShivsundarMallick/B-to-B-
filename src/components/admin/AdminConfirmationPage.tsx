import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { useToast } from "../ui/use-toast";
import { useTransactions } from "../../context/TransactionContext";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const AdminConfirmationPage: React.FC = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getTransaction, updateTransactionStatus, suggestTransactionAmount } =
    useTransactions();
  const [transaction, setTransaction] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [suggestedAmount, setSuggestedAmount] = useState<number>(0);

  // Calculate remaining balance
  const remainingBalance = transaction
    ? transaction.totalAmount - transaction.requestedAmount
    : 0;

  // Calculate remaining balance based on suggested amount
  const suggestedRemainingBalance = transaction
    ? transaction.totalAmount - suggestedAmount
    : 0;

  useEffect(() => {
    if (transactionId) {
      console.log("Looking up transaction:", transactionId);
      const foundTransaction = getTransaction(transactionId);

      if (foundTransaction) {
        console.log("Found transaction:", foundTransaction);
        setTransaction(foundTransaction);
        // Set initial suggested amount to the requested amount
        setSuggestedAmount(foundTransaction.requestedAmount);
      } else {
        console.error("Transaction not found:", transactionId);
        toast({
          title: "Error",
          description: "Transaction not found",
          variant: "destructive",
        });
        navigate("/admin/transactions");
      }
    }
  }, [transactionId, getTransaction, toast, navigate]);

  const handleApprove = () => {
    if (!transaction) return;

    setIsProcessing(true);

    try {
      // Update transaction status
      updateTransactionStatus(transaction.id, "approved");

      // Force direct localStorage update for extra reliability
      try {
        const storedTransactions = JSON.parse(
          localStorage.getItem("transactions") || "[]"
        );
        const updatedTransactions = storedTransactions.map((tx: any) =>
          tx.id === transaction.id || tx.orderId === transaction.orderId
            ? { ...tx, status: "approved" }
            : tx
        );
        localStorage.setItem(
          "transactions",
          JSON.stringify(updatedTransactions)
        );
        console.log("Directly updated transaction in localStorage");
      } catch (err) {
        console.error("Error updating localStorage directly:", err);
      }

      toast({
        title: "Transaction Approved",
        description: "The partial payment request has been approved.",
        variant: "success",
      });

      setTimeout(() => {
        setIsProcessing(false);
        navigate("/admin/transactions");
      }, 1000);
    } catch (error) {
      console.error("Error approving transaction:", error);
      toast({
        title: "Error",
        description: "Failed to approve transaction. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleDecline = () => {
    if (!transaction) return;

    setIsProcessing(true);

    try {
      // Update transaction status
      updateTransactionStatus(transaction.id, "declined");

      toast({
        title: "Transaction Declined",
        description: "The partial payment request has been declined.",
        variant: "destructive",
      });

      setTimeout(() => {
        setIsProcessing(false);
        navigate("/admin/transactions");
      }, 1000);
    } catch (error) {
      console.error("Error declining transaction:", error);
      toast({
        title: "Error",
        description: "Failed to decline transaction. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleSuggestAmount = () => {
    if (!transaction) return;

    setIsProcessing(true);

    try {
      // Validate suggested amount
      if (suggestedAmount <= 0 || suggestedAmount >= transaction.totalAmount) {
        toast({
          title: "Invalid Amount",
          description:
            "Please enter a valid amount that is less than the total.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Update transaction with suggested amount
      suggestTransactionAmount(transaction.id, suggestedAmount);

      toast({
        title: "Amount Modified",
        description: `A new amount of $${suggestedAmount.toFixed(
          2
        )} has been suggested to the customer.`,
        variant: "success",
      });

      setTimeout(() => {
        setIsProcessing(false);
        navigate("/admin/transactions");
      }, 1000);
    } catch (error) {
      console.error("Error suggesting amount:", error);
      toast({
        title: "Error",
        description: "Failed to suggest the modified amount. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  if (!transaction) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transaction Details</h1>
          <p className="text-gray-500">
            Review the payment request before approval
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/transactions")}
        >
          Back to Transactions
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="bg-primary/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Order #{transaction.orderId}</CardTitle>
              <CardDescription>
                Created on{" "}
                {new Date(transaction.createdAt).toLocaleDateString()} at{" "}
                {new Date(transaction.createdAt).toLocaleTimeString()}
              </CardDescription>
            </div>
            <Badge
              variant={
                transaction.status === "pending"
                  ? "outline"
                  : transaction.status === "approved"
                  ? "success"
                  : transaction.status === "modified"
                  ? "secondary"
                  : "destructive"
              }
              className={
                transaction.status === "pending"
                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                  : transaction.status === "approved"
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : transaction.status === "modified"
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                  : "bg-red-100 text-red-800 hover:bg-red-100"
              }
            >
              {transaction.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="font-medium text-lg mb-2">Customer Information</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="font-semibold">{transaction.customer}</div>
              <div className="text-sm text-gray-600">
                Customer ID: {transaction.userId}
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-medium text-lg mb-2">Products</h3>
            <div className="border rounded-md divide-y">
              {transaction.products.map((product: any) => (
                <div
                  key={product.id}
                  className="p-4 flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      ${product.price.toFixed(2)} x {product.quantity}
                    </div>
                  </div>
                  <div className="font-semibold">
                    ${(product.price * product.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="font-medium text-lg mb-2">Payment Details</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Order Amount</span>
                  <span className="font-bold">
                    ${transaction.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Customer's Partial Payment</span>
                  <span className="font-semibold text-primary">
                    ${transaction.requestedAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining Balance</span>
                  <span>${remainingBalance.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Decision */}
      {transaction.status === "pending" ? (
        isModifying ? (
          <Card>
            <CardHeader>
              <CardTitle>Modify Payment Amount</CardTitle>
              <CardDescription>
                Suggest a different amount for this payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="suggestedAmount">Suggested Amount ($)</Label>
                  <Input
                    id="suggestedAmount"
                    type="number"
                    value={suggestedAmount}
                    onChange={(e) =>
                      setSuggestedAmount(parseFloat(e.target.value))
                    }
                    min={1}
                    max={transaction.totalAmount - 0.01}
                    step={0.01}
                    className="font-medium"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-md space-y-2">
                  <div className="flex justify-between">
                    <span>Original Requested Amount</span>
                    <span className="font-medium">
                      ${transaction.requestedAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>New Suggested Amount</span>
                    <span className="font-bold text-blue-700">
                      ${suggestedAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>New Remaining Balance</span>
                    <span>${suggestedRemainingBalance.toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  The customer will be asked to accept or decline this modified
                  amount.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setIsModifying(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSuggestAmount}
                disabled={
                  isProcessing ||
                  suggestedAmount <= 0 ||
                  suggestedAmount >= transaction.totalAmount
                }
              >
                {isProcessing ? "Processing..." : "Submit Modified Amount"}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Review Decision</CardTitle>
              <CardDescription>
                Approve, decline, or modify this partial payment request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Review the details above carefully before making a decision. You
                can approve the requested amount, decline it, or suggest a
                different amount.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="destructive"
                onClick={handleDecline}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Decline Request"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsModifying(true)}
                disabled={isProcessing}
              >
                Modify Amount
              </Button>
              <Button onClick={handleApprove} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Approve Request"}
              </Button>
            </CardFooter>
          </Card>
        )
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Transaction Completed</CardTitle>
            <CardDescription>
              This transaction has already been{" "}
              {transaction.status === "approved"
                ? "approved"
                : transaction.status === "modified"
                ? "modified with a suggested amount"
                : "declined"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {transaction.status === "approved"
                ? "The customer can now proceed with the payment."
                : transaction.status === "modified"
                ? `You've suggested a new amount of $${transaction.suggestedAmount?.toFixed(
                    2
                  )}. Waiting for customer response.`
                : "The customer has been notified that their request was declined."}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/transactions")}
              className="w-full"
            >
              Back to Transactions
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
