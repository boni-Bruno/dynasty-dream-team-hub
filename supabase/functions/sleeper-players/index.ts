
/*
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
*/

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
    const playersResponse = await fetch('https://api.sleeper.app/v1/players/nfl');
    if (!playersResponse.ok) {
      const errorText = await playersResponse.text();
      console.error('Sleeper API error:', playersResponse.status, errorText);
      throw new Error(`Sleeper API error: ${playersResponse.status}`);
    }

    const players = await playersResponse.json();
    console.log('Players data received, total count:', Object.keys(players || {}).length);

    // Fetch player scores for 2023 (example: change year as needed)
    console.log('Fetching NFL player scores from Sleeper API');
    const scoresResponse = await fetch('https://api.sleeper.app/v1/stats/nfl/regular/2023');
    if (!scoresResponse.ok) {
      const errorText = await scoresResponse.text();
      console.error('Scores API error:', scoresResponse.status, errorText);
      throw new Error(`Scores API error: ${scoresResponse.status}`);
    }

    const scores = await scoresResponse.json();
    console.log('Scores data received, total count:', Object.keys(scores || {}).length);

    // Combine player data with scores
    console.log('Combining player data with scores...');
    const playersWithScores = Object.keys(players).reduce((acc, playerId) => {
      const player = players[playerId];
      const playerScores = scores[playerId] || {}; // Fetch scores for specific player
      acc[playerId] = {
        ...player,
        scores: {
          "2023": playerScores.pts_ppr || 0, // Use PPR (Points Per Reception) scoring
        },
      };
      return acc;
    }, {});

    return new Response(
      JSON.stringify(playersWithScores),
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