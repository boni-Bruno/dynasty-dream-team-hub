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
    const { leagueId, week } = await req.json();
    
    if (!leagueId) {
      throw new Error('League ID is required');
    }

    const round = week || 1;
    console.log(`Fetching transactions for league: ${leagueId}, week: ${round}`);

    // Fetch transactions from Sleeper API
    const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/transactions/${round}`);
    
    if (!response.ok) {
      throw new Error(`Sleeper API error: ${response.status}`);
    }

    const transactions = await response.json();

    return new Response(
      JSON.stringify(transactions),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in sleeper-transactions function:', error);
    
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