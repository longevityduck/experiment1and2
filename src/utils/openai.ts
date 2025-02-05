import { supabase } from "@/integrations/supabase/client";

export const getIndustrySuggestions = async (occupation: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('career-advice', {
      body: { 
        type: 'industry-suggestions',
        occupation 
      }
    });

    if (error) throw error;

    // Parse the AI response into a list of industries
    const suggestions = data.advice
      .split('\n')
      .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
      .filter((line: string) => line.length > 0)
      .slice(0, 5); // Take only the first 5 suggestions

    return suggestions;
  } catch (error) {
    console.error('Error getting industry suggestions:', error);
    return [];
  }
};

export const getCareerAdvice = async (personalInfo: any): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('career-advice', {
      body: {
        type: 'career-advice',
        ...personalInfo
      }
    });

    if (error) throw error;
    return data.advice;
  } catch (error) {
    console.error('Error getting career advice:', error);
    return "Unable to generate career advice at this moment. Please try again later.";
  }
};