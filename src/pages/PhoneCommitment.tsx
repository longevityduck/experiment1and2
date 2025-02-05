
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Phone, User } from "lucide-react";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import { ProgressIndicator } from "@/components/career-guidance/ProgressIndicator";

const PhoneCommitment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
      setPhoneNumber(value);
    }
  };

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^[89]\d{7}$/;
    return phoneRegex.test(number);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 8-digit phone number starting with 8 or 9",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Success!",
      description: "Thank you for committing to your career journey. You'll receive updates and insights to help you achieve your goals.",
    });
    
    setIsSubmitting(false);
    navigate("/success");
  };

  return (
    <FormContainer title="Stay Connected with your Career Plan">
      <ProgressIndicator />
      <div className="space-y-6">
        <div className="text-sm text-gray-600 space-y-3 mb-4">
          <p>By providing your phone number, you'll receive personalized career tips and updates through WhatsApp, carefully curated to match your unique career path and goals.</p>
          <p>We'll send you relevant insights, opportunities, and guidance to help you progress in your career journey.</p>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-2">
              Name
            </label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-12 h-14 text-lg border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/50"
              />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="phone" className="block text-lg font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative group">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors" />
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your handphone number"
                value={phoneNumber}
                onChange={handlePhoneChange}
                className="pl-12 h-14 text-lg border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/50"
                maxLength={8}
              />
            </div>
          </div>
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
            {isSubmitting ? "Submitting..." : "Lock in your plan, secure your future"}
          </Button>
        </div>
      </div>
    </FormContainer>
  );
};

export default PhoneCommitment;
