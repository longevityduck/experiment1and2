import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { ProgressIndicator } from "@/components/career-guidance/ProgressIndicator";

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Other",
];

const PersonalInfo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: "",
    industry: "",
    customIndustry: "",
    occupation: "",
    experience: "",
  });

  // Load existing data when component mounts
  useEffect(() => {
    const savedInfo = localStorage.getItem("personalInfo");
    if (savedInfo) {
      const parsedInfo = JSON.parse(savedInfo);
      setFormData(parsedInfo);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate age
    const age = Number(formData.age);
    if (age < 13) {
      toast.error("You must be at least 13 years old to use this application");
      return;
    }

    // Validate years of experience
    const experience = Number(formData.experience);
    if (experience < 0) {
      toast.error("Years of experience cannot be negative");
      return;
    }

    if (!formData.age || !formData.industry || !formData.occupation || !formData.experience) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.industry === "Other" && !formData.customIndustry) {
      toast.error("Please specify your industry");
      return;
    }

    const dataToStore = {
      ...formData,
      industry: formData.industry === "Other" ? formData.customIndustry : formData.industry,
    };

    // Store in both careerInfo (for backward compatibility) and personalInfo
    localStorage.setItem("careerInfo", JSON.stringify(dataToStore));
    localStorage.setItem("personalInfo", JSON.stringify(formData));
    navigate("/career-goals");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-md mx-auto">
        <ProgressIndicator />
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded">
            <div className="h-2 bg-blue-600 rounded w-1/3"></div>
          </div>
          <div className="mt-2 text-sm text-gray-500 text-center">Step 1 of 3</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h1>
          
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

            <Button type="submit" className="w-full">
              Next
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
