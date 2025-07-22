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
    const currentYear = 2023; // O ano que queremos para pontuações

    /** ============================
     * 1. Buscar dados de jogadores
     * ============================ */
    console.log("🔄 Buscando jogadores...");
    const playersResponse = await fetch("https://api.sleeper.app/v1/players/nfl");
    if (!playersResponse.ok) {
      throw new Error(`Erro ao buscar jogadores: ${playersResponse.status}`);
    }
    const players = await playersResponse.json();

    /** ============================
     * 2. Buscar dados de times (rosters)
     * ============================ */
    console.log("🔄 Buscando times...");
    const rostersResponse = await fetch("Seu endpoint aqui para rosters"); // Insira a URL de rosters correta
    if (!rostersResponse.ok) {
      throw new Error(`Erro ao buscar times: ${rostersResponse.status}`);
    }
    const rosters = await rostersResponse.json();

    /** ============================
     * 3. Buscar pontuações de jogadores
     * ============================ */
    console.log("🔄 Buscando pontuações...");
    const scoresResponse = await fetch(
      `https://api.sleeper.app/v1/stats/nfl/regular/${currentYear}`
    );
    if (!scoresResponse.ok) {
      throw new Error(`Erro ao buscar pontuações: ${scoresResponse.status}`);
    }
    const scores = await scoresResponse.json();

    /** ============================
     * 4. Combinar dados
     * ============================ */
    const playersWithScores = Object.keys(players).reduce((acc, playerId) => {
      const player = players[playerId];
      const playerScores = scores[playerId] || {};

      acc[playerId] = {
        player_id: playerId,
        first_name: player.first_name,
        last_name: player.last_name,
        position: player.position || "N/A",
        team: player.team || "N/A",
        scores: {
          [currentYear]: playerScores.pts_half_ppr || 0, // Usa o campo HALF-PPR
        },
      };

      return acc;
    }, {});

    console.log("✅ Dados combinados com sucesso!");

    /** ============================
     * 5. Retornar os dados
     * ============================ */
    return new Response(
      JSON.stringify({
        rosters,
        players: playersWithScores,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("❌ Erro na função sleeper-players:", error.message);

    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});