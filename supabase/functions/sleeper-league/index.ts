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
    console.log('Sleeper League function called');
    
    const { leagueId } = await req.json();
    console.log('League ID received:', leagueId);
    
    if (!leagueId) {
      console.error('No league ID provided');
      return new Response(
        JSON.stringify({ error: 'League ID is required' }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    console.log(`Fetching league data for: ${leagueId}`);

    // Fetch league data from Sleeper API
    const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}`);
    console.log('Sleeper API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sleeper API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Liga não encontrada: ${leagueId}` }),
        { 
          status: 404, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    const leagueData = await response.json();
    console.log('League data received:', leagueData?.name || 'No name');

    return new Response(
      JSON.stringify(leagueData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in sleeper-league function:', error);
    
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