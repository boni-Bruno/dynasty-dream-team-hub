import { useEffect, useState } from "react";
import { useSleeperData } from "@/hooks/useSleeperData";
import { SleeperPlayer, SleeperRoster, SleeperUser } from "@/types/sleeper";

export function useTeamData() {
  const { state, fetchRosters, fetchPlayers, fetchUsers } = useSleeperData();
  const [starters, setStarters] = useState<string[]>([]);
  const [bench, setBench] = useState<string[]>([]);
  const [injuredReserve, setInjuredReserve] = useState<string[]>([]);
  const [taxi, setTaxi] = useState<string[]>([]);
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
        const [rostersData, playersResponse, usersData] = await Promise.all([
          fetchRosters(state.currentLeague.league_id),
          fetchPlayers(),
          fetchUsers(state.currentLeague.league_id),
        ]);

        if (rostersData?.length > 0 && usersData) {
          const shadowsOwner = usersData.find(
            (user: SleeperUser) =>
              user.metadata?.team_name === "Shadows" ||
              user.display_name === "Shadows" ||
              user.username === "Shadows"
          );

          if (shadowsOwner) {
            const shadowsRoster = rostersData.find(
              (roster: SleeperRoster) => roster.owner_id === shadowsOwner.user_id
            );

            if (shadowsRoster) {
              setStarters(shadowsRoster.starters || []);
              setBench(shadowsRoster.reserve || []);
              setInjuredReserve(shadowsRoster.injured_reserve || []);
              setTaxi(shadowsRoster.taxi || []);
            }
          }
        }

        if (playersResponse) {
          const formattedPlayersData: Record<string, SleeperPlayer> = {};
          Object.keys(playersResponse).forEach((key) => {
            const player = playersResponse[key];
            if (player) {
              formattedPlayersData[key] = { ...player, player_id: key };
            }
          });

          setPlayersData(formattedPlayersData);
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
    starters,
    bench,
    injuredReserve,
    taxi,
    playersData,
    loading,
    teamOwner,
    isConnected: state.isConnected,
  };
}