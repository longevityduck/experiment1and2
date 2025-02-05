
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
    const { careerGoal } = await req.json();

    const prompt = `As a career development expert, analyze if the following text could be considered a career goal. A valid career goal should be:
1. Related to work, career, or professional aspirations in any way
2. Express some kind of desire or intention
3. Not be completely unrelated to career or work (like "I want to eat pizza")

Be very lenient in your analysis. If the text expresses any kind of work-related aspiration, even if vague or general, consider it valid.

Career Goal: "${careerGoal}"

Return a JSON object (no markdown) with:
- valid: boolean indicating if this could be considered a career goal
- reason: If not valid, provide a gentle explanation why. If valid, leave empty string
`;

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
            content: 'You are a supportive career development expert analyzing career goals. Return only raw JSON without any markdown formatting or explanation text. Be very lenient and accepting of different types of career goals.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data.choices[0].message.content);
    
    try {
      const analysis = JSON.parse(data.choices[0].message.content);
      return new Response(
        JSON.stringify(analysis),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', data.choices[0].message.content);
      throw new Error('Failed to parse OpenAI response as JSON');
    }
  } catch (error) {
    console.error('Error in validate-career-goal function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

