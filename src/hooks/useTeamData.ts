/*
import { useEffect, useState } from "react";
import { useSleeperData } from "@/hooks/useSleeperData";
import { SleeperPlayer, SleeperRoster, SleeperUser } from "@/types/sleeper";

export function useTeamData() {
  const { state, fetchRosters, fetchPlayers, fetchUsers } = useSleeperData();
  const [userRoster, setUserRoster] = useState<SleeperRoster | null>(null);
  const [playersData, setPlayersData] = useState<Record<string, SleeperPlayer>>({});
  const [loading, setLoading] = useState(true);
  const [teamOwner, setTeamOwner] = useState<SleeperUser | null>(null);

  useEffect(() => {
    const loadTeamData = async () => {
      if (!state.isConnected || !state.currentLeague) return;

      try {
        setLoading(true);
        
        // Buscar rosters, jogadores e usuários
        const [rostersData, playersResponse, usersData] = await Promise.all([
          fetchRosters(state.currentLeague.league_id),
          fetchPlayers(),
          fetchUsers(state.currentLeague.league_id)
        ]);

        if (rostersData && rostersData.length > 0 && usersData) {
          // Encontrar o usuário com team_name "Shadows"
          const shadowsOwner = usersData.find((user: SleeperUser) => 
            user.metadata?.team_name === "Shadows" || 
            user.display_name === "Shadows" ||
            user.username === "Shadows"
          );
          
          if (shadowsOwner) {
            // Encontrar o roster deste usuário
            const shadowsRoster = rostersData.find((roster: SleeperRoster) => 
              roster.owner_id === shadowsOwner.user_id
            );
            
            if (shadowsRoster) {
              setUserRoster(shadowsRoster);
              setTeamOwner(shadowsOwner);
            }
          }
        }

        if (playersResponse) {
          setPlayersData(playersResponse);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do time:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, [state.isConnected, state.currentLeague, fetchRosters, fetchPlayers, fetchUsers]);

  return {
    userRoster,
    playersData,
    loading,
    teamOwner,
    isConnected: state.isConnected
  };
}
*/

import { useEffect, useState } from "react";
import { useSleeperData } from "@/hooks/useSleeperData";
import { SleeperPlayer, SleeperRoster, SleeperUser } from "@/types/sleeper";

export function useTeamData() {
  const { state, fetchRosters, fetchPlayers, fetchUsers } = useSleeperData();
  const [userRoster, setUserRoster] = useState<SleeperRoster | null>(null);
  const [allPlayerIds, setAllPlayerIds] = useState<string[]>([]); // Novo estado para conter todos os player IDs
  const [playersData, setPlayersData] = useState<Record<string, SleeperPlayer>>({});
  const [loading, setLoading] = useState(true);
  const [teamOwner, setTeamOwner] = useState<SleeperUser | null>(null);

  useEffect(() => {
    const loadTeamData = async () => {
      if (!state.isConnected || !state.currentLeague) return;

      try {
        setLoading(true);
        
        // Buscar rosters, jogadores e usuários
        const [rostersData, playersResponse, usersData] = await Promise.all([
          fetchRosters(state.currentLeague.league_id),
          fetchPlayers(),
          fetchUsers(state.currentLeague.league_id)
        ]);

        if (rostersData && rostersData.length > 0 && usersData) {
          console.log("Rosters encontrados:", rostersData);
          console.log("Usuários encontrados:", usersData);

          // Encontrar o usuário com team_name "Shadows"
          const shadowsOwner = usersData.find((user: SleeperUser) => 
            user.metadata?.team_name === "Shadows" || 
            user.display_name === "Shadows" ||
            user.username === "Shadows"
          );

          console.log("Usuário Shadows encontrado:", shadowsOwner);

          if (shadowsOwner) {
            // Encontrar o roster deste usuário
            const shadowsRoster = rostersData.find((roster: SleeperRoster) => 
              roster.owner_id === shadowsOwner.user_id
            );

            console.log("Roster associado ao Shadows:", shadowsRoster);

            if (shadowsRoster) {
              setUserRoster(shadowsRoster);

              // Combinar todos os jogadores
              const allIds = [
                ...(shadowsRoster.starters || []),
                ...(shadowsRoster.reserve || []),
                ...(shadowsRoster.taxi || []),
              ];
              console.log("Todos os IDs combinados dos jogadores:", allIds);
              setAllPlayerIds(allIds);
              setTeamOwner(shadowsOwner);
            }
          }
        }

        if (playersResponse) {
          console.log("Dados de todos os jogadores retornados:", playersResponse);
          setPlayersData(playersResponse);
        }

        if (playersResponse) {
          setPlayersData(playersResponse);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do time:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, [state.isConnected, state.currentLeague, fetchRosters, fetchPlayers, fetchUsers]);

  return {
    userRoster,
    allPlayerIds, // IDs combinados de todos os jogadores
    playersData,
    loading,
    teamOwner,
    isConnected: state.isConnected,
  };
}