
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/utils/storage";
import { Step } from "@/types/steps";

const evaluationQuestions = [
  {
    id: "clarity",
    question: "The steps clearly defines what needs to be done. Avoids vague or generic descriptions.",
    options: [
      { value: "0", label: "0 = Vague or unclear" },
      { value: "1", label: "1 = Somewhat specific but could be clearer" },
      { value: "2", label: "2 = Very clear and detailed" }
    ]
  },
  {
    id: "measurability",
    question: "The steps defines how success will be measured (e.g., numbers, milestones).",
    options: [
      { value: "0", label: "0 = No clear way to measure progress" },
      { value: "1", label: "1 = Some measurement but lacks clarity" },
      { value: "2", label: "2 = Clearly measurable with a defined metric" }
    ]
  },
  {
    id: "realistic",
    question: "The steps are realistic given your resources and constraints.",
    options: [
      { value: "0", label: "0 = Unrealistic or impossible" },
      { value: "1", label: "1 = Possible but challenging" },
      { value: "2", label: "2 = Realistic and attainable" }
    ]
  },
  {
    id: "alignment",
    question: "The steps align with your broader career goal.",
    options: [
      { value: "0", label: "0 = Not relevant to the career goal" },
      { value: "1", label: "1 = Somewhat relevant but not well connected" },
      { value: "2", label: "2 = Directly supports the career goal" }
    ]
  },
  {
    id: "timeframe",
    question: "The steps have deadlines or specific time frames.",
    options: [
      { value: "0", label: "0 = No time frame mentioned" },
      { value: "1", label: "1 = Vague time frame (e.g., \"soon\")" },
      { value: "2", label: "2 = Clearly defined deadline" }
    ]
  }
];

const followThroughOptions = [
  { id: "confident", label: "I feel confident and have a clear plan." },
  { id: "motivation", label: "I know what I need to do, but I need more motivation." },
  { id: "guidance", label: "I need more guidance before I can act." },
  { id: "information", label: "I don't have enough information about my next steps." },
  { id: "overwhelmed", label: "I'm overwhelmed by other responsibilities." },
  { id: "other", label: "Other (please specify)" }
];

// Enum to represent different assessment sections
enum AssessmentSection {
  Evaluation,
  FollowThrough,
  Completed
}

const ReviewCareerSteps = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<string, string>>({});
  const [currentSection, setCurrentSection] = useState<AssessmentSection>(AssessmentSection.Evaluation);
  const [followThroughRating, setFollowThroughRating] = useState<number[]>([5]); // Default to middle of scale
  const [followThroughReasons, setFollowThroughReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState("");
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

  const currentQuestion = evaluationQuestions[currentQuestionIndex];

  const handleRatingChange = (value: string) => {
    setRatings(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (currentSection === AssessmentSection.Evaluation) {
      if (!ratings[currentQuestion.id]) {
        toast({
          title: "Please Select an Option",
          description: "Please select a rating before continuing.",
          variant: "destructive",
        });
        return;
      }

      if (currentQuestionIndex < evaluationQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Move to the follow-through section
        setCurrentSection(AssessmentSection.FollowThrough);
      }
    } else if (currentSection === AssessmentSection.FollowThrough) {
      // Check if "Other" is selected but no text is provided
      if (followThroughReasons.includes("other") && otherReason.trim() === "") {
        toast({
          title: "Please Provide Details",
          description: "Please provide details for your 'Other' selection.",
          variant: "destructive",
        });
        return;
      }

      // Calculate total score from evaluation questions
      const totalScore = Object.values(ratings).reduce((sum, value) => sum + parseInt(value), 0);
      
      // Save all data
      localStorage.setItem("stepsRatings", JSON.stringify(ratings));
      localStorage.setItem("stepsTotalScore", totalScore.toString());
      localStorage.setItem("followThroughRating", followThroughRating[0].toString());
      
      // Save reasons with 'other' text if applicable
      const reasonsData = followThroughReasons.includes("other") 
        ? [...followThroughReasons.filter(r => r !== "other"), `other: ${otherReason}`]
        : followThroughReasons;
      
      localStorage.setItem("followThroughReasons", JSON.stringify(reasonsData));
      
      // Move to completed state
      setCurrentSection(AssessmentSection.Completed);
      
      // Navigate to success page
      navigate("/success");
      
      toast({
        title: "Success!",
        description: "Your career steps evaluation has been saved.",
      });
    }
  };

  const handleReasonToggle = (id: string) => {
    setFollowThroughReasons(prev => {
      if (prev.includes(id)) {
        return prev.filter(reason => reason !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <FormContainer title="Evaluate Your Career Steps">
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">Career Goal</h3>
          <p className="text-blue-800">
            {storage.getCareerInfo().careerGoals || "Your career goal will appear here"}
          </p>
        </div>

        <h3 className="text-lg font-medium mb-4">Your Career Action Steps</h3>

        <div className="space-y-4 mb-8">
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

        {currentSection === AssessmentSection.Evaluation && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Evaluate Your Steps</h3>
              <span className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {evaluationQuestions.length}</span>
            </div>
            
            <div className="h-1 w-full bg-gray-200 mb-6 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300 ease-in-out" 
                style={{ width: `${((currentQuestionIndex + 1) / evaluationQuestions.length) * 100}%` }}
              />
            </div>

            <p className="text-md font-medium mb-4">
              {currentQuestion.question}
            </p>

            <RadioGroup 
              value={ratings[currentQuestion.id] || ""} 
              onValueChange={handleRatingChange} 
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100">
                  <RadioGroupItem value={option.value} id={`rating-${option.value}`} />
                  <Label htmlFor={`rating-${option.value}`} className="cursor-pointer w-full">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {currentSection === AssessmentSection.FollowThrough && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
            <h3 className="text-lg font-medium mb-6">Follow-Through Assessment</h3>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="font-medium">On a scale of 1 to 10, how likely are you to follow-through with these action steps?</p>
                <div className="px-2">
                  <Slider 
                    value={followThroughRating} 
                    onValueChange={setFollowThroughRating} 
                    max={10} 
                    min={1} 
                    step={1}
                    className="mt-6"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>1 (Very unlikely)</span>
                    <span>10 (Very likely)</span>
                  </div>
                  <p className="text-center mt-2 font-medium">Your rating: {followThroughRating[0]}</p>
                </div>
              </div>
              
              <div className="space-y-3 mt-8">
                <p className="font-medium">What made you choose this rating? (Select all that apply)</p>
                
                {followThroughOptions.map((option) => (
                  <div key={option.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-gray-100">
                    <Checkbox 
                      id={option.id} 
                      checked={followThroughReasons.includes(option.id)}
                      onCheckedChange={() => handleReasonToggle(option.id)}
                      className="mt-1"
                    />
                    <Label htmlFor={option.id} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
                
                {followThroughReasons.includes("other") && (
                  <div className="pl-8 pr-2 mt-2">
                    <Textarea 
                      placeholder="Please specify your reason..."
                      value={otherReason}
                      onChange={(e) => setOtherReason(e.target.value)}
                      className="h-24"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <Button onClick={handleNext} className="w-full">
          {currentSection === AssessmentSection.Evaluation && currentQuestionIndex < evaluationQuestions.length - 1 
            ? "Next Question" 
            : currentSection === AssessmentSection.Evaluation 
              ? "Continue to Next Section" 
              : "Submit and Complete"}
        </Button>
      </div>
    </FormContainer>
  );
};

export default ReviewCareerSteps;
