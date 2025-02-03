import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

const CareerGoalSuggestion = () => {
  const navigate = useNavigate();
  const [suggestedGoal, setSuggestedGoal] = useState("");

  useEffect(() => {
    // Mock AI suggestion - in a real app, this would call an AI API
    const generateSuggestion = () => {
      const clarificationAnswers = JSON.parse(localStorage.getItem("careerClarificationAnswers") || "{}");
      const guidanceAnswers = JSON.parse(localStorage.getItem("careerGuidanceAnswers") || "{}");
      
      // Simple mock suggestion based on stored answers
      const suggestion = `Based on your responses, a suitable career goal would be to focus on ${clarificationAnswers["interests"] || "your interests"} 
        while leveraging your strengths in ${clarificationAnswers["skills-strengths"] || "your current skills"}. 
        Consider roles that align with your values of ${clarificationAnswers["values"] || "work-life balance"} 
        in environments that are ${clarificationAnswers["ideal-environment"] || "collaborative and growth-oriented"}.`;
      
      setSuggestedGoal(suggestion);
    };

    generateSuggestion();
  }, []);

  const handleSubmit = () => {
    if (!suggestedGoal.trim()) {
      toast.error("Please provide a career goal");
      return;
    }

    localStorage.setItem("careerGoals", suggestedGoal);
    navigate("/skills-assessment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Career Goal Suggestion</h1>
            <Button
              variant="outline"
              onClick={() => navigate("/career-guidance")}
              className="text-sm"
            >
              Revise My Responses
            </Button>
          </div>

          <div className="mb-6 text-gray-600 space-y-4">
            <p>
              Based on your previous responses, we've generated a personalized career goal using established career coaching theories and AI assistance. This suggestion takes into account your skills, interests, and aspirations.
            </p>
            <p>
              While this suggestion serves as a starting point, we encourage you to review and modify it to better align with your personal vision and career aspirations. Your unique perspective and understanding of your goals are invaluable in crafting the perfect career objective.
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2">Suggested Career Goal:</h2>
              <Textarea
                value={suggestedGoal}
                onChange={(e) => setSuggestedGoal(e.target.value)}
                className="min-h-[150px]"
              />
            </CardContent>
          </Card>

          <Button 
            onClick={handleSubmit}
            className="w-full"
          >
            Continue to Skills Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CareerGoalSuggestion;