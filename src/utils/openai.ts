import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const getOpenAIKey = async () => {
  const { data, error } = await supabase
    .from('secrets')
    .select('value')
    .eq('name', 'OPENAI_API_KEY')
    .single();

  if (error) {
    console.error('Error fetching OpenAI API key:', error);
    throw new Error('Failed to fetch OpenAI API key');
  }

  return data.value;
};

export const getIndustrySuggestions = async (occupation: string): Promise<string[]> => {
  try {
    const apiKey = await getOpenAIKey();
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "You are a career guidance expert. Given an occupation, suggest relevant industries where this occupation might be found. Return exactly 5 industries."
        }, {
          role: "user",
          content: `What are the most relevant industries for someone working as a ${occupation}?`
        }],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get industry suggestions');
    }

    const data = await response.json();
    const suggestions = data.choices[0].message.content
      .split('\n')
      .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
      .filter((line: string) => line.length > 0);

    return suggestions;
  } catch (error) {
    console.error('Error getting industry suggestions:', error);
    return [];
  }
};

export const getCareerAdvice = async (personalInfo: any): Promise<string> => {
  try {
    const apiKey = await getOpenAIKey();
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "You are a career guidance expert. Provide personalized career advice based on the user's information."
        }, {
          role: "user",
          content: `Please provide career advice for someone with the following background:
            Age: ${personalInfo.age}
            Industry: ${personalInfo.industry}
            Occupation: ${personalInfo.occupation}
            Years of Experience: ${personalInfo.experience}`
        }],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get career advice');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting career advice:', error);
    return "Unable to generate career advice at this moment. Please try again later.";
  }
};