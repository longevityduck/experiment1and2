
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
import { RefreshCcw } from "lucide-react";

const NextSteps = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingContent, setEditingContent] = useState("");
  const [editingTimeframe, setEditingTimeframe] = useState("");
  const [regenerating, setRegenerating] = useState(false);
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
  }, [navigate, toast]);

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
  
  const handleRegenerateSteps = () => {
    setRegenerating(true);
    setLoading(true);
    
    // Clear existing steps
    localStorage.removeItem("userSteps");
    
    // Re-initialize with empty steps
    setSteps([]);
    
    // Show toast
    toast({
      title: "Regenerating Steps",
      description: "Creating new SMART career steps tailored to your goals...",
    });
    
    // Set a timeout to ensure the loading state is shown
    setTimeout(() => {
      setRegenerating(false);
    }, 1500);
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
                  Action Steps
                </h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRegenerateSteps}
                  disabled={regenerating}
                  className="flex items-center gap-1"
                >
                  <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                  Regenerate Steps
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                These personalized action steps are tailored to your career goal and personal situation. 
                Each step is designed to be clear, measurable, and achievable within the specified timeframe.
                You can edit, reorder, or add new steps as needed.
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
          
          {!loading && regenerating && <StepsGenerator 
            onStepsGenerated={setSteps}
            setLoading={setLoading}
          />}
          
          {loading && !regenerating && <StepsGenerator 
            onStepsGenerated={setSteps}
            setLoading={setLoading}
          />}
        </div>
      </FormContainer>
    </>
  );
};

export default NextSteps;
