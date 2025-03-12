
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Step } from "@/types/steps";
import { storage } from "@/utils/storage";

interface StepsGeneratorProps {
  onStepsGenerated: (steps: Step[]) => void;
  setLoading: (loading: boolean) => void;
}

const StepsGenerator = ({ onStepsGenerated, setLoading }: StepsGeneratorProps) => {
  const { toast } = useToast();
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  useEffect(() => {
    const generateSteps = async () => {
      try {
        // Check if we already have saved steps
        const savedSteps = localStorage.getItem("userSteps");
        if (savedSteps) {
          onStepsGenerated(JSON.parse(savedSteps));
          setLoading(false);
          return;
        }

        // Gather all necessary information
        const careerInfo = storage.getCareerInfo();
        const skills = JSON.parse(localStorage.getItem("skills") || "[]");
        
        console.log('Sending request to career-advice function with:', {
          type: 'career-goal',
          personalInfo: careerInfo,
          skills
        });

        const { data, error } = await supabase.functions.invoke('career-advice', {
          body: {
            type: 'career-goal',
            personalInfo: {
              age: careerInfo.age,
              occupation: careerInfo.occupation,
              industry: careerInfo.industry,
              experience: careerInfo.experience
            },
            guidanceAnswers: careerInfo.guidanceAnswers || {},
            clarificationAnswers: careerInfo.clarificationAnswers || {},
            careerGoals: careerInfo.careerGoals || "",
            skills
          }
        });

        if (error) {
          console.error('Error generating steps from OpenAI:', error);
          throw error;
        }

        console.log('Received response from career-advice function:', data);

        // Process the response from OpenAI
        const aiResponse = data.advice;
        const steps: Partial<Step>[] = [];
        let currentStep: Partial<Step> = {};
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
            currentStep.timeframe = line.replace(/^timeframe:\s*/i, '').trim();
          } else if (processingSteps && line.toLowerCase().startsWith('explanation:')) {
            currentStep.explanation = line.replace(/^explanation:\s*/i, '').trim();
          }
        }
        
        if (Object.keys(currentStep).length > 0) {
          steps.push(currentStep);
        }

        // Format the steps for display
        const formattedSteps = steps.map((step, index) => ({
          id: index,
          content: step.content || '',
          timeframe: step.timeframe || '3 months',
          explanation: step.explanation || 'This step was generated based on your career goals and preferences.',
          isEditing: false,
          isOriginal: true,
        }));

        if (formattedSteps.length === 0) {
          throw new Error('No steps were generated');
        }

        onStepsGenerated(formattedSteps);
        localStorage.setItem("userSteps", JSON.stringify(formattedSteps));
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
  }, [onStepsGenerated, setLoading, toast]);

  return null;
};

export default StepsGenerator;
