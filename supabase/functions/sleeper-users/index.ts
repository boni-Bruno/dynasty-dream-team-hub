import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { leagueId } = await req.json();
    
    if (!leagueId) {
      throw new Error('League ID is required');
    }

    console.log(`Fetching users for league: ${leagueId}`);

    // Fetch users from Sleeper API
    const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`);
    
    if (!response.ok) {
      throw new Error(`Sleeper API error: ${response.status}`);
    }

    const users = await response.json();

    return new Response(
      JSON.stringify(users),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in sleeper-users function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});