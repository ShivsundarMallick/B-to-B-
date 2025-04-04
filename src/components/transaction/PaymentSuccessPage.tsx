import React, { useEffect } from "react";
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
import { useToast } from "../ui/use-toast";

interface LocationState {
  transactionId: string;
  amount: number;
  totalAmount: number;
  wasModified?: boolean;
}

export const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const { toast } = useToast();

  useEffect(() => {
    // If page is accessed directly without transaction data, redirect to products
    if (!state?.transactionId) {
      toast({
        title: "Error",
        description: "Invalid navigation. Redirecting to products page.",
        variant: "destructive",
      });
      navigate("/products");
    }
  }, [state, navigate, toast]);

  if (!state) {
    return null;
  }

  const remainingBalance = state.totalAmount - state.amount;
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <Card>
        <CardHeader className="bg-green-50">
          <CardTitle className="text-center text-green-600">
            Payment Request {state.wasModified ? "Modified & " : ""}Approved!
          </CardTitle>
          <CardDescription className="text-center">
            Your partial payment request has been approved
          </CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div className="space-y-4 max-w-md">
              <p className="text-lg font-medium">
                Transaction ID: {state.transactionId}
              </p>
              <p className="text-gray-600">
                Your partial payment request for ${state.amount.toFixed(2)} has
                been approved. You can now proceed with completing your payment.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg w-full max-w-md mx-auto my-6">
                <h3 className="font-medium text-gray-700 mb-4 text-left">
                  Payment Details
                </h3>
                <div className="space-y-3 text-sm text-left">
                  <div className="flex justify-between">
                    <span>Approved Amount:</span>
                    <span className="font-medium text-green-600">
                      ${state.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Order Amount:</span>
                    <span className="font-medium">
                      ${state.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining Balance:</span>
                    <span className="font-medium">
                      ${remainingBalance.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span>Approval Date:</span>
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Approval Time:</span>
                      <span>{formattedTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-700 text-sm">
                  Please proceed to make your payment using any of our approved
                  payment methods. The remaining balance will be due according
                  to the terms agreed upon.
                </p>
              </div> */}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 pt-4">
          <Button variant="outline" onClick={() => navigate("/products")}>
            Back to Products
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
