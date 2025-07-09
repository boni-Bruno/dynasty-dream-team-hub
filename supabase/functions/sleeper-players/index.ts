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
    console.log('Sleeper Players function called');
    console.log('Fetching NFL players data from Sleeper API');

    // Fetch players from Sleeper API
    const response = await fetch('https://api.sleeper.app/v1/players/nfl');
    console.log('Sleeper API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sleeper API error:', response.status, errorText);
      throw new Error(`Sleeper API error: ${response.status}`);
    }

    const players = await response.json();
    console.log('Players data received, total count:', Object.keys(players || {}).length);

    return new Response(
      JSON.stringify(players),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in sleeper-players function:', error);
    
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