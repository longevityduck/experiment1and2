
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Step } from "@/types/steps";
import { storage } from "@/utils/storage";

interface StepsGeneratorProps {
  onStepsGenerated: (steps: Step[]) => void;
  setLoading: (loading: boolean) => void;
}

// Enhanced fallback function that generates more specific steps
const generateFallbackSteps = (careerInfo: any, skills: string[] = []): Step[] => {
  // Extract all available information
  const industry = careerInfo.industry || 'your industry';
  const occupation = careerInfo.occupation || 'your field';
  const experience = parseInt(careerInfo.experience || '0', 10);
  const careerGoals = careerInfo.careerGoals || '';
  const guidanceAnswers = careerInfo.guidanceAnswers || {};
  
  // Extract key information from guidance answers if available
  const satisfaction = guidanceAnswers[1] || '';
  const motivation = guidanceAnswers[2] || '';
  const fiveYearPlan = guidanceAnswers[3] || '';
  const riskTolerance = guidanceAnswers[4] || '';
  const careerValue = guidanceAnswers[5] || '';
  
  // Process skills information
  const skillsList = skills.length > 0 ? skills : ['professional', 'technical', 'communication'];
  const primarySkill = skillsList[0] || 'professional';
  const secondarySkill = skillsList[1] || 'technical';
  
  // Create a more targeted certification step based on industry and experience
  let certificationContent = `Complete an advanced certification in ${industry} with measurable assessment scores`;
  let certificationTimeframe = "3 months";
  let certificationExplanation = "Professional certifications demonstrate your commitment to growth and validate your expertise to potential employers. This specific certification will address key skill gaps in your profile.";
  
  if (industry.toLowerCase().includes('tech') || industry.toLowerCase().includes('it')) {
    certificationContent = `Obtain a recognized ${experience < 5 ? 'entry-level' : 'advanced'} certification in ${occupation === 'developer' ? 'cloud architecture' : occupation} with practical project completion`;
    certificationTimeframe = experience < 5 ? "2 months" : "4 months";
  } else if (industry.toLowerCase().includes('finance') || industry.toLowerCase().includes('accounting')) {
    certificationContent = `Complete ${experience < 5 ? 'CPA modules' : 'advanced financial analysis certification'} with minimum 80% assessment scores`;
    certificationTimeframe = "4 months";
  } else if (industry.toLowerCase().includes('health') || industry.toLowerCase().includes('medical')) {
    certificationContent = `Obtain specialized certification in ${experience < 5 ? 'patient care standards' : 'healthcare leadership'} with minimum 85% on assessments`;
    certificationTimeframe = "3 months";
  }
  
  // Create portfolio step based on career goal and skills
  let portfolioContent = `Build a portfolio showcasing 5-7 projects demonstrating your ${primarySkill} skills and measurable outcomes`;
  let portfolioExplanation = "A well-curated portfolio with specific examples provides tangible evidence of your capabilities and helps you stand out among competitors in job applications.";
  
  if (careerGoals.toLowerCase().includes('leadership') || fiveYearPlan.includes('higher position')) {
    portfolioContent = `Document 3-5 leadership achievements with quantifiable business impact and team development metrics`;
    portfolioExplanation = "Leadership portfolios that highlight specific achievements with measurable impacts demonstrate your ability to drive results through team leadership.";
  } else if (careerGoals.toLowerCase().includes('freelance') || careerGoals.toLowerCase().includes('own business')) {
    portfolioContent = `Create a client-facing portfolio of 5+ projects with testimonials and measurable business outcomes`;
    portfolioExplanation = "For independent professionals, a results-oriented portfolio that showcases client work and tangible outcomes is essential for attracting new business opportunities.";
  }
  
  // Create networking step based on industry and career goal
  let networkingContent = `Connect with and conduct informational interviews with 10 professionals in ${occupation}`;
  let networkingTimeframe = "2 months";
  let networkingExplanation = "Professional networking with specific outreach goals is crucial for career advancement and can lead to mentorship opportunities and job referrals. Setting a concrete target ensures consistent effort.";
  
  if (careerGoals.toLowerCase().includes('change') || fiveYearPlan.includes('different')) {
    networkingContent = `Build relationships with 8-10 professionals in your target role through industry events and LinkedIn, securing at least 5 informational interviews`;
    networkingTimeframe = "3 months";
    networkingExplanation = "When transitioning to a new role or industry, strategic networking with professionals in your target area provides invaluable insights and potential referral opportunities.";
  }
  
  const steps: Step[] = [
    {
      id: 0,
      content: certificationContent,
      timeframe: certificationTimeframe,
      explanation: certificationExplanation,
      isOriginal: true,
      isEditing: false
    },
    {
      id: 1,
      content: portfolioContent,
      timeframe: "4 months",
      explanation: portfolioExplanation,
      isOriginal: true,
      isEditing: false
    },
    {
      id: 2,
      content: networkingContent,
      timeframe: networkingTimeframe,
      explanation: networkingExplanation,
      isOriginal: true,
      isEditing: false
    }
  ];
  
  // Add more specific steps based on experience level
  if (experience < 3) {
    steps.push({
      id: 3,
      content: `Complete 2 specialized online courses in ${industry} and implement learnings in 1 real-world project with documented results`,
      timeframe: "3 months",
      explanation: "Early career professionals benefit greatly from structured learning combined with practical application to build foundational skills quickly. The specific project will demonstrate your application of knowledge.",
      isOriginal: true,
      isEditing: false
    });
    
    steps.push({
      id: 4,
      content: `Find and secure a mentor in ${occupation} with 10+ years experience, establishing monthly meetings with clear development goals`,
      timeframe: "2 months",
      explanation: "Structured mentorship early in your career accelerates professional development by providing guidance from those who have successfully navigated similar career paths.",
      isOriginal: true,
      isEditing: false
    });
    
  } else if (experience >= 3 && experience < 7) {
    steps.push({
      id: 3,
      content: `Lead a cross-functional project team of 3-5 people to deliver 1 significant initiative with measurable business impact`,
      timeframe: "6 months",
      explanation: "Mid-career professionals should focus on developing leadership skills through tangible projects to prepare for senior roles. This specific leadership experience will strengthen your resume.",
      isOriginal: true,
      isEditing: false
    });
    
    steps.push({
      id: 4,
      content: `Develop expertise in ${secondarySkill} through specialized training and applying it in at least 2 workplace initiatives with measurable outcomes`,
      timeframe: "5 months",
      explanation: "Expanding your skill set beyond your primary expertise creates versatility that is highly valued at more senior career levels.",
      isOriginal: true,
      isEditing: false
    });
    
  } else {
    steps.push({
      id: 3,
      content: `Mentor 2-3 junior professionals in ${occupation} with documented growth metrics and career advancement outcomes`,
      timeframe: "4 months",
      explanation: "Experienced professionals can solidify their expertise and enhance their reputation through structured mentoring programs with measurable outcomes for mentees.",
      isOriginal: true,
      isEditing: false
    });
    
    steps.push({
      id: 4,
      content: `Develop and deliver a thought leadership piece (article, presentation, or workshop) on a key challenge in ${industry} to an audience of 30+ professionals`,
      timeframe: "3 months",
      explanation: "Establishing yourself as a thought leader enhances your professional reputation and opens doors to new opportunities while solidifying your expert status.",
      isOriginal: true,
      isEditing: false
    });
  }
  
  // Add a step related to career values if that information is available
  if (careerValue) {
    if (careerValue.toLowerCase().includes('balance') || careerValue.toLowerCase().includes('time')) {
      steps.push({
        id: 5,
        content: `Implement a structured work-life integration system with clear boundaries and weekly assessment of effectiveness`,
        timeframe: "2 months",
        explanation: "Creating sustainable work-life balance requires intentional systems and regular evaluation to ensure career progress doesn't come at the expense of personal wellbeing.",
        isOriginal: true,
        isEditing: false
      });
    } else if (careerValue.toLowerCase().includes('impact') || careerValue.toLowerCase().includes('difference')) {
      steps.push({
        id: 5,
        content: `Identify and contribute to 2 projects in ${industry} with social impact, documenting specific contributions and outcomes`,
        timeframe: "4 months",
        explanation: "Aligning your work with purpose-driven initiatives satisfies the desire for meaningful contribution while building valuable experience and connections.",
        isOriginal: true,
        isEditing: false
      });
    }
  }
  
  return steps;
};

