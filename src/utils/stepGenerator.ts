import { Step } from "@/types/steps";
import { supabase } from "@/integrations/supabase/client";
import { storage } from "@/utils/storage";

export async function generateStepsWithAI(): Promise<Step[]> {
  // Check if we already have saved steps
  const savedSteps = localStorage.getItem("userSteps");
  if (savedSteps) {
    return JSON.parse(savedSteps);
  }

  // Gather all necessary information
  const careerInfo = storage.getCareerInfo();
  const skills = JSON.parse(localStorage.getItem("skills") || "[]");
  
  console.log('Sending request to career-advice function with:', {
    type: 'career-goal',
    personalInfo: careerInfo,
    skills
  });

  try {
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
    return processAIResponse(data.advice);
  } catch (error) {
    console.error('Failed to generate steps using API, falling back to local generation:', error);
    return generateLocalFallbackSteps(careerInfo);
  }
}

export function processAIResponse(aiResponse: string): Step[] {
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
  return steps.map((step, index) => ({
    id: index,
    content: step.content || '',
    timeframe: step.timeframe || '3 months',
    explanation: step.explanation || 'This step was generated based on your career goals and preferences.',
    isEditing: false,
    isOriginal: true,
  }));
}

export async function saveSteps(steps: Step[]): Promise<void> {
  // Use the new storage utility function to save steps to both localStorage and Supabase
  await storage.saveSteps(steps);
}

function generateLocalFallbackSteps(careerInfo: any): Step[] {
  console.log("Using local fallback to generate steps");
  const goal = careerInfo.careerGoals || "Advancing in your career";
  const occupation = careerInfo.occupation || "professional";
  const industry = careerInfo.industry || "your industry";
  
  const steps: Step[] = [
    {
      id: 0,
      content: `Complete a skills assessment to identify strengths and areas for improvement as a ${occupation}`,
      timeframe: "1 month",
      explanation: "Understanding your current skill level helps create a targeted development plan.",
      isEditing: false,
      isOriginal: true
    },
    {
      id: 1,
      content: `Research certification options that would increase your marketability in ${industry}`,
      timeframe: "2 months",
      explanation: "Industry-recognized certifications can significantly boost your credentials and visibility to employers.",
      isEditing: false,
      isOriginal: true
    },
    {
      id: 2,
      content: "Develop a professional network by attending at least 2 industry events or webinars",
      timeframe: "3 months",
      explanation: "Building professional relationships is critical for finding new opportunities and gaining industry insights.",
      isEditing: false,
      isOriginal: true
    },
    {
      id: 3,
      content: `Create or update your portfolio highlighting your best work and achievements as a ${occupation}`,
      timeframe: "2 months",
      explanation: "A strong portfolio demonstrates your capabilities and experience to potential employers or clients.",
      isEditing: false,
      isOriginal: true
    },
    {
      id: 4,
      content: "Set up informational interviews with 3-5 senior professionals in your desired role",
      timeframe: "4 months",
      explanation: "These conversations provide valuable insights about career paths and help you build connections.",
      isEditing: false,
      isOriginal: true
    }
  ];
  
  return steps;
}
