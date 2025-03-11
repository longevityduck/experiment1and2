
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/utils/storage";
import { Step } from "@/types/steps";

const ReviewCareerSteps = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [rating, setRating] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Retrieve saved steps
    const savedSteps = localStorage.getItem("userSteps");
    if (savedSteps) {
      setSteps(JSON.parse(savedSteps));
    } else {
      toast({
        title: "No Steps Found",
        description: "Please define your career steps first.",
        variant: "destructive",
      });
      navigate("/next-steps");
    }
  }, [navigate, toast]);

  const handleSubmit = () => {
    if (!rating) {
      toast({
        title: "Please Select a Rating",
        description: "Please grade your steps before continuing.",
        variant: "destructive",
      });
      return;
    }

    // Save the rating and continue
    localStorage.setItem("stepsRating", rating);
    
    // Navigate to success page
    navigate("/success");
    
    toast({
      title: "Success!",
      description: "Your career steps and rating have been saved.",
    });
  };

  return (
    <FormContainer title="Review Your Career Steps">
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">Career Goal</h3>
          <p className="text-blue-800">
            {storage.getCareerInfo().careerGoals || "Your career goal will appear here"}
          </p>
        </div>

        <h3 className="text-lg font-medium mb-4">Your Career Action Steps</h3>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <Card key={step.id} className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium mb-1">{step.content}</p>
                    <p className="text-sm text-gray-500">Timeframe: {step.timeframe}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
          <h3 className="text-lg font-medium mb-4">Grade Your Steps</h3>
          <p className="text-sm text-gray-600 mb-4">
            On a scale of 1 to 5, how satisfied are you with these career steps?
          </p>

          <RadioGroup value={rating} onValueChange={setRating} className="space-y-3">
            {[1, 2, 3, 4, 5].map((value) => (
              <div key={value} className="flex items-center space-x-2">
                <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
                <Label htmlFor={`rating-${value}`} className="cursor-pointer">
                  {value} - {value === 1 ? "Not satisfied" : value === 5 ? "Very satisfied" : ""}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Submit and Complete
        </Button>
      </div>
    </FormContainer>
  );
};

export default ReviewCareerSteps;
