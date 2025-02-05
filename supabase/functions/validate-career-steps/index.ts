
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
    const { steps, careerGoal } = await req.json();
    const userAddedSteps = steps.filter((step: any) => !step.isOriginal);

    if (userAddedSteps.length === 0) {
      return new Response(
        JSON.stringify({ valid: true, issues: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `As a career development expert, analyze if the following user-added career steps align with their career goal. For each step, determine if it's relevant and beneficial for achieving the goal. Only flag steps that seem irrelevant or potentially counterproductive.

Career Goal: ${careerGoal}

User Added Steps:
${userAddedSteps.map((step: any, index: number) => 
  `Step ${index + 1}: ${step.content} (Timeframe: ${step.timeframe})`
).join('\n')}

For each step that might not align well with the career goal, explain why. Format the response as a JSON array where each object has:
- stepContent: The content of the problematic step
- reason: A brief, constructive explanation of why it might not align well with the career goal

Only include steps that have issues. If all steps align well, return an empty array.`;

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
            content: 'You are a career development expert analyzing career steps. Be constructive and specific in your feedback, identifying only genuinely misaligned steps.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    return new Response(
      JSON.stringify({
        valid: analysis.length === 0,
        issues: analysis
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in validate-career-steps function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