const StepsGenerator = ({ onStepsGenerated, setLoading }: StepsGeneratorProps) => {
  const { toast } = useToast();
  const [hasAttemptedSupabase, setHasAttemptedSupabase] = useState(false);

  useEffect(() => {
    const generateSteps = async () => {
      try {
        // Check if we already have saved steps
        const savedSteps = localStorage.getItem("userSteps");
        if (savedSteps) {
          const parsedSteps = JSON.parse(savedSteps);
          if (parsedSteps && Array.isArray(parsedSteps) && parsedSteps.length > 0) {
            onStepsGenerated(parsedSteps);
            setLoading(false);
            return;
          } else {
            // If saved steps are invalid, remove them
            localStorage.removeItem("userSteps");
          }
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

        // Add safety check before processing
        if (!personalInfo.occupation || !personalInfo.industry) {
          throw new Error("Missing required information");
        }

        console.log('Sending request to career-advice function with:', {
          personalInfo,
          guidanceAnswers,
          clarificationAnswers,
          careerGoals
        });

        // Only attempt Supabase once
        if (!hasAttemptedSupabase) {
          setHasAttemptedSupabase(true);
          
          try {
            // Set a timeout for the Supabase call to prevent indefinite waiting
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error("Request timed out")), 8000);
            });
            
            // Try to get steps from Supabase with a timeout
            const supabasePromise = supabase.functions.invoke('career-advice', {
              body: {
                type: 'career-goal',
                personalInfo,
                guidanceAnswers,
                clarificationAnswers,
                careerGoals
              }
            });
            
            // Race between the Supabase call and the timeout
            const { data, error } = await Promise.race([
              supabasePromise,
              timeoutPromise.then(() => {
                throw new Error("Request timed out");
              })
            ]) as any;

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
        } else {
          // Skip Supabase attempt if we've already tried
          throw new Error("Using local generation due to previous Supabase failure");
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
  }, [onStepsGenerated, setLoading, toast, hasAttemptedSupabase]);

  return null;
};

export default StepsGenerator;
