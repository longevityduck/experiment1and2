
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Step } from "@/types/steps";
import { generateStepsWithAI, saveSteps } from "@/utils/stepGenerator";

interface UseStepGeneratorOptions {
  onStepsGenerated: (steps: Step[]) => void;
  setLoading: (loading: boolean) => void;
}

export function useStepGenerator({ onStepsGenerated, setLoading }: UseStepGeneratorOptions) {
  const { toast } = useToast();
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  useEffect(() => {
    const generateSteps = async () => {
      try {
        const formattedSteps = await generateStepsWithAI();

        if (formattedSteps.length === 0) {
          throw new Error('No steps were generated');
        }

        onStepsGenerated(formattedSteps);
        saveSteps(formattedSteps);
        setLoading(false);
        
        toast({
          title: "Career Plan Generated",
          description: "Your personalized career steps have been created using AI.",
          variant: "default",
        });

      } catch (error) {
        console.error("Error generating steps:", error);
        toast({
          title: "Error Generating Steps",
          description: "There was an error generating your career steps. Please try again later.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    generateSteps();
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [onStepsGenerated, setLoading, toast, timeoutId]);

  return null;
}
