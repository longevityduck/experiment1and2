import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Step } from "@/types/steps";

interface StepsGeneratorProps {
  onStepsGenerated: (steps: Step[]) => void;
  setLoading: (loading: boolean) => void;
}

const StepsGenerator = ({ onStepsGenerated, setLoading }: StepsGeneratorProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const generateSteps = async () => {
      try {
        const savedSteps = localStorage.getItem("userSteps");
        if (savedSteps) {
          onStepsGenerated(JSON.parse(savedSteps));
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
            const timeframeMatch = line.match(/(\d+)\s*months?/i);
            currentStep.timeframe = timeframeMatch ? `${timeframeMatch[1]} months` : '3 months';
          } else if (processingSteps && line.toLowerCase().startsWith('explanation:')) {
            currentStep.explanation = line.replace(/^explanation:\s*/i, '').trim();
          }
        }
        
        if (Object.keys(currentStep).length > 0) {
          steps.push(currentStep);
        }

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
      } catch (error) {
        console.error("Error generating steps:", error);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to generate next steps. Please try again.",
          variant: "destructive",
        });

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

        onStepsGenerated(fallbackSteps);
        localStorage.setItem("userSteps", JSON.stringify(fallbackSteps));
      }
    };

    generateSteps();
  }, [onStepsGenerated, setLoading, toast]);

  return null;
};

export default StepsGenerator;