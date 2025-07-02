
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

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
    const { profile, repositories } = await req.json();

    // Create a comprehensive prompt for Gemini
    const prompt = `Analyze this GitHub developer profile and provide comprehensive insights:

Profile Information:
- Username: ${profile.login}
- Name: ${profile.name || 'Not provided'}
- Bio: ${profile.bio || 'Not provided'}
- Location: ${profile.location || 'Not provided'}
- Company: ${profile.company || 'Not provided'}
- Public Repositories: ${profile.public_repos}
- Followers: ${profile.followers}
- Following: ${profile.following}
- Account created: ${profile.created_at}

Recent Repositories:
${repositories.map((repo: any) => `
- ${repo.name}: ${repo.description || 'No description'}
  Language: ${repo.language || 'Unknown'}
  Stars: ${repo.stargazers_count}
  Forks: ${repo.forks_count}
  Last updated: ${repo.updated_at}
`).join('')}

Please provide a detailed analysis covering:
1. **Technical Skills Assessment**: Based on the repositories and languages used
2. **Development Patterns**: Activity level, consistency, and collaboration
3. **Project Quality**: Repository descriptions, documentation, and community engagement
4. **Strengths**: Key technical and professional strengths
5. **Areas for Growth**: Potential areas for improvement
6. **Career Level Assessment**: Junior, Mid-level, Senior, or Lead level
7. **Recommended Roles**: What positions would be a good fit

Format the response in a clear, professional manner suitable for HR professionals and technical recruiters.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Analysis could not be generated.';

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-github function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
