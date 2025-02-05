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
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    const requestData = await req.json();
    console.log('Received request:', requestData);

    if (requestData.occupation) {
      const prompt = `Based on the occupation "${requestData.occupation}", suggest 5 relevant industries that this person might work in. Format the response as a simple list, one industry per line.`;
      console.log('Generating industry suggestions for:', requestData.occupation);

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are a career advisor helping to suggest relevant industries for different occupations.' },
              { role: 'user', content: prompt }
            ],
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('OpenAI API error:', error);
          
          // Check for quota exceeded error
          if (error.error?.message?.includes('exceeded your current quota')) {
            return new Response(
              JSON.stringify({ 
                error: 'OpenAI API quota exceeded',
                message: 'AI service temporarily unavailable',
                type: 'QUOTA_EXCEEDED'
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 429 // Using 429 for quota exceeded
              }
            );
          }
          
          throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        console.log('OpenAI response for industry suggestions:', data);

        return new Response(
          JSON.stringify({ advice: data.choices[0].message.content }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      } catch (error) {
        console.error('Error generating industry suggestions:', error);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to generate industry suggestions',
            details: error.toString()
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
          }
        );
      }
    }

    if (requestData.type === 'career-goal') {
      const { personalInfo, guidanceAnswers, clarificationAnswers, careerGoals } = requestData;
      
      const prompt = `As a career advisor, analyze the following information and create a detailed, step-by-step career development plan. Break down the main goals into smaller, actionable steps, each with its own specific timeline.

Personal Information:
${Object.entries(personalInfo || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}

Career Guidance Responses:
${Object.entries(guidanceAnswers || {}).map(([key, value]) => `Question ${key}: ${value}`).join('\n')}

Career Clarification Responses:
${Object.entries(clarificationAnswers || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}

Career Goals:
${careerGoals || ''}

Please provide a detailed action plan with the following requirements:
1. Break down the career goals into 5-7 specific, actionable steps
2. Each step should be clear and achievable
3. Assign a realistic timeline for each step (in months)
4. Format each step as: "Action step (X months)" where X is the number of months
5. Make steps progressive, building upon each other
6. Include both short-term (1-3 months) and longer-term (6+ months) steps
7. Focus on practical, measurable outcomes

Format the response as a list, with one step per line, including the timeline in parentheses at the end of each step.`;

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are a career development expert who creates detailed, actionable career plans. Your advice is specific, measurable, and time-bound.'
              },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('OpenAI API error:', error);
          
          if (error.error?.message?.includes('exceeded your current quota')) {
            return new Response(
              JSON.stringify({ 
                error: 'OpenAI API quota exceeded',
                message: 'AI service temporarily unavailable',
                type: 'QUOTA_EXCEEDED'
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 429
              }
            );
          }
          
          throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        console.log('OpenAI response:', data);

        return new Response(
          JSON.stringify({ advice: data.choices[0].message.content }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      } catch (error) {
        console.error('Error generating career steps:', error);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to generate career steps',
            details: error.toString()
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
          }
        );
      }
    }

    throw new Error('Invalid request type');
  } catch (error) {
    console.error('Error in career-advice function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
