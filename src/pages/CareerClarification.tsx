import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ClarifyingQuestion {
  id: string;
  text: string;
}

const CareerClarification = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions: ClarifyingQuestion[] = [
    {
      id: "skills-strengths",
      text: "What are your top skills and strengths? Include both technical and soft skills."
    },
    {
      id: "interests",
      text: "What topics, activities, or types of work do you find most engaging and enjoyable?"
    },
    {
      id: "values",
      text: "What are your core values in relation to work? (e.g., creativity, stability, independence)"
    },
    {
      id: "constraints",
      text: "Are there any constraints or requirements for your next career move? (e.g., location, salary, work-life balance)"
    },
    {
      id: "ideal-environment",
      text: "Describe your ideal work environment and culture."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(answers).length < questions.length) {
      toast.error("Please answer all questions");
      return;
    }

    localStorage.setItem("careerClarificationAnswers", JSON.stringify(answers));
    navigate("/career-goal-suggestion");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Career Clarification</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {questions.map((question) => (
              <div key={question.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {question.text} <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={answers[question.id] || ""}
                  onChange={(e) => 
                    setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))
                  }
                  placeholder="Your answer..."
                  className="min-h-[100px]"
                  required
                />
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
                Get AI Career Suggestion
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CareerClarification;