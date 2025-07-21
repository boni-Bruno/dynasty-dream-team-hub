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
        console.warn("Usuário desconectado ou nenhuma liga foi selecionada.");
        return;
      }

      setLoading(true);

      try {
        // Buscar dados necessários da API
        const [rostersData, playersResponse, usersData] = await Promise.all([
          fetchRosters(state.currentLeague.league_id),
          fetchPlayers(),
          fetchUsers(state.currentLeague.league_id),
        ]);

        console.log("✅ Dados completos de Rosters: ", JSON.stringify(rostersData, null, 2));
        console.log("✅ Dados de Jogadores Recebidos (playersResponse):", playersResponse);
        console.log("✅ Dados de Usuários:", usersData);

        if (rostersData?.length > 0 && usersData) {
          const shadowsOwner = usersData.find(
            (user: SleeperUser) =>
              user.metadata?.team_name === "Shadows" ||
              user.display_name === "Shadows" ||
              user.username === "Shadows"
          );

          if (shadowsOwner) {
            console.log("✅ Usuário 'Shadows' encontrado:", shadowsOwner);
            setTeamOwner(shadowsOwner);

            const shadowsRoster = rostersData.find(
              (roster: SleeperRoster) => roster.owner_id === shadowsOwner.user_id
            );

            if (shadowsRoster) {
              setUserRoster(shadowsRoster);

              // Combinar IDs de todos os jogadores (starters + reserve + taxi + injured reserve)
              const allIds = Array.from(
                new Set([
                  ...(shadowsRoster.starters || []),
                  ...(shadowsRoster.reserve || []),
                  ...(shadowsRoster.taxi || []),
                  ...(shadowsRoster.injured_reserve || []),
                ])
              ).filter((id) => id && id !== "0"); // Remove IDs inválidos como "0", null ou undefined

              console.log("🎯 IDs únicos de jogadores combinados no roster (sem duplicatas):", allIds);
              setAllPlayerIds(allIds);
            } else {
              console.warn("⚠️ Nenhum roster encontrado para o time 'Shadows'.");
            }
          } else {
            console.warn("⚠️ Usuário 'Shadows' não identificado.");
          }
        } else {
          console.warn("⚠️ Rosters ou usuários não encontrados.");
        }

        // Processar dados dos jogadores
        if (playersResponse) {
          const formattedPlayersData: Record<string, SleeperPlayer> = {};
          Object.keys(playersResponse).forEach((key) => {
            const player = playersResponse[key];
            if (player) {
              formattedPlayersData[key] = {
                ...player,
                player_id: key, // Adiciona o player_id explicitamente
              };
            }
          });

          console.log("🎯 Dados formatados de jogadores:", formattedPlayersData);
          setPlayersData(formattedPlayersData);
        } else {
          console.warn("⚠️ Nenhum dado encontrado no playersResponse.");
        }
      } catch (error) {
        console.error("❌ Erro ao carregar dados do time:", error);
      } finally {
        setLoading(false); // Encerrar estado de carregamento
      }
    };

    loadTeamData();
  }, [state.isConnected, state.currentLeague, fetchRosters, fetchPlayers, fetchUsers]);

  // Retornar informações necessárias para outros componentes
  return {
    userRoster,
    allPlayerIds,
    playersData,
    loading,
    teamOwner,
    isConnected: state.isConnected,
  };
}