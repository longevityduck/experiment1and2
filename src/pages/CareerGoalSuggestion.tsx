
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

const FALLBACK_GOAL = `To advance to a senior position within your current field in the next 3-5 years by expanding your expertise and taking on greater responsibilities.`;

const CareerGoalSuggestion = () => {
  const navigate = useNavigate();
  const [suggestedGoal, setSuggestedGoal] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateSuggestion = async () => {
      try {
        const personalInfo = storage.getCareerInfo().personalInfo || {};
        const guidanceAnswers = storage.getCareerInfo().guidanceAnswers || {};

        const { data, error } = await supabase.functions.invoke('career-advice', {
          body: {
            type: 'career-goal',
            personalInfo,
            guidanceAnswers
          }
        });

        if (error) {
          console.error('Error generating career goal:', error);
          
          if (error.status === 429) {
            toast.error("Our AI service is temporarily unavailable. We've provided a general suggestion instead.");
            setSuggestedGoal(FALLBACK_GOAL);
            return;
          }
          
          toast.error("Failed to generate career goal. Using a general suggestion instead.");
          setSuggestedGoal(FALLBACK_GOAL);
          return;
        }

        const goalOnly = data.advice.split('\n')[0].replace(/^Career Goal:\s*/i, '').trim();
        setSuggestedGoal(goalOnly);
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
    navigate("/success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <ProgressIndicator />
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Your Career Goal</h1>
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
              Based on your responses, we've generated a personalized career goal 
              using AI assistance. This takes into account your background and aspirations.
            </p>
            <p>
              Feel free to review and modify this goal to better align with your vision.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-2">Career Goal:</h2>
                <Textarea
                  value={suggestedGoal}
                  onChange={(e) => setSuggestedGoal(e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Your career goal will appear here..."
                />
              </CardContent>
            </Card>
          )}

          <Button 
            onClick={handleSubmit}
            className="w-full mt-6"
            disabled={isLoading}
          >
            Complete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CareerGoalSuggestion;
