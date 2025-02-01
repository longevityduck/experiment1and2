import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Phone } from "lucide-react";

const PhoneCommitment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    // Here you would typically make an API call to save the phone number
    // For now, we'll just simulate success
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Success!",
      description: "Thank you for committing to your career journey. You'll receive updates and insights to help you achieve your goals.",
    });
    
    setIsSubmitting(false);
    navigate("/success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Stay Connected</CardTitle>
            <CardDescription>
              By providing your phone number, you'll receive:
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Timely reminders for your next career steps</li>
                <li>Curated insights tailored to your career journey</li>
                <li>Motivational messages to keep you on track</li>
              </ul>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="phone" className="block text-lg font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-12 h-14 text-lg border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/50"
                  />
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  We'll use this to send you important updates about your career journey
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="w-full"
                >
                  Go Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Commit to Journey"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhoneCommitment;