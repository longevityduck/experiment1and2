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

const FALLBACK_GOAL = `Career Goal: To advance to a senior software developer position within the next three years by mastering advanced technical skills and taking on leadership responsibilities in project teams.

Step 1: Complete an advanced programming certification course (3 months)
Step 2: Take on additional responsibilities in current role (2 months)
Step 3: Lead a small team project (6 months)
Step 4: Mentor junior developers (ongoing)
Step 5: Build a portfolio of successful projects (12 months)`;

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
          
          if (error.status === 429) {
            toast.error("Our AI service is temporarily unavailable. We've provided a general suggestion instead.");
            setSuggestedGoal(FALLBACK_GOAL);
            return;
          }
          
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

  const formatGoalAndSteps = (text: string) => {
    const parts = text.split('\n\n');
    if (parts.length < 2) return { goal: text, steps: [] };
    
    const goal = parts[0].replace('Career Goal: ', '');
    const steps = parts.slice(1).join('\n').split('\n').filter(step => step.trim());
    
    return { goal, steps };
  };

  const { goal, steps } = formatGoalAndSteps(suggestedGoal);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <ProgressIndicator />
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Career Goal & Action Plan</h1>
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
              Based on your responses, we've generated a personalized career goal and action plan 
              using AI assistance. This takes into account your background, skills, interests, and aspirations.
            </p>
            <p>
              Feel free to review and modify these to better align with your vision.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-2">Your Career Goal:</h2>
                  <Textarea
                    value={goal}
                    onChange={(e) => setSuggestedGoal(`Career Goal: ${e.target.value}\n\n${steps.join('\n')}`)}
                    className="min-h-[100px]"
                    placeholder="Your career goal will appear here..."
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-2">Action Plan:</h2>
                  <Textarea
                    value={steps.join('\n')}
                    onChange={(e) => setSuggestedGoal(`Career Goal: ${goal}\n\n${e.target.value}`)}
                    className="min-h-[200px]"
                    placeholder="Your action plan steps will appear here..."
                  />
                </CardContent>
              </Card>
            </div>
          )}

          <Button 
            onClick={handleSubmit}
            className="w-full mt-6"
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