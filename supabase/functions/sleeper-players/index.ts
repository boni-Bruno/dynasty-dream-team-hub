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
    const currentYear = 2023; // Você pode ajustar o ano aqui

    /** ============================
     * 1. Buscar dados de jogadores
     * ============================ */
    console.log("🔄 Fetching players data...");
    const playersResponse = await fetch("https://api.sleeper.app/v1/players/nfl");
    if (!playersResponse.ok) {
      throw new Error(`Erro ao buscar dados dos jogadores: ${playersResponse.status}`);
    }
    const players = await playersResponse.json();

    /** ============================
     * 2. Buscar pontuações (Half-PPR)
     * ============================ */
    console.log("🔄 Fetching player scores...");
    const scoresResponse = await fetch(
      `https://api.sleeper.app/v1/stats/nfl/regular/${currentYear}`
    );
    if (!scoresResponse.ok) {
      throw new Error(`Erro ao buscar pontuações: ${scoresResponse.status}`);
    }
    const scores = await scoresResponse.json();

    /** ============================
     * 3. Combinar jogadores e pontuações
     * ============================ */
    console.log("🔄 Combining players with scores...");
    const playersWithScores = Object.keys(players).reduce((acc, playerId) => {
      const player = players[playerId];
      const playerScores = scores[playerId] || {};

      acc[playerId] = {
        player_id: player.player_id,
        full_name: `${player.first_name} ${player.last_name}`,
        position: player.position || "N/A",
        team: player.team || "N/A",
        scores: {
          [currentYear]: playerScores.pts_half_ppr || 0, // HALF-PPR
        },
      };

      return acc;
    }, {});

    console.log("✅ Players successfully combined with scores!");

    /** ============================
     * 4. Retornar os dados
     * ============================ */
    return new Response(JSON.stringify(playersWithScores), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("❌ Error in function:", error.message);

    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }
});