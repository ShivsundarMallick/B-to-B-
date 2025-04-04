import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useToast } from "../ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "../ui/dialog";
import { useLocation, useNavigate } from "react-router-dom";
import { useTransactions } from "../../context/TransactionContext";
import { useAuth } from "../../context/AuthContext";

interface LocationState {
  singleProduct?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
}

export const TransactionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const state = location.state as LocationState | null;
  const { addTransaction, getTransaction } = useTransactions();
  const { currentUser } = useAuth();

  // Payment options state
  const [paymentOption, setPaymentOption] = useState<"full" | "partial">(
    "full"
  );
  const [partialAmount, setPartialAmount] = useState<number>(0);
  const [adminSuggestedAmount, setAdminSuggestedAmount] = useState<
    number | null
  >(null);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "completed" | "declined"
  >("pending");

  // Payment form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  // For logging/debugging purposes
  useEffect(() => {
    console.log("CartItems in TransactionPage:", cart);
    console.log("Total Price:", totalPrice);
    console.log("Single Product:", state?.singleProduct);
  }, [cart, totalPrice, state]);

  // Determine if we're dealing with a single product or the cart
  const isSingleProduct = !!state?.singleProduct;
  const totalAmount =
    isSingleProduct && state?.singleProduct
      ? state.singleProduct.price * state.singleProduct.quantity
      : totalPrice;

  // Set default partial amount to 50% of total
  useEffect(() => {
    setPartialAmount(Math.round(totalAmount * 0.5 * 100) / 100);
  }, [totalAmount]);

  // Handle form submission
  const handlePayment = () => {
    setPaymentStatus("processing");

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus("completed");
      toast({
        title: "Payment Successful",
        description: "Your order has been placed successfully!",
        variant: "success",
      });
      // Clear cart
      clearCart();

      // Redirect to success page or products page after 2 seconds
      setTimeout(() => {
        navigate("/products");
      }, 2000);
    }, 1500);
  };

  // Handle partial payment request
  const handlePartialPaymentRequest = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add products before proceeding.",
        variant: "destructive",
      });
      return;
    }

    const requestedAmount = parseFloat(partialAmount.toString());
    if (isNaN(requestedAmount) || requestedAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      setPaymentStatus("pending");
      return;
    }

    if (requestedAmount >= totalAmount) {
      toast({
        title: "Invalid Amount",
        description: "Partial payment must be less than the total amount.",
        variant: "destructive",
      });
      setPaymentStatus("pending");
      return;
    }

    setPaymentStatus("processing");

    try {
      // Create list of products from cart
      const products = cart.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        company: item.company,
      }));

      // Get user details from localStorage
      const userId = currentUser?.id || "guest";
      const customerName = currentUser?.name || "Guest User";

      console.log("Creating partial payment request:", {
        products,
        userId,
        totalAmount: totalAmount,
        requestedAmount,
      });

      // Create a transaction
      const transactionId = addTransaction(
        userId,
        customerName,
        products,
        totalAmount,
        requestedAmount
      );

      // Verify the transaction was stored
      const storedTransaction = getTransaction(transactionId);
      if (!storedTransaction) {
        throw new Error("Failed to store transaction");
      }

      toast({
        title: "Request Submitted",
        description:
          "Your partial payment request has been submitted for approval.",
      });

      // Navigate to waiting page
      navigate("/payment/waiting", {
        state: {
          transactionId,
          amount: requestedAmount,
          totalAmount: totalAmount,
        },
      });
    } catch (error) {
      console.error("Error processing transaction:", error);
      toast({
        title: "Transaction Failed",
        description:
          "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
      setPaymentStatus("pending");
    }
  };

  // Handle admin suggestion response
  const handleAdminSuggestionResponse = (accepted: boolean) => {
    setShowAdminDialog(false);

    if (accepted && adminSuggestedAmount) {
      toast({
        title: "Modified Payment Accepted",
        description: `Your payment of $${adminSuggestedAmount.toFixed(
          2
        )} has been processed.`,
        variant: "success",
      });
      setPaymentStatus("completed");
      // Clear cart
      clearCart();

      // Redirect to success page or products page after 2 seconds
      setTimeout(() => {
        navigate("/products");
      }, 2000);
    } else {
      toast({
        title: "Transaction Declined",
        description: "You've declined the modified payment amount.",
        variant: "destructive",
      });
      setPaymentStatus("declined");
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");

    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2)}`;
    }

    return value;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue.slice(0, 19)); // 16 digits + 3 spaces
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiry(e.target.value);
    setExpiry(formattedValue.slice(0, 5)); // MM/YY format
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCvv(value.slice(0, 3));
  };

  if (paymentStatus === "completed") {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Card className="w-full">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-center text-green-600">
              Payment Successful! 🎉
            </CardTitle>
            <CardDescription className="text-center">
              Your order has been placed successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center gap-4">
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
              <p className="text-center text-gray-600">
                Thank you for your purchase! We're redirecting you to the
                products page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === "declined") {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Card className="w-full">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-center text-red-600">
              Transaction Declined
            </CardTitle>
            <CardDescription className="text-center">
              You've declined the modified payment amount.
            </CardDescription>
          </CardHeader>
          <CardContent className="py-8">
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="text-center text-gray-600">
                You can try again or adjust your payment options.
              </p>
              <Button
                onClick={() => {
                  setPaymentStatus("pending");
                  setPaymentOption("full");
                }}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if there are items to checkout
  const hasItems = isSingleProduct || cart.length > 0;

  // If no items in both single product and cart, show empty cart message
  if (!hasItems) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <Card className="mb-8 p-8">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Your cart is empty</h3>
            <p className="text-gray-500">
              There are no items in your cart to checkout.
            </p>
            <Button className="mt-4" onClick={() => navigate("/products")}>
              Continue Shopping
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Order Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {isSingleProduct && state?.singleProduct ? (
            <div className="flex items-center gap-4 py-2">
              <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={state.singleProduct.image}
                  alt={state.singleProduct.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{state.singleProduct.name}</h4>
                <div className="text-sm text-gray-500">
                  ${state.singleProduct.price.toFixed(2)} x{" "}
                  {state.singleProduct.quantity}
                </div>
              </div>
              <div className="font-semibold">
                $
                {(
                  state.singleProduct.price * state.singleProduct.quantity
                ).toFixed(2)}
              </div>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-2">
                <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <div className="text-sm text-gray-500">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </div>
                </div>
                <div className="font-semibold">
                  ${(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))
          )}

          <Separator className="my-4" />

          <div className="flex justify-between items-center">
            <span className="font-medium text-lg">Total</span>
            <span className="font-bold text-lg">${totalAmount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Options */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Payment Options</CardTitle>
          <CardDescription>Select how you would like to pay</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={paymentOption}
            onValueChange={(value: string) =>
              setPaymentOption(value as "full" | "partial")
            }
            className="space-y-4"
          >
            <div
              className={`flex items-center p-3 rounded-md border-2 ${
                paymentOption === "full"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200"
              }`}
            >
              <RadioGroupItem value="full" id="full" className="mr-3" />
              <div className="flex-1">
                <Label
                  htmlFor="full"
                  className="font-medium text-black flex items-center text-base"
                >
                  Full Payment
                  <span className="ml-2 font-bold">
                    (${totalAmount.toFixed(2)})
                  </span>
                </Label>
                <p className="text-gray-500 text-sm">
                  Pay the entire amount in one transaction
                </p>
              </div>
            </div>

            <div
              className={`flex items-center p-3 rounded-md border-2 ${
                paymentOption === "partial"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200"
              }`}
            >
              <RadioGroupItem value="partial" id="partial" className="mr-3" />
              <div className="flex-1">
                <Label
                  htmlFor="partial"
                  className="font-medium text-black flex items-center text-base"
                >
                  Partial Payment
                </Label>
                <p className="text-gray-500 text-sm">
                  Pay a portion now and the rest later
                </p>
              </div>
            </div>
          </RadioGroup>

          {paymentOption === "partial" && (
            <div className="mt-4 p-4 border rounded-md bg-blue-50 border-blue-200">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="partialAmount" className="text-black">
                    Partial Amount
                  </Label>
                  <Input
                    id="partialAmount"
                    type="number"
                    min={1}
                    max={totalAmount - 0.01}
                    step={0.01}
                    value={partialAmount}
                    onChange={(e) => setPartialAmount(Number(e.target.value))}
                    className="mt-1 text-black border-gray-300 bg-white"
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-black">Remaining Balance</span>
                  <span className="font-medium text-black">
                    ${(totalAmount - partialAmount).toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  Note: Partial payments require admin confirmation before
                  processing.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Details */}
      {paymentOption === "full" ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Enter your payment information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="cardNumber" className="text-black">
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="text-black border-gray-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="expiry" className="text-black">
                    Expiry Date
                  </Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiryChange}
                    className="text-black border-gray-300 bg-white"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="cvv" className="text-black">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={handleCvvChange}
                    className="text-black border-gray-300 bg-white"
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="upiId" className="text-black">
                  UPI ID (Optional)
                </Label>
                <Input
                  id="upiId"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="text-black border-gray-300 bg-white"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              size="lg"
              onClick={handlePayment}
              disabled={
                paymentStatus === "processing" || !cardNumber || !expiry || !cvv
              }
            >
              {paymentStatus === "processing"
                ? "Processing..."
                : `Pay $${totalAmount.toFixed(2)}`}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Request Partial Payment</CardTitle>
            <CardDescription>Submit for admin approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-4">
              <div className="flex justify-between mb-2">
                <span className="text-black">Total Amount:</span>
                <span className="font-medium text-black">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-black">Partial Payment:</span>
                <span className="font-medium text-black">
                  ${partialAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Remaining Balance:</span>
                <span className="font-medium text-black">
                  ${(totalAmount - partialAmount).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              size="lg"
              onClick={handlePartialPaymentRequest}
              disabled={
                paymentStatus === "processing" ||
                partialAmount <= 0 ||
                partialAmount >= totalAmount
              }
            >
              {paymentStatus === "processing"
                ? "Processing..."
                : "Request Admin Confirmation"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Back to Shopping Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => navigate("/products")}
          disabled={paymentStatus === "processing"}
        >
          Back to Shopping
        </Button>
      </div>

      {/* Admin Confirmation Dialog */}
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Modified Your Payment</DialogTitle>
            <DialogDescription>
              The admin has suggested a different partial payment amount.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex justify-between mb-2">
              <span>Your requested amount:</span>
              <span className="font-medium">${partialAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-primary font-bold">
              <span>Admin suggested amount:</span>
              <span>${adminSuggestedAmount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining balance:</span>
              <span className="font-medium">
                $
                {adminSuggestedAmount
                  ? (totalAmount - adminSuggestedAmount).toFixed(2)
                  : "0.00"}
              </span>
            </div>
          </div>
          <DialogFooter className="flex sm:justify-between">
            <Button
              variant="outline"
              onClick={() => handleAdminSuggestionResponse(false)}
            >
              Decline
            </Button>
            <Button onClick={() => handleAdminSuggestionResponse(true)}>
              Accept & Pay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
