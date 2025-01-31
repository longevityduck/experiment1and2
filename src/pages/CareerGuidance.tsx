import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Question {
  id: number;
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "How satisfied are you with your current career path?",
    options: ["Very satisfied", "Somewhat satisfied", "Neutral", "Somewhat dissatisfied", "Very dissatisfied"]
  },
  {
    id: 2,
    text: "What's your primary motivation for considering career changes?",
    options: ["Higher income", "Better work-life balance", "More meaningful work", "New challenges", "Personal growth"]
  },
  {
    id: 3,
    text: "Where do you see yourself in the next 5 years?",
    options: ["Same role, more senior", "Different role, same industry", "Different industry", "Own business", "Semi-retired"]
  },
  {
    id: 4,
    text: "How much risk are you willing to take in your career?",
    options: ["Very high risk", "Moderate risk", "Low risk", "No risk", "Unsure"]
  },
  {
    id: 5,
    text: "What's most important to you in your career?",
    options: ["Financial security", "Work-life balance", "Professional growth", "Independence", "Impact on others"]
  }
];

const CareerGuidance = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(answers).length < questions.length) {
      toast.error("Please answer all questions");
      return;
    }

    localStorage.setItem("careerGuidanceAnswers", JSON.stringify(answers));
    navigate("/career-clarification");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Career Guidance Questions</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {questions.map((question) => (
              <div key={question.id} className="space-y-4">
                <h2 className="text-lg font-medium">{question.text}</h2>
                <RadioGroup
                  value={answers[question.id] || ""}
                  onValueChange={(value) => 
                    setAnswers((prev) => ({ ...prev, [question.id]: value }))
                  }
                >
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                        <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            ))}

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

export default CareerGuidance;