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
    // Lendo o corpo da requisição
    const { leagueId } = await req.json();

    if (!leagueId) {
      throw new Error('League ID is required'); // Garante que o League ID seja enviado
    }

    console.log(`[INFO] Fetching rosters for league: ${leagueId}`);

    // Trabalhando com Sleeper API
    const sleeperEndpoint = `https://api.sleeper.app/v1/league/${leagueId}/rosters`;
    console.log(`[DEBUG] Hitting Sleeper API at: ${sleeperEndpoint}`);

    const response = await fetch(sleeperEndpoint);

    if (!response.ok) {
      throw new Error(`[ERROR] Sleeper API returned with status ${response.status}: ${response.statusText}`);
    }

    const rosters = await response.json();

    console.log(`[INFO] Successfully fetched rosters:`);
    console.dir(rosters); // Exibe os dados no console para debug

    // Retorno dos dados com suporte a CORS
    return new Response(
      JSON.stringify(rosters), // Converte os rosters para JSON e os retorna
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error(`[ERROR] Error in sleeper-rosters function: ${error.message || error.toString()}`);

    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' // Retorna mensagem de erro para o frontend
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
//tst