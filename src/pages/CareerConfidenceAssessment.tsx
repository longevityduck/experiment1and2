import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ProgressIndicator } from "@/components/career-guidance/ProgressIndicator";
import { storage } from "@/utils/storage";

type FeelingOption = 
  | "More assured and certain"
  | "Renewed drive and energy"
  | "Clearer direction"
  | "Worry about right path"
  | "Fear of failure"
  | "Anticipation of opportunities"
  | "Uncertainty about skills needed"
  | "Willingness to overcome challenges"
  | "Other";

const CareerConfidenceAssessment = () => {
  const navigate = useNavigate();
  const [careerGoal, setCareerGoal] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState<number>(5); // Always initialized to 5
  const [readinessLevel, setReadinessLevel] = useState<number>(5);   // Always initialized to 5
  const [selectedFeelings, setSelectedFeelings] = useState<FeelingOption[]>([]);
  const [otherText, setOtherText] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const careerInfo = storage.getCareerInfo();
    
    // Load career goal from storage
    if (careerInfo.careerGoals) {
      setCareerGoal(careerInfo.careerGoals);
    } else {
      navigate("/confidence-assessment");
      toast.error("Please complete previous steps first");
    }
    
    // Removed loading of saved confidenceLevel and readinessLevel
    // We always start with 5 for both sliders
    
    if (careerInfo.feelingAboutCareerGoal) {
      const feelings = careerInfo.feelingAboutCareerGoal.split(", ") as FeelingOption[];
      setSelectedFeelings(feelings);
    }
    if (careerInfo.customFeeling) {
      setOtherText(careerInfo.customFeeling);
    }
  }, [navigate]);

  const feelingOptions: FeelingOption[] = [
    "More assured and certain",
    "Renewed drive and energy",
    "Clearer direction",
    "Worry about right path",
    "Fear of failure", 
    "Anticipation of opportunities",
    "Uncertainty about skills needed",
    "Willingness to overcome challenges",
    "Other"
  ];

  const handleFeelingToggle = (feeling: FeelingOption) => {
    setSelectedFeelings(prev => {
      if (prev.includes(feeling)) {
        return prev.filter(f => f !== feeling);
      } else {
        return [...prev, feeling];
      }
    });
  };

  const handleSubmit = () => {
    if (selectedFeelings.length === 0) {
      toast.error("Please select at least one feeling about your career goal");
      return;
    }
    
    // Make sure we have the career goal set
    if (!careerGoal) {
      toast.error("Career goal is missing. Please go back and set your career goal.");
      navigate("/career-goals");
      return;
    }
    
    // Ensure personal info exists
    const careerInfo = storage.getCareerInfo();
    if (!careerInfo.occupation || !careerInfo.industry || !careerInfo.experience) {
      toast.error("Personal information is missing. Please complete your profile first.");
      navigate("/personal-info");
      return;
    }
    
    // Save all the assessment data
    storage.saveCareerInfo({
      careerGoals: careerGoal,
      feelingAboutCareerGoal: selectedFeelings.join(", "),
      customFeeling: otherText,
      confidenceLevel: confidenceLevel,
      readinessLevel: readinessLevel,
      personalInfo: { 
        age: careerInfo.age,
        occupation: careerInfo.occupation,
        industry: careerInfo.industry,
        experience: careerInfo.experience
      }
    });
    
    console.log("Navigating to next-steps with data:", storage.getCareerInfo());
    
    // Navigate to next-steps page
    navigate("/next-steps");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <ProgressIndicator />
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Career Goal</h1>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <p className="text-lg font-medium mb-2">Your Career Goal:</p>
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                {careerGoal}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-10">
            {/* Confidence Level Slider */}
            <div>
              <h2 className="text-lg font-medium mb-4">
                Now that you have defined your career goal, on a scale of 1 to 10, how confident are you in determining your next career steps?
              </h2>
              <div className="space-y-4">
                <Slider
                  value={[confidenceLevel]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setConfidenceLevel(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>1 - Not confident</span>
                  <span>10 - Very confident</span>
                </div>
                <div className="text-center font-medium text-lg text-blue-600">
                  {confidenceLevel}
                </div>
              </div>
            </div>

            {/* Readiness Level Slider */}
            <div>
              <h2 className="text-lg font-medium mb-4">
                Now that you have defined your career goal, on a scale of 1 to 10, how ready do you feel if you had to take your next career step within a month?
              </h2>
              <div className="space-y-4">
                <Slider
                  value={[readinessLevel]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setReadinessLevel(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>1 - Unprepared</span>
                  <span>10 - Very Prepared</span>
                </div>
                <div className="text-center font-medium text-lg text-blue-600">
                  {readinessLevel}
                </div>
              </div>
            </div>

            {/* Feeling Options */}
            <div>
              <h2 className="text-lg font-medium mb-4">
                How has defining a career goal changed the way you feel about your next career steps?
                <span className="text-sm text-gray-500 block mt-1">(Select all that apply)</span>
              </h2>
              <div className="space-y-3">
                {feelingOptions.map((option) => (
                  <div key={option} className="flex items-start space-x-2">
                    <Checkbox 
                      id={option}
                      checked={selectedFeelings.includes(option)}
                      onCheckedChange={() => handleFeelingToggle(option)}
                      className="mt-1"
                    />
                    <Label htmlFor={option} className="leading-tight cursor-pointer">
                      {option === "More assured and certain" && "Feeling more assured and certain about the direction to take."}
                      {option === "Renewed drive and energy" && "A renewed sense of drive and energy to take action toward career goals."}
                      {option === "Clearer direction" && "A sense of ease from having a clearer direction instead of feeling lost."}
                      {option === "Worry about right path" && "Worry about whether the chosen career path is the right one."}
                      {option === "Fear of failure" && "Fear of failure or not meeting expectations in pursuing the goal."}
                      {option === "Anticipation of opportunities" && "Anticipation about future opportunities and possibilities."}
                      {option === "Uncertainty about skills needed" && "Uncertainty about the skills, qualifications, or steps needed."}
                      {option === "Willingness to overcome challenges" && "Willingness to overcome challenges and persist in career development."}
                      {option === "Other" && "Other (please specify)"}
                    </Label>
                  </div>
                ))}
              </div>

              {selectedFeelings.includes("Other") && (
                <Textarea
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="Please describe how you feel..."
                  className="mt-4"
                />
              )}
            </div>
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full mt-10"
          >
            Complete Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CareerConfidenceAssessment;
