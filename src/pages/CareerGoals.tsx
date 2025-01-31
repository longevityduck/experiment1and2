import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const CareerGoals = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState("");
  const [isUnsure, setIsUnsure] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isUnsure) {
      navigate("/career-guidance");
      return;
    }

    if (!goals.trim()) {
      toast.error("Please enter your career goals");
      return;
    }

    localStorage.setItem("careerGoals", goals);
    navigate("/skills-assessment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded">
            <div className="h-2 bg-blue-600 rounded w-2/3"></div>
          </div>
          <div className="mt-2 text-sm text-gray-500 text-center">Step 2 of 3</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Career Goals</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <RadioGroup
              value={isUnsure ? "unsure" : "know"}
              onValueChange={(value) => setIsUnsure(value === "unsure")}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="know" id="know" />
                <Label htmlFor="know">I know my career goals</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unsure" id="unsure" />
                <Label htmlFor="unsure">I'm not sure about my career goals</Label>
              </div>
            </RadioGroup>

            {!isUnsure && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What are your career goals? <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="Describe your career goals and aspirations..."
                  className="min-h-[150px]"
                  required
                />
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
              <Button type="submit" className="w-full">
                Next
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CareerGoals;