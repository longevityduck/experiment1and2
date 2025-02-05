import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import StepsList from "@/components/next-steps/StepsList";
import ActionButtons from "@/components/next-steps/ActionButtons";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import { ProgressIndicator } from "@/components/career-guidance/ProgressIndicator";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Step {
  id: number;
  content: string;
  timeframe: string;
  isEditing: boolean;
  explanation?: string;
  isOriginal?: boolean;
}

const NextSteps = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<Step[]>([]);
  const [editingContent, setEditingContent] = useState("");
  const [editingTimeframe, setEditingTimeframe] = useState("");

  useEffect(() => {
    const loadSteps = async () => {
      try {
        const savedSteps = localStorage.getItem("userSteps");
        if (savedSteps) {
          setSteps(JSON.parse(savedSteps));
          setLoading(false);
          return;
        }

        const personalInfo = JSON.parse(localStorage.getItem("careerInfo") || "{}");
        const guidanceAnswers = JSON.parse(localStorage.getItem("guidanceAnswers") || "{}");
        const clarificationAnswers = JSON.parse(localStorage.getItem("clarificationAnswers") || "{}");
        const careerGoals = localStorage.getItem("careerGoals") || "";

        console.log('Sending request to career-advice function with:', {
          personalInfo,
          guidanceAnswers,
          clarificationAnswers,
          careerGoals
        });

        const { data, error } = await supabase.functions.invoke('career-advice', {
          body: {
            type: 'career-goal',
            personalInfo,
            guidanceAnswers,
            clarificationAnswers,
            careerGoals
          }
        });

        if (error) {
          console.error('Error generating steps:', error);
          throw error;
        }

        console.log('Received response from career-advice function:', data);

        // Parse the AI response and format it into steps
        const aiResponse = data.advice;
        const steps: Partial<Step>[] = [];
        let currentStep: Partial<Step> = {};
        
        // Skip the career goal part and process only the steps
        const stepLines = aiResponse.split('\n').filter(line => line.trim().length > 0);
        let processingSteps = false;
        
        for (const line of stepLines) {
          if (line.toLowerCase().includes('career goal:')) {
            continue;
          }
          
          if (line.toLowerCase().startsWith('step:')) {
            if (Object.keys(currentStep).length > 0) {
              steps.push(currentStep);
            }
            currentStep = {
              id: steps.length,
              content: line.replace(/^step:\s*/i, '').trim(),
              isEditing: false,
              isOriginal: true
            };
            processingSteps = true;
          } else if (processingSteps && line.toLowerCase().startsWith('timeframe:')) {
            const timeframeMatch = line.match(/(\d+)\s*months?/i);
            currentStep.timeframe = timeframeMatch ? `${timeframeMatch[1]} months` : '3 months';
          } else if (processingSteps && line.toLowerCase().startsWith('explanation:')) {
            currentStep.explanation = line.replace(/^explanation:\s*/i, '').trim();
          }
        }
        
        if (Object.keys(currentStep).length > 0) {
          steps.push(currentStep);
        }

        console.log('Parsed steps:', steps);

        const formattedSteps = steps.map((step, index) => ({
          id: index,
          content: step.content || '',
          timeframe: step.timeframe || '3 months',
          explanation: step.explanation || 'This step was generated based on your career goals and preferences.',
          isEditing: false,
          isOriginal: true,
        }));

        console.log('Formatted steps:', formattedSteps);

        if (formattedSteps.length === 0) {
          throw new Error('No steps were generated');
        }

        setSteps(formattedSteps);
        localStorage.setItem("userSteps", JSON.stringify(formattedSteps));
        setLoading(false);
      } catch (error) {
        console.error("Error generating steps:", error);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to generate next steps. Please try again.",
          variant: "destructive",
        });

        // Fallback to default steps if AI generation fails
        const careerInfo = JSON.parse(localStorage.getItem("careerInfo") || "{}");
        const skills = JSON.parse(localStorage.getItem("skills") || "[]");
        const fallbackSteps = [
          {
            id: 0,
            content: `Research advanced certifications in ${careerInfo.industry || 'your industry'}`,
            timeframe: "3 months",
            explanation: "Professional certifications demonstrate your commitment to growth and validate your expertise to potential employers.",
            isOriginal: true,
            isEditing: false
          },
          {
            id: 1,
            content: `Build a portfolio showcasing your ${skills[0] || 'professional'} skills`,
            timeframe: "4 months",
            explanation: "A well-curated portfolio provides tangible evidence of your capabilities and helps you stand out in job applications.",
            isOriginal: true,
            isEditing: false
          },
          {
            id: 2,
            content: `Network with professionals in ${careerInfo.occupation || 'your target role'}`,
            timeframe: "2 months",
            explanation: "Professional networking is crucial for career advancement and can lead to mentorship opportunities and job referrals.",
            isOriginal: true,
            isEditing: false
          }
        ];

        setSteps(fallbackSteps);
        localStorage.setItem("userSteps", JSON.stringify(fallbackSteps));
      }
    };

    loadSteps();
  }, [toast]);

  // Save steps whenever they change
  useEffect(() => {
    if (!loading && steps.length > 0) {
      localStorage.setItem("userSteps", JSON.stringify(steps));
    }
  }, [steps, loading]);

  const handleReset = () => {
    localStorage.removeItem("careerInfo");
    localStorage.removeItem("careerGoals");
    localStorage.removeItem("skills");
    localStorage.removeItem("guidanceAnswers");
    localStorage.removeItem("clarificationAnswers");
    navigate("/");
  };

  const handleCommit = () => {
    navigate("/phone-commitment");
  };

  return (
    <>
      <ProgressIndicator />
      <FormContainer title="Your Career Plan">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-gray-600">Generating your personalized career plan...</p>
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-600 space-y-2 mb-6">
              <p>Based on your responses and career goals, we've created a personalized career plan that we think will help you achieve your objectives.</p>
              <p>Feel free to modify these steps to better align with your preferences and circumstances.</p>
            </div>
            <StepsList
              steps={steps}
              setSteps={setSteps}
              editingContent={editingContent}
              editingTimeframe={editingTimeframe}
              setEditingContent={setEditingContent}
              setEditingTimeframe={setEditingTimeframe}
            />
            <ActionButtons onReset={handleReset} onCommit={handleCommit} />
          </>
        )}
      </FormContainer>
    </>
  );
};

export default NextSteps;