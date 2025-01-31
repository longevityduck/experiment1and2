import { useState, useEffect } from "react";
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
  const [questions, setQuestions] = useState<ClarifyingQuestion[]>([]);

  useEffect(() => {
    const guidanceAnswers = JSON.parse(localStorage.getItem("careerGuidanceAnswers") || "{}");
    
    // Determine clarifying questions based on previous answers
    const determineQuestions = () => {
      const qs: ClarifyingQuestion[] = [];
      
      // Example logic to determine questions based on previous answers
      if (guidanceAnswers[3] === "Own business") {
        qs.push(
          { id: "business-type", text: "What type of business are you interested in starting?" },
          { id: "business-timeline", text: "When do you plan to start this business?" }
        );
      } else if (guidanceAnswers[1] === "Higher income") {
        qs.push(
          { id: "income-goal", text: "What is your target income?" },
          { id: "skills-gap", text: "What skills do you need to achieve this income goal?" }
        );
      }
      
      // Add default questions
      qs.push(
        { id: "immediate-next", text: "What immediate steps can you take towards your career goals?" },
        { id: "obstacles", text: "What obstacles do you anticipate in achieving these goals?" }
      );
      
      return qs;
    };

    setQuestions(determineQuestions());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(answers).length < questions.length) {
      toast.error("Please answer all questions");
      return;
    }

    localStorage.setItem("careerClarificationAnswers", JSON.stringify(answers));
    
    // Generate career goals based on all answers
    const goalsSummary = "Based on your responses, you should focus on: " + 
      Object.values(answers).join(". ");
    
    localStorage.setItem("careerGoals", goalsSummary);
    navigate("/skills-assessment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Clarifying Questions</h1>
          
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
                Next
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CareerClarification;