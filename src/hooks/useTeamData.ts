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
  const [allPlayerIds, setAllPlayerIds] = useState<string[]>([]); // IDs combinados de todos os jogadores
  const [playersData, setPlayersData] = useState<Record<string, SleeperPlayer>>({});
  const [loading, setLoading] = useState(true);
  const [teamOwner, setTeamOwner] = useState<SleeperUser | null>(null);

  useEffect(() => {
    const loadTeamData = async () => {
      if (!state.isConnected || !state.currentLeague) {
        console.warn("Estado desconectado ou nenhuma liga selecionada.");
        return;
      }

      try {
        setLoading(true);

        // Buscar dados da API: rosters, jogadores e usuários
        const [rostersData, playersResponse, usersData] = await Promise.all([
          fetchRosters(state.currentLeague.league_id),
          fetchPlayers(),
          fetchUsers(state.currentLeague.league_id),
        ]);

        // Logs iniciais para depuração
        console.log("Rosters encontrados:", rostersData);
        console.log("Usuários encontrados:", usersData);

        if (rostersData && rostersData.length > 0 && usersData) {
          // Encontrar o proprietário do time (usuário com TeamName "Shadows")
          const shadowsOwner = usersData.find((user: SleeperUser) =>
            user.metadata?.team_name === "Shadows" ||
            user.display_name === "Shadows" ||
            user.username === "Shadows"
          );

          if (!shadowsOwner) {
            console.warn("Usuário 'Shadows' não encontrado nos usuários retornados.");
          } else {
            console.log("Usuário 'Shadows' encontrado:", shadowsOwner);

            // Encontrar o roster associado ao dono do time
            const shadowsRoster = rostersData.find(
              (roster: SleeperRoster) => roster.owner_id === shadowsOwner.user_id
            );

            if (!shadowsRoster) {
              console.warn("Roster do usuário 'Shadows' não foi encontrado nos rosters retornados.");
            } else {
              console.log("Roster associado ao Shadows:", shadowsRoster);

              // Atualizar o estado com o roster encontrado
              setUserRoster(shadowsRoster);

              // Combinar IDs de todos os jogadores do roster
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

        // Armazenar os dados de jogadores retornados pela API
        if (playersResponse) {
          console.log("Jogadores carregados (playersResponse):", playersResponse);
          setPlayersData(playersResponse);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do time:", error);
      } finally {
        setLoading(false); // Sempre desabilitar o carregamento após a execução
      }
    };

    loadTeamData();
  }, [state.isConnected, state.currentLeague, fetchRosters, fetchPlayers, fetchUsers]);

  // Retornar os dados necessários para o componente
  return {
    userRoster, // Dados do roster do usuário
    allPlayerIds, // IDs combinados de todos os jogadores do roster
    playersData, // Detalhes de todos os jogadores
    loading, // Estado de carregamento dos dados
    teamOwner, // Informações do dono do time
    isConnected: state.isConnected, // Estado de conexão
  };
}