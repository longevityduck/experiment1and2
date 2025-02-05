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

    if (requestData.type === 'career-goal') {
      const { personalInfo, guidanceAnswers, clarificationAnswers } = requestData;
      
      const prompt = `As a career advisor, analyze the following information and create a clear, aspirational career goal statement, followed by a detailed action plan.

Personal Information:
${Object.entries(personalInfo || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}

Career Guidance Responses:
${Object.entries(guidanceAnswers || {}).map(([key, value]) => `Question ${key}: ${value}`).join('\n')}

Career Clarification Responses:
${Object.entries(clarificationAnswers || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}

First, provide a single, clear career goal statement that:
1. Specifies a concrete target position or achievement
2. Includes a general timeline (e.g., "within 3-5 years")
3. Mentions key skills or qualifications to be developed
4. Is specific and measurable
5. Is realistic but ambitious

Format the goal as: "Career Goal: [Your goal statement here]"

Then, provide a detailed action plan with:
1. 5-7 specific, actionable steps to achieve this goal
2. Each step should be clear and achievable
3. Include a timeline for each step (in months)
4. Format each step as: "Step X: [Action step] (X months)"
5. Make steps progressive, building upon each other
6. Include both short-term (1-3 months) and longer-term (6+ months) steps
7. Focus on practical, measurable outcomes

Format the response with the career goal first, followed by two line breaks, then the action steps.`;

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
                content: 'You are a career development expert who creates clear, actionable career goals and plans. Your advice is specific, measurable, and time-bound.'
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
