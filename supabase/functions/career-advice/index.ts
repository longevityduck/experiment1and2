import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, personalInfo, guidanceAnswers, clarificationAnswers } = await req.json();
    console.log('Received request:', { type, personalInfo, guidanceAnswers, clarificationAnswers });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let prompt = '';
    let systemRole = '';

    if (type === 'career-goal') {
      systemRole = `You are a career advisor specializing in helping people define clear, actionable career goals. 
      Based on the information provided, generate a specific, measurable, achievable, relevant, and time-bound (SMART) career goal.
      Keep the response concise (2-3 sentences) but impactful.`;

      prompt = `Create a personalized career goal based on this information:

      Personal Information:
      ${Object.entries(personalInfo || {}).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

      Career Guidance Responses:
      ${Object.entries(guidanceAnswers || {}).map(([key, value]) => `- Question ${key}: ${value}`).join('\n')}

      Career Clarification Responses:
      ${Object.entries(clarificationAnswers || {}).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

      Generate a SMART career goal that takes into account their background, aspirations, and current situation.`;
    } else {
      throw new Error('Invalid request type');
    }

    console.log('Sending prompt to OpenAI:', prompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemRole },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate career advice');
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    return new Response(JSON.stringify({ 
      advice: data.choices[0].message.content 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in career-advice function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});