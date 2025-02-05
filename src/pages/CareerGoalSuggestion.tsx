import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressIndicator } from "@/components/career-guidance/ProgressIndicator";
import { Loader2 } from "lucide-react";
import { storage } from "@/utils/storage";
import { supabase } from "@/integrations/supabase/client";

const FALLBACK_GOAL = `Based on your responses, consider setting a goal to advance your career through continuous learning and skill development. Focus on identifying specific skills that align with your interests and industry demands, then create a structured plan to acquire those skills through courses, certifications, or hands-on projects.`;

const CareerGoalSuggestion = () => {
  const navigate = useNavigate();
  const [suggestedGoal, setSuggestedGoal] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateSuggestion = async () => {
      try {
        const personalInfo = storage.getCareerInfo().personalInfo || {};
        const guidanceAnswers = storage.getCareerInfo().guidanceAnswers || {};
        const clarificationAnswers = storage.getCareerInfo().clarificationAnswers || {};

        const { data, error } = await supabase.functions.invoke('career-advice', {
          body: {
            type: 'career-goal',
            personalInfo,
            guidanceAnswers,
            clarificationAnswers
          }
        });

        if (error) {
          console.error('Error generating career goal:', error);
          
          // Handle quota exceeded error (429)
          if (error.status === 429) {
            toast.error("Our AI service is temporarily unavailable. We've provided a general suggestion instead.");
            setSuggestedGoal(FALLBACK_GOAL);
            return;
          }
          
          // Handle other errors
          toast.error("Failed to generate career goal. Using a general suggestion instead.");
          setSuggestedGoal(FALLBACK_GOAL);
          return;
        }

        setSuggestedGoal(data.advice);
      } catch (error) {
        console.error('Error generating career goal:', error);
        toast.error("An unexpected error occurred. Using a general suggestion instead.");
        setSuggestedGoal(FALLBACK_GOAL);
      } finally {
        setIsLoading(false);
      }
    };

    generateSuggestion();
  }, []);

  const handleSubmit = () => {
    if (!suggestedGoal.trim()) {
      toast.error("Please provide a career goal");
      return;
    }

    storage.saveCareerInfo({ careerGoals: suggestedGoal });
    navigate("/skills-assessment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <ProgressIndicator />
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
              Based on your previous responses, we've generated a personalized career goal using AI assistance. 
              This suggestion takes into account your background, skills, interests, and aspirations.
            </p>
            <p>
              While this suggestion serves as a starting point, we encourage you to review and modify it to better 
              align with your personal vision and career aspirations.
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2">Suggested Career Goal:</h2>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <Textarea
                  value={suggestedGoal}
                  onChange={(e) => setSuggestedGoal(e.target.value)}
                  className="min-h-[150px]"
                  placeholder="Your career goal will appear here..."
                />
              )}
            </CardContent>
          </Card>

          <Button 
            onClick={handleSubmit}
            className="w-full"
            disabled={isLoading}
          >
            Continue to Skills Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CareerGoalSuggestion;