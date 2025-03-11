
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
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    const requestData = await req.json();
    console.log('Received request:', requestData);

    if (!requestData.type) {
      throw new Error('Request type is required');
    }

    if (requestData.type === 'career-goal') {
      const { personalInfo, guidanceAnswers, clarificationAnswers, careerGoals } = requestData;
      
      // Validate essential inputs
      if (!personalInfo || !personalInfo.occupation || !personalInfo.industry) {
        throw new Error('Personal information is incomplete');
      }
      
      const prompt = `Based on the following detailed information, create a highly personalized career development plan following SMART goal principles that is specific to this individual's unique situation:

Personal Information:
${Object.entries(personalInfo || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}

Career Guidance Responses (numbered questions that explored career aspirations):
${Object.entries(guidanceAnswers || {}).map(([key, value]) => `Question ${key}: ${value}`).join('\n')}

Career Clarification Responses (additional context on career preferences):
${Object.entries(clarificationAnswers || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}

Career Goals:
${careerGoals}

First, provide a single refined career goal statement that follows SMART principles (specific, measurable, achievable, relevant, and time-bound).
Format: "Career Goal: [Your refined goal statement here]"

Then, provide 5-7 highly tailored actionable steps specifically crafted for this individual. For each step:
1. Make the action step extremely specific with concrete activities tied directly to their industry (${personalInfo?.industry || "their industry"}), role (${personalInfo?.occupation || "their current role"}), and experience level (${personalInfo?.experience || "their experience level"})
2. Include measurable success criteria with actual metrics or deliverables that can be tracked
3. Reference industry-specific skills, tools, certifications, or networking opportunities relevant to their field
4. Ensure each step builds logically from their current position toward their stated career goal
5. Include a realistic timeframe in months or weeks based on the complexity of the task and their current situation
6. Provide an explanation that connects directly to information they've provided

Format each step exactly as follows:
Step: [Specific, measurable action with concrete metrics]
Timeframe: [X] months
Explanation: [2-3 sentences explaining why this specific step is important for THEIR situation, referencing their background and goals]

Ensure each step:
- Is highly specific to their industry, experience level, and career goals
- Includes clear, measurable success criteria
- Has varying and realistic timeframes
- Builds logically toward their ultimate goal
- Contains explanations that directly reference their personal situation
- Avoids generic advice that could apply to anyone
- Directly addresses any challenges or opportunities mentioned in their responses`;

      console.log('Sending prompt to OpenAI:', prompt);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
        
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
                content: 'You are a highly specialized career development expert who creates personalized, actionable career plans. Your advice must be extremely specific to the individual, their industry, and their career stage. Never provide generic steps - each recommendation should clearly reference the person\'s specific situation, industry terminology, and career context. Ensure all steps are measurable with concrete metrics, directly relevant to their stated goals, and include realistic timeframes.'
              },
              { role: 'user', content: prompt }
            ],
            temperature: 0.3, // Lower temperature for more precise, focused output
            max_tokens: 2000, // Increased max tokens for more comprehensive steps
          }),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

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
      } catch (openAIError) {
        console.error('Error calling OpenAI:', openAIError);
        throw new Error(`OpenAI error: ${openAIError.message}`);
      }
    }

    if (requestData.type === 'industry-suggestions') {
      const { occupation } = requestData;
      
      if (!occupation) {
        throw new Error('Occupation is required for industry suggestions');
      }

      const prompt = `Given the occupation "${occupation}", suggest 5 relevant industries where this occupation is commonly found. Format each suggestion on a new line with a number prefix (e.g., "1. Technology").`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
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
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        return new Response(
          JSON.stringify({ advice: data.choices[0].message.content }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (openAIError) {
        console.error('Error calling OpenAI:', openAIError);
        throw new Error(`OpenAI error: ${openAIError.message}`);
      }
    }

    if (requestData.type === 'career-advice') {
      const prompt = `Based on the following information about a professional:
      
${Object.entries(requestData).filter(([key]) => key !== 'type').map(([key, value]) => `${key}: ${value}`).join('\n')}

Provide brief career advice focusing on potential growth opportunities and skill development areas.`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
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
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        return new Response(
          JSON.stringify({ advice: data.choices[0].message.content }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (openAIError) {
        console.error('Error calling OpenAI:', openAIError);
        throw new Error(`OpenAI error: ${openAIError.message}`);
      }
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
