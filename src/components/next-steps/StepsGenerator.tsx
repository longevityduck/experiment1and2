
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
  const careerGoal = careerInfo.careerGoals || 'career advancement';
  
  const steps: Step[] = [
    {
      id: 0,
      content: `Complete an advanced "${industry}" certification with a score of 85% or higher within 90 days`,
      timeframe: "3 months",
      explanation: `A recognized certification in ${industry} demonstrates measurable expertise to employers and addresses specific skill gaps in your profile. This aligns directly with your goal of ${careerGoal}.`,
      isOriginal: true,
      isEditing: false
    },
    {
      id: 1,
      content: `Create a portfolio with 5-7 projects showcasing your ${skillsList[0] || 'professional'} skills, with each project demonstrating a different competency`,
      timeframe: "4 months",
      explanation: `A quantifiable portfolio with concrete examples provides evidence of your capabilities in ${occupation} and helps you stand out in competitive job applications. This directly supports your progression toward ${careerGoal}.`,
      isOriginal: true,
      isEditing: false
    },
    {
      id: 2,
      content: `Connect with and conduct informational interviews with 10 professionals in ${occupation} roles at companies you admire`,
      timeframe: "2 months",
      explanation: `Building a specific network with measurable outreach goals creates tangible opportunities for mentorship and job referrals. Setting a numeric target ensures consistent effort toward achieving ${careerGoal}.`,
      isOriginal: true,
      isEditing: false
    }
  ];
  
  // Add more specific steps based on experience level
  if (experience < 3) {
    steps.push({
      id: 3,
      content: `Complete 2 specialized online courses in ${industry} and implement learnings in 1 real-world project with documented outcomes`,
      timeframe: "3 months",
      explanation: `Early career professionals benefit from combining structured learning with practical application. This step provides quantifiable progress through course completion and a tangible project that demonstrates your growing expertise in ${industry}.`,
      isOriginal: true,
      isEditing: false
    });
  } else if (experience >= 3 && experience < 7) {
    steps.push({
      id: 3,
      content: `Lead a cross-functional project team of 3-5 people to deliver a significant initiative that demonstrates a 15% improvement in efficiency or revenue`,
      timeframe: "6 months",
      explanation: `Mid-career professionals need leadership experience with measurable business impact. This project will strengthen your resume with quantifiable results and prepare you for senior roles in ${occupation}.`,
      isOriginal: true,
      isEditing: false
    });
  } else {
    steps.push({
      id: 3,
      content: `Mentor 2-3 junior professionals in ${occupation} with documented growth metrics and track their improvement in 3 key skill areas`,
      timeframe: "4 months",
      explanation: `Experienced professionals enhance their leadership reputation through structured mentoring with measurable outcomes. This demonstrates your expertise while building your influence in ${industry}, directly supporting your goal of ${careerGoal}.`,
      isOriginal: true,
      isEditing: false
    });
  }
  
  return steps;
};

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

        // Set a timeout to use local generation if the API takes too long
        const timeout = setTimeout(() => {
          console.log("API call timeout - using local generation");
          const careerInfo = storage.getCareerInfo();
          const skills = JSON.parse(localStorage.getItem("skills") || "[]");
          const fallbackSteps = generateFallbackSteps(careerInfo, skills);
          
          onStepsGenerated(fallbackSteps);
          localStorage.setItem("userSteps", JSON.stringify(fallbackSteps));
          setLoading(false);
          
          toast({
            title: "Using local recommendations",
            description: "We generated career steps based on your information.",
            variant: "default",
          });
        }, 15000); // 15 second timeout
        
        setTimeoutId(timeout as unknown as number);

        // Gather all necessary information
        const careerInfo = storage.getCareerInfo();
        
        // Validate required data
        if (!careerInfo.careerGoals || !careerInfo.occupation || !careerInfo.industry) {
          throw new Error("Missing required career information");
        }
        
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
          careerGoals,
          skills
        });

        const { data, error } = await supabase.functions.invoke('career-advice', {
          body: {
            type: 'career-goal',
            personalInfo,
            guidanceAnswers,
            clarificationAnswers,
            careerGoals,
            skills
          }
        });

        if (error) {
          console.error('Error generating steps from Supabase:', error);
          throw error;
        }

        clearTimeout(timeout);
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
        
        toast({
          title: "Career Plan Generated",
          description: "Your personalized career steps have been created using AI.",
          variant: "default",
        });

      } catch (error) {
        console.error("Error generating steps:", error);
        
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        toast({
          title: "Using local recommendations",
          description: "We're generating career steps based on your information.",
          variant: "default",
        });

        // Fall back to local generation if the OpenAI call fails
        const careerInfo = storage.getCareerInfo();
        const skills = JSON.parse(localStorage.getItem("skills") || "[]");
        const fallbackSteps = generateFallbackSteps(careerInfo, skills);

        onStepsGenerated(fallbackSteps);
        localStorage.setItem("userSteps", JSON.stringify(fallbackSteps));
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
