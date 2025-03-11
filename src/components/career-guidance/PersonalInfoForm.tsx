
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { NavigationButtons } from "./NavigationButtons";
import { storage } from "@/utils/storage";

const PersonalInfoForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: "",
    occupation: "",
    industry: "",
    experience: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save the data to storage
    const personalInfo = {
      age: formData.age,
      occupation: formData.occupation,
      industry: formData.industry,
      experience: formData.experience,
    };

    // Store the values in CareerInfo
    storage.saveCareerInfo({
      age: formData.age,
      occupation: formData.occupation,
      industry: formData.industry,
      experience: formData.experience,
    });

    // Navigate to career goals
    navigate("/career-goals");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            name="age"
            type="number"
            placeholder="Enter your age"
            min="16"
            max="100"
            value={formData.age}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupation">Current Occupation</Label>
          <Input
            id="occupation"
            name="occupation"
            placeholder="e.g. Software Developer, Student, Marketing Manager"
            value={formData.occupation}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            name="industry"
            placeholder="e.g. Technology, Healthcare, Education"
            value={formData.industry}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Years of Experience</Label>
          <Input
            id="experience"
            name="experience"
            type="number"
            placeholder="Years of professional experience"
            min="0"
            max="60"
            value={formData.experience}
            onChange={handleChange}
          />
        </div>
      </div>

      <NavigationButtons
        onBack={() => navigate("/confidence-assessment")}
        onNext={() => {}}
        nextButtonText="Continue"
        isNextSubmit={true}
      />
    </form>
  );
};

export default PersonalInfoForm;
