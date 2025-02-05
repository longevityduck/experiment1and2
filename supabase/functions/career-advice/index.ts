import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 200
    });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const requestData = await req.json();
    console.log('Received request:', requestData);

    // Handle industry suggestions
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

    // Handle career goal generation
    if (requestData.type === 'career-goal') {
      const { personalInfo, guidanceAnswers, clarificationAnswers } = requestData;
      console.log('Processing career goal request with:', { personalInfo, guidanceAnswers, clarificationAnswers });
      
      const prompt = `As a career advisor, generate a specific, measurable, achievable, relevant, and time-bound (SMART) career goal based on the following information:

Personal Information:
${Object.entries(personalInfo || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}

Career Guidance Responses:
${Object.entries(guidanceAnswers || {}).map(([key, value]) => `Question ${key}: ${value}`).join('\n')}

Career Clarification Responses:
${Object.entries(clarificationAnswers || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}

Generate a concise (2-3 sentences) SMART career goal that takes into account their background, skills, interests, and aspirations. The goal should be specific and actionable.`;

      console.log('Sending prompt to OpenAI:', prompt);

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
              { role: 'system', content: 'You are a career advisor specializing in helping people define clear, actionable career goals.' },
              { role: 'user', content: prompt }
            ],
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('OpenAI API error:', error);
          
          // Check specifically for quota exceeded error
          if (error.error?.message?.includes('exceeded your current quota')) {
            return new Response(
              JSON.stringify({ 
                error: 'OpenAI API quota exceeded',
                message: 'AI service temporarily unavailable',
                type: 'QUOTA_EXCEEDED'
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
              }
            );
          }
          
          throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        console.log('OpenAI response for career goal:', data);
        
        return new Response(
          JSON.stringify({ advice: data.choices[0].message.content }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      } catch (error) {
        console.error('Error generating career goal:', error);
        return new Response(
          JSON.stringify({ 
            error: error.message || 'Failed to generate career goal',
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