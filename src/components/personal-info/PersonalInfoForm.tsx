
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/utils/storage";
import { CareerInfo } from "@/types/career";

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Professional Services",
  "Retail",
  "Other",
];

export interface PersonalInfoFormData {
  age: string;
  industry: string;
  customIndustry: string;
  occupation: string;
  experience: string;
}

export const PersonalInfoForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PersonalInfoFormData>({
    age: "",
    industry: "",
    customIndustry: "",
    occupation: "",
    experience: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate age
      const age = Number(formData.age);
      if (age < 13) {
        toast.error("You must be at least 13 years old to use this application");
        setLoading(false);
        return;
      }

      // Validate years of experience
      const experience = Number(formData.experience);
      if (experience < 0) {
        toast.error("Years of experience cannot be negative");
        setLoading(false);
        return;
      }

      if (!formData.age || !formData.industry || !formData.occupation || !formData.experience) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      if (formData.industry === "Other" && !formData.customIndustry) {
        toast.error("Please specify your industry");
        setLoading(false);
        return;
      }

      const finalIndustry = formData.industry === "Other" ? formData.customIndustry : formData.industry;

      const personalInfo = {
        age: formData.age,
        industry: finalIndustry,
        occupation: formData.occupation,
        experience: formData.experience,
      };

      // Save to localStorage
      localStorage.setItem("personalInfo", JSON.stringify(personalInfo));

      // Save to career info
      const careerInfo: Partial<CareerInfo> = {
        personalInfo: personalInfo
      };
      
      await storage.saveCareerInfo(careerInfo);
      
      toast.success("Personal information saved successfully");
      navigate("/career-goals");
    } catch (error) {
      console.error('Error during form submission:', error);
      toast.error("An error occurred while saving your information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Age <span className="text-red-500">*</span>
        </label>
        <Input
          type="number"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          placeholder="Enter your age"
          className="w-full"
          min="13"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Occupation <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={formData.occupation}
          onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
          placeholder="Enter your current occupation"
          className="w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Industry <span className="text-red-500">*</span>
        </label>
        <Select
          value={formData.industry}
          onValueChange={(value) => setFormData({ ...formData, industry: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formData.industry === "Other" && (
          <div className="mt-2">
            <Input
              type="text"
              value={formData.customIndustry}
              onChange={(e) => setFormData({ ...formData, customIndustry: e.target.value })}
              placeholder="Please specify your industry"
              className="w-full"
              required
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Years of Experience <span className="text-red-500">*</span>
        </label>
        <Input
          type="number"
          value={formData.experience}
          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          placeholder="Years of experience"
          className="w-full"
          min="0"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Next"
        )}
      </Button>
    </form>
  );
};
