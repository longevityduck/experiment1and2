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

// Enhanced fallback goal with specific examples based on common career paths
const generateFallbackGoal = (personalInfo: Record<string, any> = {}, guidanceAnswers: Record<number, string> = {}) => {
  const reason = guidanceAnswers[2] || 'grow professionally';
  const timeframe = guidanceAnswers[3]?.includes('5 years') ? '5 years' : '3-5 years';
  const industry = personalInfo.industry || 'your current industry';
  const occupation = personalInfo.occupation || 'your current field';
  
  let goalText = '';
  
  // Create different goals based on the main motivation (question 2)
  if (reason.includes('earn more money')) {
    goalText = `To increase your income by at least 20% within ${timeframe} by advancing to a senior position in ${occupation} through acquiring specialized certifications and expanding your expertise in ${industry}.`;
  } else if (reason.includes('free time')) {
    goalText = `To achieve a better work-life balance within ${timeframe} by transitioning to a role in ${industry} that offers flexible working arrangements while maintaining your career progression in ${occupation}.`;
  } else if (reason.includes('meaningful')) {
    goalText = `To transition into a more fulfilling role in ${industry} within ${timeframe} that aligns with your values and allows you to make a positive impact while leveraging your experience in ${occupation}.`;
  } else if (reason.includes('challenges')) {
    goalText = `To take on progressively more challenging projects and responsibilities in ${occupation} over the next ${timeframe}, positioning yourself for a leadership role in ${industry}.`;
  } else {
    goalText = `To advance to a senior position within ${occupation} in the next ${timeframe} by expanding your expertise in ${industry} and taking on greater responsibilities.`;
  }
  
  return goalText;
};

const CareerGoalSuggestion = () => {
  const navigate = useNavigate();
  const [suggestedGoal, setSuggestedGoal] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateSuggestion = async () => {
      try {
        const careerInfo = storage.getCareerInfo();
        const personalInfo = careerInfo.personalInfo || {};
        const guidanceAnswers = careerInfo.guidanceAnswers || {};
        
        // Add age, occupation, etc. directly from careerInfo if they exist
        const enrichedPersonalInfo = {
          ...personalInfo,
          age: careerInfo.age || personalInfo.age,
          occupation: careerInfo.occupation || personalInfo.occupation,
          industry: careerInfo.industry || personalInfo.industry,
          experience: careerInfo.experience || personalInfo.experience
        };

        console.log('Sending career goal generation request with:', {
          personalInfo: enrichedPersonalInfo,
          guidanceAnswers
        });

        // First try with Supabase function
        try {
          const { data, error } = await supabase.functions.invoke('career-advice', {
            body: {
              type: 'career-goal',
              personalInfo: enrichedPersonalInfo,
              guidanceAnswers
            }
          });

          if (error) {
            console.error('Error generating career goal from Supabase:', error);
            throw error;
          }

          const goalOnly = data.advice.split('\n')[0].replace(/^Career Goal:\s*/i, '').trim();
          setSuggestedGoal(goalOnly);
          setIsLoading(false);
          return;
        } catch (supabaseError) {
          console.error('Supabase function failed, using local generation:', supabaseError);
          // If Supabase fails, continue to fallback
        }

        // Local fallback generation if Supabase fails
        const fallbackGoal = generateFallbackGoal(enrichedPersonalInfo, guidanceAnswers);
        console.log('Using locally generated goal:', fallbackGoal);
        setSuggestedGoal(fallbackGoal);
        
      } catch (error) {
        console.error('Error generating career goal:', error);
        
        // Use the enhanced fallback goal generator
        const careerInfo = storage.getCareerInfo();
        const fallbackGoal = generateFallbackGoal(
          {
            industry: careerInfo.industry,
            occupation: careerInfo.occupation
          }, 
          careerInfo.guidanceAnswers || {}
        );
        
        setSuggestedGoal(fallbackGoal);
        toast.error("We're having trouble with our AI service. We've created a suggested goal for you instead.");
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
    navigate("/career-confidence-assessment");
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
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CareerGoalSuggestion;
