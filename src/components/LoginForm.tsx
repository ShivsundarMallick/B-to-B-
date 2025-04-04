import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useAuth } from "../context/AuthContext";
import { toast } from "./ui/use-toast";

export default function LoginForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGenerateOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) return;
    // In a real app, this would call an API to generate and send an OTP
    setOtpGenerated(true);
    // For demo purposes, we'll use a dummy OTP
    console.log("OTP Generated: 123456");
  };

  const handleVerifyOTP = () => {
    // Validate OTP (For demo, we're using a static OTP)
    if (otp === "123456") {
      setIsVerifying(true);

      // Simulate API call
      setTimeout(() => {
        setIsVerifying(false);
        setVerified(true);

        // Log the user in
        login(phoneNumber);

        toast({
          title: "Login Successful",
          description: "You have been logged in successfully!",
          variant: "success",
        });

        // Navigate to products page
        navigate("/products");
      }, 1500);
    } else {
      toast({
        title: "Invalid OTP",
        description: "The OTP you entered is incorrect. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="bg-gradient"></div>
      <div className="min-h-screen w-full flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-md mx-auto glassmorphism">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Login
            </CardTitle>
            <CardDescription className="text-center text-white/80">
              Enter your phone number to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (otpGenerated) {
                  handleVerifyOTP();
                } else {
                  handleGenerateOTP(e);
                }
              }}
            >
              <AnimatePresence>
                {otpGenerated && (
                  <motion.div
                    className="space-y-2 mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="text-center text-lg font-bold bg-white/40 text-black"
                      maxLength={6}
                      required
                    />
                    <p className="text-xs text-white/80 text-center">
                      We've sent a code to {phoneNumber}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, ""))
                  }
                  disabled={otpGenerated}
                  required
                  type="tel"
                  className="mb-2"
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-4"
                variant="glass"
                disabled={
                  isVerifying ||
                  (otpGenerated ? otp.length !== 6 : phoneNumber.length < 10)
                }
              >
                {isVerifying
                  ? "Verifying..."
                  : otpGenerated
                  ? "Verify OTP"
                  : "Generate OTP"}
              </Button>
            </form>
          </CardContent>
          <Separator className="my-2" />
          <CardFooter className="flex-col space-y-2">
            <p className="text-xs text-white/70 text-center">
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </p>
            <div className="text-center mt-2">
              <Link
                to="/admin/login"
                className="text-xs text-white hover:underline"
              >
                Admin Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
