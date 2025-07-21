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
      if (!state.isConnected || !state.currentLeague) {
        console.warn("Usuário desconectado ou nenhuma liga selecionada.");
        return;
      }

      setLoading(true);

      try {
        // Buscar dados da API
        const [rostersData, playersResponse, usersData] = await Promise.all([
          fetchRosters(state.currentLeague.league_id), // Dados do roster
          fetchPlayers(), // Dados de jogadores
          fetchUsers(state.currentLeague.league_id), // Dados de usuários
        ]);

        console.log("✅ Dados de Rosters: ", rostersData);
        console.log("✅ Dados de Usuários: ", usersData);
        console.log("✅ Dados de Jogadores (playersResponse): ", playersResponse);

        // Garantir que existem rosters e usuários
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

            console.log("✅ Usuário 'Shadows' encontrado:", shadowsOwner);

            // Encontrar o roster desse usuário
            const shadowsRoster = rostersData.find(
              (roster: SleeperRoster) => roster.owner_id === shadowsOwner.user_id
            );

            if (shadowsRoster) {
              setUserRoster(shadowsRoster);

              console.log("✅ Roster associado ao Shadows encontrado:", shadowsRoster);

              // Combinar IDs de todos os jogadores no roster
              const allIds = [
                ...(shadowsRoster.starters || []),
                ...(shadowsRoster.reserve || []),
                ...(shadowsRoster.taxi || []),
              ];

              console.log("🎯 IDs de jogadores combinados no roster:", allIds);

              setAllPlayerIds(allIds);
            } else {
              console.warn("⚠️ Roster do usuário 'Shadows' não encontrado.");
            }
          } else {
            console.warn("⚠️ Usuário 'Shadows' não encontrado.");
          }
        } else {
          console.warn("⚠️ Nenhum roster ou usuário encontrado.");
        }

        // Processar os dados de jogadores
        if (playersResponse) {
          console.log("✅ Dados de Jogadores Recebidos (playersResponse):", playersResponse);

          // Transformar jogadores no formato indexado
          const formattedPlayers: Record<string, SleeperPlayer> = {};
          Object.keys(playersResponse).forEach((key) => {
            const player = playersResponse[key];
            if (player) {
              formattedPlayers[key] = {
                ...player,
                player_id: key, // Certificar de adicionar o ID explicitamente
              };
            }
          });

          console.log("🎯 Dados de jogadores formatados:", formattedPlayers);
          setPlayersData(formattedPlayers);
        } else {
          console.warn("⚠️ Nenhum jogador retornado na API.");
        }
      } catch (error) {
        console.error("❌ Erro ao carregar dados do time:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, [state.isConnected, state.currentLeague, fetchRosters, fetchPlayers, fetchUsers]);

  // Retornar os dados necessários ao componente
  return {
    userRoster,
    allPlayerIds,
    playersData,
    loading,
    teamOwner,
    isConnected: state.isConnected,
  };
}