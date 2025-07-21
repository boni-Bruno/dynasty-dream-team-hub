import { useEffect, useState } from "react";
import { useSleeperData } from "@/hooks/useSleeperData";
import { SleeperPlayer, SleeperRoster, SleeperUser } from "@/types/sleeper";

export function useTeamData() {
  const { state, fetchRosters, fetchPlayers, fetchUsers } = useSleeperData();
  const [userRoster, setUserRoster] = useState<SleeperRoster | null>(null);
  const [allPlayerIds, setAllPlayerIds] = useState<string[]>([]);
  const [playersData, setPlayersData] = useState<Record<string, SleeperPlayer>>({});
  const [loading, setLoading] = useState(true);
  const [teamOwner, setTeamOwner] = useState<SleeperUser | null>(null);

  useEffect(() => {
    const loadTeamData = async () => {
      // Garantir que o estado está conectado e uma liga está selecionada
      if (!state.isConnected || !state.currentLeague) {
        console.warn("Usuário desconectado ou nenhuma liga selecionada.");
        return;
      }

      setLoading(true);

      try {
        // Buscar dados da API em paralelo
        const [rostersData, playersResponse, usersData] = await Promise.all([
          fetchRosters(state.currentLeague.league_id), // Rosters
          fetchPlayers(), // Jogadores
          fetchUsers(state.currentLeague.league_id), // Usuários
        ]);

        console.log("Dados de rosters:", rostersData);
        console.log("Dados de usuários:", usersData);

        // Verificar se os dados de roster e usuários existem
        if (rostersData?.length > 0 && usersData) {
          // Encontrar o usuário "Shadows"
          const shadowsOwner = usersData.find(
            (user: SleeperUser) =>
              user.metadata?.team_name === "Shadows" ||
              user.display_name === "Shadows" ||
              user.username === "Shadows"
          );

          if (shadowsOwner) {
            setTeamOwner(shadowsOwner);

            console.log("Usuário 'Shadows' identificado com sucesso:", shadowsOwner);

            // Encontrar o roster associado ao "Shadows"
            const shadowsRoster = rostersData.find(
              (roster: SleeperRoster) => roster.owner_id === shadowsOwner.user_id
            );

            if (shadowsRoster) {
              console.log("Roster associado ao usuário Shadows encontrado:", shadowsRoster);

              setUserRoster(shadowsRoster);

              // Combinar IDs dos jogadores do roster
              const allIds = [
                ...(shadowsRoster.starters || []),
                ...(shadowsRoster.reserve || []),
                ...(shadowsRoster.taxi || []),
              ];

              console.log("Todos os IDs de jogadores combinados:", allIds);

              setAllPlayerIds(allIds);
            } else {
              console.warn("Nenhum roster encontrado para o usuário 'Shadows'.");
            }
          } else {
            console.warn("Usuário 'Shadows' não encontrado nos dados retornados.");
          }
        } else {
          console.warn("Dados de roster ou usuários estão ausentes.");
        }

        // Verificar e organizar os dados de jogadores
        if (playersResponse) {
          console.log("Dados de todos os jogadores carregados:", playersResponse);

          // Transformar os dados para o formato esperável (se necessário)
          const formattedPlayers: Record<string, SleeperPlayer> = {};
          Object.keys(playersResponse).forEach((key) => {
            const player = playersResponse[key];
            formattedPlayers[key] = {
              ...player,
              player_id: key,
            };
          });

          setPlayersData(formattedPlayers);

          console.log("Dados formatados de jogadores:", formattedPlayers);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do time:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, [state.isConnected, state.currentLeague, fetchRosters, fetchPlayers, fetchUsers]);

  // Retornar os dados organizados para uso em outros componentes
  return {
    userRoster, // Roster do time do usuário (ex.: Shadows)
    allPlayerIds, // IDs combinados de todos os jogadores (starters, reserve, taxi)
    playersData, // Dados completos de jogadores (nomes, equipes, etc.)
    loading, // Estado de carregamento
    teamOwner, // Dados do dono do time
    isConnected: state.isConnected, // Verifica se o estado está conectado
  };
}