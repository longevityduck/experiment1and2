import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^[89]\d{7}$/; // Must start with 8 or 9 and have exactly 8 digits
    return phoneRegex.test(number);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 8) { // Limit to 8 digits
      setPhone(value);
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhoneNumber(phone)) {
      toast.error("Please enter a valid 8-digit phone number starting with 8 or 9");
      return;
    }

    setIsSubmitting(true);
    
    // TODO: Implement SMS verification logic here
    // For now, we'll simulate it
    setTimeout(() => {
      setIsVerifying(true);
      setIsSubmitting(false);
      toast.success("Verification code sent!");
    }, 1000);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implement verification logic here
    // For now, we'll simulate it
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/returning-user-options");
      toast.success("Successfully logged in!");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-md mx-auto pt-12">
        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Please verify your phone number to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isVerifying ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="Enter your 8-digit phone number"
                    maxLength={8}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Verification Code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Code
                  </label>
                  <Input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter verification code"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Verifying..." : "Verify"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;