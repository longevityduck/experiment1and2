import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import StepsList from "@/components/next-steps/StepsList";
import ActionButtons from "@/components/next-steps/ActionButtons";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import { ProgressIndicator } from "@/components/career-guidance/ProgressIndicator";
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
        // First try to load saved steps
        const savedSteps = localStorage.getItem("userSteps");
        if (savedSteps) {
          setSteps(JSON.parse(savedSteps));
          setLoading(false);
          return;
        }

        // If no saved steps, generate new ones using AI
        const personalInfo = JSON.parse(localStorage.getItem("careerInfo") || "{}");
        const guidanceAnswers = JSON.parse(localStorage.getItem("guidanceAnswers") || "{}");
        const clarificationAnswers = JSON.parse(localStorage.getItem("clarificationAnswers") || "{}");
        const careerGoals = localStorage.getItem("careerGoals") || "";

        // Call the AI function to generate personalized steps
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

        // Parse the AI response and format it into steps
        const aiSteps = data.advice.split('\n')
          .filter((step: string) => step.trim().length > 0)
          .map((step: string, index: number) => {
            const timeframeMatch = step.match(/\((\d+(?:-\d+)?\s*months?)\)/i);
            const timeframe = timeframeMatch ? timeframeMatch[1] : "1-3 months";
            const content = step.replace(/\(\d+(?:-\d+)?\s*months?\)/i, '').trim();
            
            return {
              id: index,
              content,
              timeframe,
              isEditing: false,
              explanation: "This step was generated based on your career goals and preferences.",
              isOriginal: true,
            };
          });

        setSteps(aiSteps);
        // Save the initial steps
        localStorage.setItem("userSteps", JSON.stringify(aiSteps));
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
            content: `Research advanced certifications in ${careerInfo.industry || 'your industry'}`,
            timeframe: "1-3 months",
            explanation: "Professional certifications demonstrate your commitment to growth and validate your expertise to potential employers.",
            isOriginal: true,
          },
          {
            content: `Build a portfolio showcasing your ${skills[0] || 'professional'} skills`,
            timeframe: "2-4 months",
            explanation: "A well-curated portfolio provides tangible evidence of your capabilities.",
            isOriginal: true,
          },
          {
            content: `Network with professionals in ${careerInfo.occupation || 'your target role'}`,
            timeframe: "1-2 months",
            explanation: "Professional networking is crucial for career advancement.",
            isOriginal: true,
          }
        ].map((step, id) => ({
          id,
          ...step,
          isEditing: false,
        }));

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
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-600 space-y-2 mb-6">
              <p>Based on your responses and career goals, we've created a personalized career plan that we think will help you achieve your objectives.</p>
              <p>Feel free to modify these steps to better align with your preferences and circumstances. You can add, edit, reorganize, or remove steps to make this plan truly yours.</p>
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