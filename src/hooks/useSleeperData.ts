import { useState, useCallback } from "react";
import { AppState, SleeperLeague, SleeperRoster, SleeperPlayer } from "@/types/sleeper";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useSleeperData() {
  const [state, setState] = useState<AppState>({
    isConnected: false,
  });
  const { toast } = useToast();

  const connectToSleeper = useCallback(async (leagueId: string) => {
    try {
      toast({
        title: "Conectando...",
        description: "Tentando conectar à liga do Sleeper",
      });

      // Call the league endpoint to validate the league ID
      const { data: leagueData, error } = await supabase.functions.invoke('sleeper-league', {
        body: { leagueId }
      });

      if (error) {
        throw new Error(error.message || "Erro ao conectar com a API do Sleeper");
      }

      if (!leagueData) {
        throw new Error("Liga não encontrada");
      }

      // Update state with connected league
      setState(prev => ({
        ...prev,
        isConnected: true,
        currentLeague: leagueData,
        leagueId
      }));

      toast({
        title: "Conectado com Sucesso!",
        description: `Liga ${leagueData.name} conectada`,
      });
      
    } catch (error) {
      toast({
        title: "Erro na Conexão",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  }, [toast]);

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

  return {
    state,
    connectToSleeper,
    fetchLeagueData,
    fetchRosters,
    fetchPlayers,
    fetchDrafts,
    fetchTrades,
  };
}