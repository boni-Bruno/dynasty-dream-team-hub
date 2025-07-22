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

    /** =========================
     * 1. Fetch NFL Players Data
     * ========================= */
    const playersResponse = await fetch("https://api.sleeper.app/v1/players/nfl");
    if (!playersResponse.ok) {
      console.error("Error fetching players:", playersResponse.status);
      throw new Error(`Error fetching players: ${playersResponse.status}`);
    }
    const players = await playersResponse.json();
    console.log(`Players data fetched: ${Object.keys(players).length} players`);

    /** =========================
     * 2. Fetch Scores for 2023
     * (outras temporadas podem ser adicionadas depois)
     * ========================= */
    const scoresResponse = await fetch("https://api.sleeper.app/v1/stats/nfl/regular/2023");
    if (!scoresResponse.ok) {
      console.error("Error fetching scores:", scoresResponse.status);
      throw new Error(`Error fetching scores: ${scoresResponse.status}`);
    }
    const scores = await scoresResponse.json();
    console.log(`Scores data fetched for 2023: ${Object.keys(scores || {}).length} players`);

    /** =========================
     * 3. Combine Players & Scores
     * ========================= */
    const playersWithScores = Object.keys(players).reduce((acc, playerId) => {
      const player = players[playerId];
      const playerScores = scores[playerId] || {}; // Pontuação do jogador (se houver)

      acc[playerId] = {
        ...player, // Dados básicos do jogador
        scores: {
          "2023": playerScores.pts_ppr || 0, // Apenas pontuação PPR para 2023, ajustável
        },
      };
      return acc;
    }, {});

    console.log("Players with scores combined successfully");

    /** =========================
     * 4. Return Data
     * ========================= */
    return new Response(
      JSON.stringify(playersWithScores), // Retorna os jogadores combinados com as pontuações
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