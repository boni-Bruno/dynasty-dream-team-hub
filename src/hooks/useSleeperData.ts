import { useState, useCallback, useEffect } from "react";
import { AppState, SleeperLeague, SleeperRoster, SleeperPlayer } from "@/types/sleeper";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const FIXED_LEAGUE_ID = '1181975218791636992';

export function useSleeperData() {
  const [state, setState] = useState<AppState>({
    isConnected: false,
  });
  const { toast } = useToast();

  const connectToFixedLeague = useCallback(async () => {
    const leagueId = FIXED_LEAGUE_ID;
    try {
      toast({
        title: "Conectando...",
        description: "Tentando conectar à liga do Sleeper",
      });

      console.log('Attempting to connect to league:', leagueId);

      // Call the league endpoint to validate the league ID
      const { data: leagueData, error } = await supabase.functions.invoke('sleeper-league', {
        body: { leagueId }
      });

      console.log('Supabase function response:', { data: leagueData, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || "Erro ao conectar com a API do Sleeper");
      }

      if (!leagueData) {
        throw new Error("Liga não encontrada");
      }

      if (leagueData.error) {
        throw new Error(leagueData.error);
      }

      // Update state with connected league
      const newState = {
        isConnected: true,
        currentLeague: leagueData,
        leagueId
      };
      setState(prev => ({
        ...prev,
        ...newState
      }));

      console.log('Connected to fixed league:', leagueData.name);
      
    } catch (error) {
      console.error('Connection error:', error);
    }
  }, [toast]);

  const connectToSleeper = useCallback(async (leagueId: string) => {
    return connectToFixedLeague();
  }, [connectToFixedLeague]);

  const fetchLeagueData = useCallback(async (leagueId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('sleeper-league', {
        body: { leagueId }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching league data:", error);
      throw error;
    }
  }, []);

  const fetchRosters = useCallback(async (leagueId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('sleeper-rosters', {
        body: { leagueId }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching rosters:", error);
      throw error;
    }
  }, []);

  const fetchPlayers = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('sleeper-players');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching players:", error);
      throw error;
    }
  }, []);

  const fetchDrafts = useCallback(async (leagueId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('sleeper-drafts', {
        body: { leagueId }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching drafts:", error);
      throw error;
    }
  }, []);

  const fetchTrades = useCallback(async (leagueId: string, week?: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('sleeper-transactions', {
        body: { leagueId, week }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching trades:", error);
      throw error;
    }
  }, []);

  const disconnectFromSleeper = useCallback(() => {
    // Not applicable for fixed league connection
  }, []);

  // Auto-connect to fixed league on mount
  useEffect(() => {
    connectToFixedLeague();
  }, [connectToFixedLeague]);

  return {
    state,
    connectToSleeper,
    disconnectFromSleeper,
    connectToFixedLeague,
    fetchLeagueData,
    fetchRosters,
    fetchPlayers,
    fetchDrafts,
    fetchTrades,
  };
}