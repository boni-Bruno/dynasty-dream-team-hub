import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🏈 Sleeper Players function called");

    /** ============================
     * 1. Fetch Players Data
     * ============================ */
    console.log("🔄 Fetching NFL players data...");
    const playersResponse = await fetch("https://api.sleeper.app/v1/players/nfl");
    if (!playersResponse.ok) {
      console.error("❌ Error fetching players:", playersResponse.status);
      throw new Error(`Error fetching players: ${playersResponse.status}`);
    }
    const players = await playersResponse.json();
    console.log(`✅ Players fetched: ${Object.keys(players).length}`);

    /** ============================
     * 2. Fetch Scores Data (2023)
     * ============================ */
    console.log("🔄 Fetching scores for 2023...");
    const scoresResponse = await fetch("https://api.sleeper.app/v1/stats/nfl/regular/2023");
    if (!scoresResponse.ok) {
      console.error("❌ Error fetching scores:", scoresResponse.status);
      throw new Error(`Error fetching scores: ${scoresResponse.status}`);
    }
    const scores = await scoresResponse.json(); // Obtenção de todas as pontuações
    console.log(`✅ Scores fetched for 2023: ${Object.keys(scores || {}).length}`);

    /** ============================
     * 3. Combine Players and Scores
     * ============================ */
    console.log("🔗 Combining players with scores...");
    const playersWithScores = Object.keys(players).reduce((acc, playerId) => {
      const player = players[playerId]; // Dados básicos do jogador
      const playerScores = scores[playerId] || {}; // Dados de pontuação do jogador para 2023

      // Adicione a pontuação HALF-PPR (ou calcula manualmente se necessário)
      const halfPPR = playerScores.pts_half_ppr || 0;

      acc[playerId] = {
        ...player,
        scores: {
          "2023": halfPPR, // Retorna apenas 2023; ajuste para mais anos, se necessário
        },
      };

      return acc;
    }, {});

    console.log("✅ Players combined with scores successfully!");

    /** ============================
     * 4. Return Response
     * ============================ */
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
    console.error("❌ Error in Sleeper Players function:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
      }),
      {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
      }
    );
  }
});