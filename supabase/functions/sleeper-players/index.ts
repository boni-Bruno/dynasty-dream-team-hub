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

    /** =========================
     * 1. Fetch NFL Players Data
     * ========================= */
    console.log("🔄 Fetching NFL players data...");
    const playersResponse = await fetch("https://api.sleeper.app/v1/players/nfl");
    if (!playersResponse.ok) {
      console.error("❌ Error fetching players:", playersResponse.status);
      throw new Error(`Error fetching players: ${playersResponse.status}`);
    }
    const players = await playersResponse.json();
    console.log(`✅ Players data fetched. Total players: ${Object.keys(players).length}`);

    /** =========================
     * 2. Fetch Scores for 2023
     * ========================= */
    console.log("🔄 Fetching NFL scores for 2023...");
    const scoresResponse = await fetch("https://api.sleeper.app/v1/stats/nfl/regular/2023");
    if (!scoresResponse.ok) {
      console.error("❌ Error fetching scores:", scoresResponse.status);
      throw new Error(`Error fetching scores: ${scoresResponse.status}`);
    }
    const scores = await scoresResponse.json();
    console.log(`✅ Scores data fetched. Total scores: ${Object.keys(scores || {}).length}`);

    /** =========================
     * 3. Combine Players and Scores
     * ========================= */
    // Função para calcular HALF-PPR manualmente
    const calculateHalfPPR = (playerYearScores: Record<string, any>) => {
      const receptions = playerYearScores.receptions || 0; // Números de recepções
      const stdPoints = playerYearScores.pts_std || 0; // Pontuação Standard
      return stdPoints + receptions * 0.5; // Fórmula do HALF-PPR
    };

    console.log("🔄 Combining players with scores...");
    const playersWithScores = Object.keys(players).reduce((acc, playerId) => {
      const player = players[playerId];
      const playerScores = scores[playerId] || {}; // Busca pontuação do jogador

      const scores = {
        "2023": playerScores.pts_half_ppr || calculateHalfPPR(playerScores),
      };

      acc[playerId] = {
        ...player, // Dados básicos do jogador
        scores, // Pontuações (HALF-PPR)
      };

      return acc;
    }, {});

    console.log("✅ Players combined with scores successfully");

    /** =========================
     * 4. Send Response
     * ========================= */
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
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});