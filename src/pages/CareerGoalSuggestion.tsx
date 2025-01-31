import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

const CareerGoalSuggestion = () => {
  const navigate = useNavigate();
  const [suggestedGoal, setSuggestedGoal] = useState("");
  const [editedGoal, setEditedGoal] = useState("");
  const [isEditing, setIsEditing] = useState(false);

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
      setEditedGoal(suggestion);
    };

    generateSuggestion();
  }, []);

  const handleSubmit = () => {
    if (!editedGoal.trim()) {
      toast.error("Please provide a career goal");
      return;
    }

    localStorage.setItem("careerGoals", editedGoal);
    navigate("/skills-assessment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">AI Career Goal Suggestion</h1>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2">Suggested Career Goal:</h2>
              {isEditing ? (
                <Textarea
                  value={editedGoal}
                  onChange={(e) => setEditedGoal(e.target.value)}
                  className="min-h-[150px]"
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-line">{suggestedGoal}</p>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Done Editing" : "Edit Goal"}
            </Button>
            <Button 
              onClick={handleSubmit}
              className="w-full"
            >
              Continue to Skills Assessment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerGoalSuggestion;