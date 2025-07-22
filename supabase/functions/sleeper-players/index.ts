import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Sleeper Players function called");
    console.log("Fetching NFL players data from Sleeper API");

    /** ---------------------------
     * Fetch players from Sleeper API
     * -------------------------- */
    const playersResponse = await fetch("https://api.sleeper.app/v1/players/nfl");
    if (!playersResponse.ok) {
      const errorText = await playersResponse.text();
      console.error("Sleeper API error:", playersResponse.status, errorText);
      throw new Error(`Sleeper API error: ${playersResponse.status}`);
    }
    const players = await playersResponse.json();
    console.log("Players data received, total count:", Object.keys(players || {}).length);

    /** ---------------------------
     * Fetch scores for multiple years
     * -------------------------- */
    const YEARS = [2020, 2021, 2022, 2023, 2024, 2025]; // Anos definidos
    const allScores = {}; // Armazenar pontuações de todos os anos

    for (const year of YEARS) {
      console.log(`Fetching scores for year ${year}`);
      const scoresResponse = await fetch(`https://api.sleeper.app/v1/stats/nfl/regular/${year}`);
      if (!scoresResponse.ok) {
        const errorText = await scoresResponse.text();
        console.error(`Scores API error for year ${year}:`, scoresResponse.status, errorText);
        throw new Error(`Scores API error for year ${year}: ${scoresResponse.status}`);
      }

      const yearScores = await scoresResponse.json();
      console.log(`Scores for year ${year} received, count: ${Object.keys(yearScores || {}).length}`);

      // Salva pontuações do ano específico no objeto
      allScores[year] = yearScores;
    }

    /** ---------------------------
     * Combine players with scores
     * -------------------------- */
    console.log("Combining player data with scores...");
    const playersWithScores = Object.keys(players).reduce((acc, playerId) => {
      const player = players[playerId];
      const scores = {};

      // Adicionar pontuações para todos os anos no campo "scores"
      YEARS.forEach((year) => {
        const yearScores = allScores[year] || {};
        const playerYearScores = yearScores[playerId] || {}; // Pega pontuação do jogador no ano

        scores[year] = playerYearScores.pts_ppr || 0; // Usar apenas PPR (ou ajustar caso necessário)
      });

      acc[playerId] = {
        ...player, // Junta informações do jogador
        scores, // Junta pontuações completas
      };

      return acc;
    }, {});

    /** ---------------------------
     * Return combined data
     * -------------------------- */
    return new Response(
      JSON.stringify(playersWithScores),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in sleeper-players function:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});