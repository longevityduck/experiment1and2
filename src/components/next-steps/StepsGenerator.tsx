
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Step } from "@/types/steps";
import { storage } from "@/utils/storage";

interface StepsGeneratorProps {
  onStepsGenerated: (steps: Step[]) => void;
  setLoading: (loading: boolean) => void;
}

// Local fallback function for generating steps
const generateFallbackSteps = (careerInfo: any, skills: string[] = []): Step[] => {
  const industry = careerInfo.industry || 'your industry';
  const occupation = careerInfo.occupation || 'your field';
  const experience = parseInt(careerInfo.experience || '0', 10);
  const skillsList = skills.length > 0 ? skills : ['professional', 'technical', 'communication'];
  
  const steps: Step[] = [
    {
      id: 0,
      content: `Complete an advanced certification in ${industry} with 85% or higher score`,
      timeframe: "3 months",
      explanation: "Professional certifications demonstrate your commitment to growth and validate your expertise to potential employers. This specific certification will address key skill gaps in your profile.",
      isOriginal: true,
      isEditing: false
    },
    {
      id: 1,
      content: `Build a portfolio showcasing 5-7 projects demonstrating your ${skillsList[0] || 'professional'} skills`,
      timeframe: "4 months",
      explanation: "A well-curated portfolio with specific examples provides tangible evidence of your capabilities and helps you stand out among competitors in job applications.",
      isOriginal: true,
      isEditing: false
    },
    {
      id: 2,
      content: `Connect with and have informational interviews with 10 professionals in ${occupation}`,
      timeframe: "2 months",
      explanation: "Professional networking with specific outreach goals is crucial for career advancement and can lead to mentorship opportunities and job referrals. Setting a concrete target ensures consistent effort.",
      isOriginal: true,
      isEditing: false
    }
  ];
  
  // Add more specific steps based on experience level
  if (experience < 3) {
    steps.push({
      id: 3,
      content: `Complete 2 specialized online courses in ${industry} and implement learnings in 1 real-world project`,
      timeframe: "3 months",
      explanation: "Early career professionals benefit greatly from structured learning combined with practical application to build foundational skills quickly. The specific project will demonstrate your application of knowledge.",
      isOriginal: true,
      isEditing: false
    });
  } else if (experience >= 3 && experience < 7) {
    steps.push({
      id: 3,
      content: `Lead a project team of 3-5 people to deliver 1 significant initiative with measurable business impact`,
      timeframe: "6 months",
      explanation: "Mid-career professionals should focus on developing leadership skills through tangible projects to prepare for senior roles. This specific leadership experience will strengthen your resume.",
      isOriginal: true,
      isEditing: false
    });
  } else {
    steps.push({
      id: 3,
      content: `Mentor 2-3 junior professionals in ${occupation} with documented growth metrics`,
      timeframe: "4 months",
      explanation: "Experienced professionals can solidify their expertise and enhance their reputation through structured mentoring programs with measurable outcomes for mentees.",
      isOriginal: true,
      isEditing: false
    });
  }
  
  return steps;
};

const StepsGenerator = ({ onStepsGenerated, setLoading }: StepsGeneratorProps) => {
  const { toast } = useToast();

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
        const personalInfo = {
          age: careerInfo.age,
          occupation: careerInfo.occupation,
          industry: careerInfo.industry,
          experience: careerInfo.experience,
          ...(careerInfo.personalInfo || {})
        };
        
        const guidanceAnswers = careerInfo.guidanceAnswers || {};
        const clarificationAnswers = careerInfo.clarificationAnswers || {};
        const careerGoals = careerInfo.careerGoals || "";
        const skills = JSON.parse(localStorage.getItem("skills") || "[]");

        console.log('Sending request to career-advice function with:', {
          personalInfo,
          guidanceAnswers,
          clarificationAnswers,
          careerGoals
        });

        try {
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
            console.error('Error generating steps from Supabase:', error);
            throw error;
          }

          console.log('Received response from career-advice function:', data);

          // Process the response from the LLM
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
              const timeframeMatch = line.match(/(\d+)\s*months?/i) || line.match(/(\d+)\s*weeks?/i);
              if (timeframeMatch) {
                const value = timeframeMatch[1];
                const unit = line.toLowerCase().includes('week') ? 'weeks' : 'months';
                currentStep.timeframe = `${value} ${unit}`;
              } else {
                currentStep.timeframe = '3 months'; // Default fallback
              }
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
          return;
        } catch (supabaseError) {
          console.error("Error with Supabase function, using local generation:", supabaseError);
          throw supabaseError; // Continue to fallback
        }

      } catch (error) {
        console.error("Error generating steps:", error);
        setLoading(false);
        toast({
          title: "Using local recommendations",
          description: "We're generating career steps based on your information.",
          variant: "default",
        });

        // Fall back to local generation if the LLM call fails
        const careerInfo = storage.getCareerInfo();
        const skills = JSON.parse(localStorage.getItem("skills") || "[]");
        const fallbackSteps = generateFallbackSteps(careerInfo, skills);

        onStepsGenerated(fallbackSteps);
        localStorage.setItem("userSteps", JSON.stringify(fallbackSteps));
      }
    };

    generateSteps();
  }, [onStepsGenerated, setLoading, toast]);

  return null;
};

export default StepsGenerator;
