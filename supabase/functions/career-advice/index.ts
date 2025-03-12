
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    console.log('Received request:', requestData);

    if (!requestData.type) {
      throw new Error('Request type is required');
    }

    if (requestData.type === 'career-goal') {
      const { personalInfo, guidanceAnswers, clarificationAnswers, careerGoals, skills = [] } = requestData;
      
      // Create a detailed prompt that leverages all available information
      const prompt = `Based on the following information, create a personalized career development plan following a framework of steps that are specific, measurable, achievable, relevant, and time-bound:

Personal Information:
${Object.entries(personalInfo || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}

Career Guidance Responses:
${Object.entries(guidanceAnswers || {}).map(([key, value]) => `Question ${key}: ${value}`).join('\n')}

Career Clarification Responses:
${Object.entries(clarificationAnswers || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}

Career Goals:
${careerGoals}

Key Skills:
${skills.length > 0 ? skills.join(', ') : 'No specific skills provided'}

First, provide a single career goal statement that is specific, measurable, achievable, relevant, and time-bound.
Format: "Career Goal: [Your goal statement here]"

Then, provide 5-7 actionable steps to achieve this goal. For each step:
1. Make each action step extremely specific and clearly defined with concrete activities
2. Include specific, measurable success criteria or metrics to track progress
3. Ensure the step is achievable but challenging within the given timeframe
4. Make it directly relevant to their career goal and situation based on their responses
5. Include a realistic timeframe in months or weeks
6. Consider the person's industry, occupation, and experience level to tailor the advice

Format each step exactly as follows (maintain exact formatting):
Step: [Specific, measurable action step with metrics]
Timeframe: [X] months
Explanation: [2-3 sentences explaining why this step is important, how it's achievable, and how it connects to the larger goal]

Make sure each step is separated by a blank line.
Make timeframes realistic and varied between steps.
Ensure explanations are personalized and specific to the user's situation.
Steps should build on each other in a logical progression.
Include specific metrics and milestones in each step.
Reference industry-specific skills, certifications, or networking opportunities where applicable.`;

      console.log('Sending prompt to OpenAI:', prompt);

      // Use GPT-4o for better career advice generation
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are a career development expert who creates personalized, actionable career plans. Your advice should be specific, measurable, achievable, relevant, and time-bound while maintaining a natural, conversational tone. Ensure all steps have concrete metrics, realistic timeframes, and are tailored to the person\'s unique situation.'
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.5, // Lower temperature for more precise, focused output
          max_tokens: 2000, // Increased max tokens for more comprehensive steps
        }),
      });

      if (!response.ok) {
        console.error('OpenAI API error:', response.statusText);
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('OpenAI response:', data);

      return new Response(
        JSON.stringify({ advice: data.choices[0].message.content }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (requestData.type === 'industry-suggestions') {
      const { occupation } = requestData;
      
      if (!occupation) {
        throw new Error('Occupation is required for industry suggestions');
      }

      const prompt = `Given the occupation "${occupation}", suggest 5 relevant industries where this occupation is commonly found. Format each suggestion on a new line with a number prefix (e.g., "1. Technology").`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a career advisor helping to suggest relevant industries for different occupations.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 200,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return new Response(
        JSON.stringify({ advice: data.choices[0].message.content }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (requestData.type === 'career-advice') {
      const prompt = `Based on the following information about a professional:
      
${Object.entries(requestData).filter(([key]) => key !== 'type').map(([key, value]) => `${key}: ${value}`).join('\n')}

Provide brief career advice focusing on potential growth opportunities and skill development areas.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a career advisor providing concise, actionable advice.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return new Response(
        JSON.stringify({ advice: data.choices[0].message.content }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid request type');

  } catch (error) {
    console.error('Error in career-advice function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
