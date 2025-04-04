import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useTransactions } from "../../context/TransactionContext";
import { useToast } from "../ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface LocationState {
  transactionId: string;
  amount: number;
  totalAmount: number;
}

export const PaymentWaitingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const { getTransaction, updateTransactionStatus } = useTransactions();
  const { toast } = useToast();
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [isError, setIsError] = useState(false);
  const [transaction, setTransaction] = useState(
    state?.transactionId ? getTransaction(state.transactionId) : undefined
  );
  const [showModifiedDialog, setShowModifiedDialog] = useState(false);

  // Redirect to products if no transaction id is provided
  useEffect(() => {
    if (!state?.transactionId) {
      toast({
        title: "Error",
        description: "No transaction found. Redirecting to products page.",
        variant: "destructive",
      });
      navigate("/products");
      return;
    }

    // Get initial transaction
    const initialTransaction = getTransaction(state.transactionId);

    if (!initialTransaction) {
      console.error("Transaction not found:", state.transactionId);
      setIsError(true);
      toast({
        title: "Error",
        description:
          "Transaction details could not be loaded. Please try again.",
        variant: "destructive",
      });
    } else {
      setTransaction(initialTransaction);
      console.log("Initial transaction loaded:", initialTransaction);

      // Check if it's a modified transaction
      if (
        initialTransaction.status === "modified" &&
        initialTransaction.suggestedAmount
      ) {
        setShowModifiedDialog(true);
      }
    }
  }, [state, navigate, toast, getTransaction]);

  // Refresh transaction data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCounter((prev) => prev + 1);
      console.log("Refreshing transaction data...");
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const handleManualRefresh = () => {
    setRefreshCounter((prev) => prev + 1);
    toast({
      title: "Refreshing",
      description: "Checking for transaction updates...",
    });
  };

  // Update transaction whenever the refresh counter changes
  useEffect(() => {
    if (state?.transactionId) {
      console.log("Checking transaction status for ID:", state.transactionId);

      // First try using context
      let updatedTransaction = getTransaction(state.transactionId);

      // If not found by ID, try looking up by orderId in localStorage
      if (
        !updatedTransaction ||
        updatedTransaction.status === "pending" ||
        updatedTransaction.status === "modified"
      ) {
        try {
          console.log("Checking localStorage for updates...");
          const storedTransactions = JSON.parse(
            localStorage.getItem("transactions") || "[]"
          );

          // First look by transaction ID
          updatedTransaction = storedTransactions.find(
            (tx: any) => tx.id === state.transactionId
          );

          // If not found by ID or still pending, try finding by orderId (if we have it)
          if (
            (!updatedTransaction ||
              updatedTransaction.status === "pending" ||
              updatedTransaction.status === "modified") &&
            transaction?.orderId
          ) {
            console.log(
              "Looking for transaction by orderId:",
              transaction.orderId
            );
            const txByOrderId = storedTransactions.find(
              (tx: any) =>
                tx.orderId === transaction.orderId &&
                (tx.status === "approved" || tx.status === "modified")
            );

            if (txByOrderId) {
              console.log("Found transaction by orderId:", txByOrderId);
              updatedTransaction = txByOrderId;
            }
          }
        } catch (error) {
          console.error("Error checking localStorage:", error);
        }
      }

      if (updatedTransaction) {
        console.log("Transaction status:", updatedTransaction.status);
        setTransaction(updatedTransaction);
        setIsError(false);

        // Handle different transaction statuses
        if (updatedTransaction.status === "approved") {
          console.log("Transaction approved! Redirecting...");
          toast({
            title: "Payment Request Approved!",
            description:
              "Your partial payment request has been approved. You can now complete your payment.",
            variant: "success",
          });

          // Navigate to success page
          navigate("/payment/success", {
            state: {
              transactionId: state.transactionId,
              amount: updatedTransaction.requestedAmount,
              totalAmount: updatedTransaction.totalAmount,
            },
          });
        } else if (
          updatedTransaction.status === "modified" &&
          !showModifiedDialog
        ) {
          console.log(
            "Transaction modified with new amount:",
            updatedTransaction.suggestedAmount
          );
          setShowModifiedDialog(true);
        }
      } else {
        console.error("Failed to refresh transaction:", state.transactionId);
      }
    }
  }, [
    refreshCounter,
    state?.transactionId,
    getTransaction,
    toast,
    navigate,
    transaction?.orderId,
    showModifiedDialog,
  ]);

  // Handle response to modified amount
  const handleModifiedResponse = (accepted: boolean) => {
    if (!transaction) return;

    setShowModifiedDialog(false);

    if (accepted) {
      console.log(
        "User accepted modified amount:",
        transaction.suggestedAmount
      );
      toast({
        title: "Modified Amount Accepted",
        description: `You've accepted the new amount of $${transaction.suggestedAmount?.toFixed(
          2
        )}.`,
        variant: "success",
      });

      // Navigate to success page
      navigate("/payment/success", {
        state: {
          transactionId: transaction.id,
          amount: transaction.suggestedAmount,
          totalAmount: transaction.totalAmount,
          wasModified: true,
        },
      });
    } else {
      console.log("User declined modified amount");
      toast({
        title: "Modified Amount Declined",
        description: "You've declined the suggested payment amount.",
        variant: "destructive",
      });

      // Update transaction status to declined
      updateTransactionStatus(transaction.id, "declined");

      // Redirect to products page
      setTimeout(() => {
        navigate("/products");
      }, 2000);
    }
  };

  if (isError) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Card>
          <CardHeader className="bg-red-50">
            <CardTitle className="text-center text-red-600">
              Transaction Error
            </CardTitle>
            <CardDescription className="text-center">
              We couldn't load your transaction details.
            </CardDescription>
          </CardHeader>
          <CardContent className="py-8 text-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="text-gray-600">
                The transaction you're looking for couldn't be found or has been
                removed.
              </p>
              <Button onClick={handleManualRefresh} className="mt-2">
                Try Again
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-4">
            <Button variant="outline" onClick={() => navigate("/products")}>
              Back to Products
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Payment Request</CardTitle>
            <CardDescription className="text-center">
              Loading transaction details...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={() => navigate("/products")}>
              Back to Products
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Card>
          <CardHeader
            className={
              transaction.status === "modified" ? "bg-blue-100" : "bg-blue-50"
            }
          >
            <CardTitle className="text-center">
              {transaction.status === "modified"
                ? "Admin Suggested New Amount"
                : "Partial Payment Request Pending"}
            </CardTitle>
            <CardDescription className="text-center">
              {transaction.status === "modified"
                ? "The admin has suggested a different payment amount"
                : "Your request has been sent to the admin for approval"}
            </CardDescription>
          </CardHeader>
          <CardContent className="py-8 text-center">
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div className="space-y-2 max-w-md">
                <p className="text-lg font-medium">
                  Request #{transaction.orderId}
                </p>
                {transaction.status === "modified" ? (
                  <p className="text-gray-600">
                    The admin has suggested a new partial payment amount of $
                    {transaction.suggestedAmount?.toFixed(2)}. Please review and
                    accept or decline.
                  </p>
                ) : (
                  <p className="text-gray-600">
                    Your partial payment request of $
                    {transaction.requestedAmount.toFixed(2)} is awaiting admin
                    approval. This page will automatically update when the admin
                    responds.
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>

              {transaction.status === "modified" ? (
                <div className="flex gap-4 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => handleModifiedResponse(false)}
                  >
                    Decline
                  </Button>
                  <Button onClick={() => handleModifiedResponse(true)}>
                    Accept New Amount
                  </Button>
                </div>
              ) : (
                <>
                  <div className="animate-pulse mt-4 flex space-x-2">
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                  </div>

                  <Button
                    onClick={handleManualRefresh}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Check for Updates
                  </Button>
                </>
              )}

              <div className="bg-gray-50 rounded-lg p-4 w-full max-w-md">
                <h3 className="font-medium text-gray-700 mb-2">
                  Order Summary
                </h3>
                <div className="space-y-1 text-sm text-left">
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-medium">
                      ${transaction.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  {transaction.status === "modified" ? (
                    <>
                      <div className="flex justify-between">
                        <span>Original Request:</span>
                        <span className="font-medium line-through text-gray-500">
                          ${transaction.requestedAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-blue-700">
                        <span>New Suggested Amount:</span>
                        <span className="font-medium">
                          ${transaction.suggestedAmount?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>New Remaining Balance:</span>
                        <span className="font-medium">
                          $
                          {(
                            transaction.totalAmount -
                            (transaction.suggestedAmount || 0)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>Partial Payment:</span>
                        <span className="font-medium">
                          ${transaction.requestedAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining Balance:</span>
                        <span className="font-medium">
                          $
                          {(
                            transaction.totalAmount -
                            transaction.requestedAmount
                          ).toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="flex justify-center pt-4">
            <Button variant="outline" onClick={() => navigate("/products")}>
              Continue Shopping
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Dialog for modified amount (as an alternative UI option) */}
      <Dialog open={showModifiedDialog} onOpenChange={setShowModifiedDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Modified Your Payment</DialogTitle>
            <DialogDescription>
              The admin has suggested a different amount for your partial
              payment request.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-gray-50 p-4 rounded-md space-y-3 my-4">
            <div className="flex justify-between">
              <span>Your requested amount:</span>
              <span className="font-medium line-through text-gray-500">
                ${transaction?.requestedAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-blue-700">
              <span>Admin suggested amount:</span>
              <span className="font-bold">
                ${transaction?.suggestedAmount?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Remaining balance:</span>
              <span>
                $
                {transaction
                  ? (
                      transaction.totalAmount -
                      (transaction.suggestedAmount || 0)
                    ).toFixed(2)
                  : "0.00"}
              </span>
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleModifiedResponse(false)}
            >
              Decline
            </Button>
            <Button type="button" onClick={() => handleModifiedResponse(true)}>
              Accept New Amount
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
