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
    const { industry, occupation, experience } = await req.json();

    console.log('Generating skills for:', { industry, occupation, experience });

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
            content: 'You are a career advisor that generates relevant professional skills based on industry, occupation, and years of experience. Return only an array of skills, no other text.'
          },
          {
            role: 'user',
            content: `Generate a list of 8-10 relevant professional skills for someone with ${experience} years of experience as a ${occupation} in the ${industry} industry. Focus on both technical and soft skills that would be valuable in this role.`
          }
        ],
      }),
    });

    const data = await response.json();
    console.log('OpenAI response:', data);

    // Parse the response to get an array of skills
    const skillsText = data.choices[0].message.content;
    const skills = skillsText
      .split('\n')
      .map(skill => skill.replace(/^\d+\.\s*/, '').trim())
      .filter(skill => skill.length > 0);

    return new Response(JSON.stringify({ skills }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-skills function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});