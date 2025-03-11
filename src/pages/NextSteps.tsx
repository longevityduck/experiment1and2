
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

const NextSteps = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingContent, setEditingContent] = useState("");
  const [editingTimeframe, setEditingTimeframe] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have the required data to generate steps
    const careerInfo = storage.getCareerInfo();
    const hasRequiredData = careerInfo.careerGoals && careerInfo.personalInfo;
    
    if (!hasRequiredData) {
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
      
      // Validate user-added steps against career goal
      const careerGoal = storage.getCareerInfo().careerGoals || "";
      const { data, error } = await supabase.functions.invoke('validate-career-steps', {
        body: { 
          steps,
          careerGoal
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.valid && data.issues.length > 0) {
        // Show issues to user
        toast({
          title: "Review Needed",
          description: `Some steps may need adjustment: ${data.issues[0].reason}`,
          variant: "destructive",
          duration: 5000,
        });
        setLoading(false);
        return;
      }
      
      // Everything is valid, save steps and go to success page
      localStorage.setItem("userSteps", JSON.stringify(steps));
      toast({
        title: "Success!",
        description: "Your career steps have been saved.",
      });
      
      // Navigate to success page
      navigate("/success");
    } catch (error) {
      console.error("Error validating steps:", error);
      toast({
        title: "Error",
        description: "Failed to validate your career steps. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetSteps = () => {
    // Clear saved steps
    localStorage.removeItem("userSteps");
    setLoading(true);
    // This will trigger the StepsGenerator to generate new steps
    setTimeout(() => {
      window.location.reload();
    }, 500);
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
              
              <h3 className="text-lg font-medium mb-4">
                Action Steps to Achieve Your Goal
              </h3>
              
              <p className="text-sm text-gray-600 mb-6">
                These steps are tailored to your career goal and personal situation. You can edit, reorder, 
                or add new steps as needed. Drag to reorder steps by priority.
              </p>
              
              <StepsList 
                steps={steps}
                setSteps={setSteps}
                editingContent={editingContent}
                editingTimeframe={editingTimeframe}
                setEditingContent={setEditingContent}
                setEditingTimeframe={setEditingTimeframe}
              />
              
              <ActionButtons 
                onReset={handleResetSteps} 
                onCommit={handleCommitSteps} 
              />
            </>
          )}
          
          <StepsGenerator 
            onStepsGenerated={setSteps}
            setLoading={setLoading}
          />
        </div>
      </FormContainer>
    </>
  );
};

export default NextSteps;
