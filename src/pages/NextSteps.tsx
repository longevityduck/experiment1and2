
import { useState, useEffect } from "react";
import { storage } from "@/utils/storage";
import { useNavigate } from "react-router-dom";
import { Step } from "@/types/steps";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import { ProgressIndicator } from "@/components/career-guidance/ProgressIndicator";
import StepsList from "@/components/next-steps/StepsList";
import StepsGenerator from "@/components/next-steps/StepsGenerator";
import LoadingState from "@/components/next-steps/LoadingState";
import ActionButtons from "@/components/next-steps/ActionButtons";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const NextSteps = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingTimeframe, setEditingTimeframe] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have the required data to generate steps
    const careerInfo = storage.getCareerInfo();
    console.log("Available career info:", careerInfo);
    
    const hasCareerGoals = Boolean(careerInfo.careerGoals);
    const hasPersonalInfo = Boolean(
      careerInfo.occupation && 
      careerInfo.industry && 
      careerInfo.experience
    );
    
    if (!hasCareerGoals || !hasPersonalInfo) {
      console.log("Missing required data, hasCareerGoals:", hasCareerGoals, "hasPersonalInfo:", hasPersonalInfo);
      toast({
        title: "Missing Information",
        description: "Please complete the career assessment process first.",
        variant: "destructive",
      });
      navigate("/career-confidence-assessment");
    }

    // Set a timeout to ensure loading doesn't get stuck
    const timeout = setTimeout(() => {
      // If still loading after 15 seconds, trigger fallback generation
      if (loading) {
        toast({
          title: "Taking longer than expected",
          description: "Using locally generated steps instead.",
          variant: "default",
        });
        setLoading(false);
      }
    }, 15000);
    
    setLoadingTimeout(timeout);

    return () => {
      // Clear the timeout when component unmounts
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [navigate, toast, loading, loadingTimeout]);

  const handleCommitSteps = async () => {
    try {
      setLoading(true);
      
      // Save steps before navigating
      localStorage.setItem("userSteps", JSON.stringify(steps));
      
      // Navigate to review steps page
      navigate("/review-career-steps");
    } catch (error) {
      console.error("Error saving steps:", error);
      toast({
        title: "Error",
        description: "Failed to save your career steps. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateSteps = async () => {
    try {
      setRegenerating(true);
      
      // Clear existing steps
      localStorage.removeItem("userSteps");
      
      // Reset state and trigger regeneration
      setSteps([]);
      setLoading(true);
      
      // Wait a moment to ensure the steps are cleared
      setTimeout(() => {
        setRegenerating(false);
      }, 500);
      
      toast({
        title: "Regenerating Steps",
        description: "Creating new personalized action steps based on your profile...",
      });
      
    } catch (error) {
      console.error("Error regenerating steps:", error);
      toast({
        title: "Error",
        description: "Failed to regenerate your career steps. Please try again.",
        variant: "destructive",
      });
      setRegenerating(false);
      setLoading(false);
    }
  };

  return (
    <>
      <ProgressIndicator />
      <FormContainer title="Your Career Action Plan">
        <div className="space-y-6">
          {loading ? (
            <LoadingState />
          ) : (
            <>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                <h3 className="font-medium text-blue-900 mb-2">Career Goal</h3>
                <p className="text-blue-800">
                  {storage.getCareerInfo().careerGoals || "Your career goal will appear here"}
                </p>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Action Steps to Achieve Your Goal
                </h3>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRegenerateSteps}
                  disabled={regenerating}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  Regenerate Steps
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                These steps are tailored to your specific career goals, industry, experience level, and preferences.
                You can edit, reorder, or add new steps as needed. Drag to reorder steps by priority.
              </p>
              
              <StepsList 
                steps={steps}
                setSteps={setSteps}
                editingContent={editingContent}
                editingTimeframe={editingTimeframe}
                setEditingContent={setEditingContent}
                setEditingTimeframe={setEditingTimeframe}
              />
              
              <ActionButtons onCommit={handleCommitSteps} />
            </>
          )}
          
          {(!loading || regenerating) && (
            <StepsGenerator 
              onStepsGenerated={setSteps}
              setLoading={setLoading}
            />
          )}
        </div>
      </FormContainer>
    </>
  );
};

export default NextSteps;
