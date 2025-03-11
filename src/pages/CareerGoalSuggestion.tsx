
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

// Enhanced fallback goal that properly considers all 5 guidance questions
const generateFallbackGoal = (personalInfo: Record<string, any> = {}, guidanceAnswers: Record<number, string> = {}) => {
  // Parse career satisfaction (question 1)
  const satisfaction = guidanceAnswers[1] || 'not specified';
  
  // Parse main motivation (question 2)
  const motivation = guidanceAnswers[2] || 'grow professionally';
  
  // Parse 5-year plan (question 3)
  const fiveYearPlan = guidanceAnswers[3] || 'not specified';
  
  // Parse risk tolerance (question 4)
  const riskTolerance = guidanceAnswers[4] || 'moderate';
  
  // Parse career value (question 5)
  const careerValue = guidanceAnswers[5] || 'balance';
  
  // Get basic info
  const timeframe = fiveYearPlan?.includes('5 years') ? '5 years' : '3-5 years';
  const job = personalInfo?.occupation || 'your current occupation';
  const desiredJob = personalInfo?.desiredJob || '';
  const industry = personalInfo?.industry || 'your current industry';
  const experience = parseInt(personalInfo?.experience || '0', 10);
  
  let goalText = '';
  
  // Consider desired job if available
  const targetRole = desiredJob ? desiredJob : (
    fiveYearPlan === 'Same job but higher position' ? 
    `a senior ${job}` : 
    fiveYearPlan === 'Same field but different job' ? 
    `a different role in ${industry}` : 
    fiveYearPlan === 'Same job but different field' ? 
    `${job} in a different industry` : 
    fiveYearPlan === 'Completely different job and field' ? 
    `a new career outside of ${industry}` : 
    fiveYearPlan === 'Starting my own business' ? 
    `your own business in ${industry}` : 
    fiveYearPlan === 'Working part-time or less' ? 
    `a part-time position as ${job}` :
    `a more fulfilling role`
  );
  
  // Build a goal that incorporates all 5 questions
  if (motivation.includes('earn more money')) {
    // Financial focus
    goalText = `To increase your income by at least 20% within ${timeframe} by advancing to ${targetRole}${riskTolerance.includes('comfortable') ? ', taking calculated risks when necessary' : ', with minimal career risk'}.`;
  } else if (motivation.includes('free time') || careerValue.includes('time for myself')) {
    // Work-life balance focus
    goalText = `To achieve a better work-life balance within ${timeframe} by transitioning to ${targetRole} that offers flexible working arrangements while ${satisfaction.includes('love') ? 'maintaining your career satisfaction' : 'improving your career satisfaction'}.`;
  } else if (motivation.includes('meaningful') || careerValue.includes('difference')) {
    // Purpose-driven focus
    goalText = `To transition into ${targetRole} within ${timeframe} that aligns with your values and allows you to make a positive impact${riskTolerance.includes('comfortable') ? ' while taking strategic risks' : ' through a measured approach'}.`;
  } else if (motivation.includes('challenges') || careerValue.includes('Learning')) {
    // Growth focus
    goalText = `To develop expertise in ${targetRole} over the next ${timeframe} by continuously learning new skills and taking on ${riskTolerance.includes('comfortable') ? 'challenging' : 'appropriately scoped'} projects.`;
  } else if (motivation.includes('grow as a person')) {
    // Personal development focus
    goalText = `To grow professionally and personally by securing a position as ${targetRole} within ${timeframe} that ${careerValue.includes('stable') ? 'provides stability while' : ''} challenges you to develop new competencies.`;
  } else if (careerValue.includes('independence')) {
    // Autonomy focus
    goalText = `To gain greater professional autonomy within ${timeframe} by establishing yourself in ${targetRole} where you can ${riskTolerance.includes('comfortable') ? 'independently direct your work' : 'have structured independence'}.`;
  } else {
    // Default goal
    goalText = `To advance to ${targetRole} within ${timeframe} by expanding your expertise and taking on greater responsibilities${careerValue.includes('stable') ? ' while maintaining stability' : ''}.`;
  }
  
  // Add experience-based modifier
  if (experience < 3) {
    goalText += ` As an early-career professional, focus on rapidly building fundamental skills and industry connections.`;
  } else if (experience >= 10) {
    goalText += ` Leverage your extensive experience to position yourself as a thought leader and mentor in your field.`;
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
        
        // Add all relevant information from careerInfo
        const enrichedPersonalInfo = {
          ...personalInfo,
          age: careerInfo.age || personalInfo.age,
          occupation: careerInfo.occupation || personalInfo.occupation,
          industry: careerInfo.industry || personalInfo.industry,
          experience: careerInfo.experience || personalInfo.experience,
          desiredJob: careerInfo.desiredJob
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

        // Enhanced local fallback generation
        const fallbackGoal = generateFallbackGoal(enrichedPersonalInfo, guidanceAnswers);
        console.log('Using locally generated goal:', fallbackGoal);
        setSuggestedGoal(fallbackGoal);
        
      } catch (error) {
        console.error('Error generating career goal:', error);
        
        // Use the enhanced fallback goal generator with all available information
        const careerInfo = storage.getCareerInfo();
        const fallbackGoal = generateFallbackGoal(
          {
            industry: careerInfo.industry,
            occupation: careerInfo.occupation,
            desiredJob: careerInfo.desiredJob,
            experience: careerInfo.experience
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
