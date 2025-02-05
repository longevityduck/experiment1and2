
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepsList from "@/components/next-steps/StepsList";
import ActionButtons from "@/components/next-steps/ActionButtons";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import { ProgressIndicator } from "@/components/career-guidance/ProgressIndicator";
import LoadingState from "@/components/next-steps/LoadingState";
import StepsGenerator from "@/components/next-steps/StepsGenerator";
import { Step } from "@/types/steps";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const NextSteps = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<Step[]>([]);
  const [editingContent, setEditingContent] = useState("");
  const [editingTimeframe, setEditingTimeframe] = useState("");
  const [validationIssues, setValidationIssues] = useState<any[]>([]);
  const [showValidationDialog, setShowValidationDialog] = useState(false);

  const handleReset = () => {
    localStorage.removeItem("careerInfo");
    localStorage.removeItem("careerGoals");
    localStorage.removeItem("skills");
    localStorage.removeItem("guidanceAnswers");
    localStorage.removeItem("clarificationAnswers");
    navigate("/");
  };

  const validateSteps = async () => {
    try {
      const careerGoals = localStorage.getItem("careerGoals");
      if (!careerGoals) {
        toast({
          title: "Error",
          description: "Career goals not found. Please restart the process.",
          variant: "destructive",
        });
        return false;
      }

      const { data, error } = await supabase.functions.invoke("validate-career-steps", {
        body: {
          steps,
          careerGoal: careerGoals,
        },
      });

      if (error) throw error;

      if (!data.valid) {
        setValidationIssues(data.issues);
        setShowValidationDialog(true);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error validating steps:", error);
      toast({
        title: "Validation Error",
        description: "Could not validate the career steps. You may proceed if you wish.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleCommit = async () => {
    const isValid = await validateSteps();
    if (isValid) {
      navigate("/phone-commitment");
    }
  };

  const handleContinueAnyway = () => {
    setShowValidationDialog(false);
    navigate("/phone-commitment");
  };

  return (
    <>
      <ProgressIndicator />
      <FormContainer title="Your Career Plan">
        {loading ? (
          <>
            <LoadingState />
            <StepsGenerator onStepsGenerated={setSteps} setLoading={setLoading} />
          </>
        ) : (
          <>
            <div className="text-sm text-gray-600 space-y-2 mb-6">
              <p>
                Based on your responses and career goals, we've created a
                personalized career plan that we think will help you achieve your
                objectives.
              </p>
              <p>
                Feel free to modify these steps to better align with your
                preferences and circumstances.
              </p>
              <p className="text-sm text-gray-600 mt-4">
                Want to learn more about career planning? Watch this helpful{" "}
                <a
                  href="https://www.youtube.com/watch?v=josBNfsFtU4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 font-medium underline"
                >
                  video guide on setting a career plan
                </a>
                .
              </p>
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

            <AlertDialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Review Your Career Steps</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-4">
                    <p>
                      We've identified some steps that might not align perfectly with your career goal:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      {validationIssues.map((issue, index) => (
                        <li key={index} className="text-amber-600">
                          <span className="font-medium">{issue.stepContent}</span>
                          <br />
                          <span className="text-sm text-gray-600">{issue.reason}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="pt-2">
                      Would you like to review and adjust these steps, or continue with your current plan?
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Review Steps</AlertDialogCancel>
                  <AlertDialogAction onClick={handleContinueAnyway}>
                    Continue Anyway
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </FormContainer>
    </>
  );
};

export default NextSteps;
