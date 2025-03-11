
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ProgressIndicator } from "@/components/career-guidance/ProgressIndicator";
import { supabase } from "@/integrations/supabase/client";
import { storage } from "@/utils/storage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FormContainer } from "@/components/career-guidance/FormContainer";
import { NavigationButtons } from "@/components/career-guidance/NavigationButtons";

const CareerGoals = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState("");
  const [isUnsure, setIsUnsure] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validationReason, setValidationReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const validateCareerGoal = async () => {
    try {
      setIsSaving(true);
      
      // Try to validate with the Edge Function
      try {
        const { data, error } = await supabase.functions.invoke("validate-career-goal", {
          body: { careerGoal: goals },
        });

        if (error) throw error;

        if (!data.valid) {
          setValidationReason(data.reason);
          setShowValidationDialog(true);
          return false;
        }

        return true;
      } catch (functionError) {
        console.error("Error validating career goal:", functionError);
        
        // If the function fails, do a basic validation and proceed
        if (goals.trim().length < 5) {
          toast.warning("Your career goal is quite short. Consider adding more detail.");
          return true;
        }
        
        return true;
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isUnsure) {
      navigate("/career-guidance");
      return;
    }

    if (!goals.trim()) {
      toast.error("Please enter your career goals");
      return;
    }

    const isValid = await validateCareerGoal();
    if (isValid) {
      storage.saveCareerInfo({ careerGoals: goals });
      navigate("/career-guidance");
    }
  };

  const handleContinueAnyway = () => {
    setShowValidationDialog(false);
    storage.saveCareerInfo({ careerGoals: goals });
    navigate("/career-guidance");
  };

  return (
    <FormContainer title="Career Goals">
      <ProgressIndicator />
      
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-gray-600">
            Career goals provide direction and motivation, helping you grow, stay focused, and achieve professional success.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Example of a career goal:</span><br />
              "I want to earn a promotion in the next 2 years by developing leadership skills and taking on more responsibilities."
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup
            value={isUnsure ? "unsure" : "know"}
            onValueChange={(value) => setIsUnsure(value === "unsure")}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="know" id="know" />
              <Label htmlFor="know">I know my career goals</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unsure" id="unsure" />
              <Label htmlFor="unsure">I'm not sure about my career goals</Label>
            </div>
          </RadioGroup>

          {!isUnsure && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What are your career goals? <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="Describe your career goals and aspirations..."
                className="min-h-[150px]"
                required
              />
            </div>
          )}

          <NavigationButtons
            onBack={() => navigate(-1)}
            onNext={() => {}}
            nextButtonText={isSaving ? "Saving..." : "Next"}
            disabled={isSaving}
            isNextSubmit={true}
          />
        </form>
      </div>

      <AlertDialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Review Your Career Goal</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                Your career goal might need some refinement:
              </p>
              <p className="text-amber-600">
                {validationReason}
              </p>
              <p>
                Would you like to revise your goal, or continue with your current goal?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Revise Goal</AlertDialogCancel>
            <AlertDialogAction onClick={handleContinueAnyway}>
              Continue Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </FormContainer>
  );
};

export default CareerGoals;
