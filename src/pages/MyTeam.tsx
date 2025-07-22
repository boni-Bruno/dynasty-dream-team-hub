import { useTeamData } from "@/hooks/useTeamData";
import { TeamSection } from "@/components/team/TeamSection";
import { LoadingSkeleton } from "@/components/team/LoadingSkeleton";
import { TeamHeader } from "@/components/team/TeamHeader";

/** Mapa de Agrupamento de Posições **/
const positionGroups = {
  DB: ["CB", "S"], // Defensive Backs (Cornerbacks e Safeties)
  DL: ["DE", "DT", "DL"], // Defensive Line (Defensive Ends, Tackles e Lines)
  LB: ["LB"], // Linebackers
};

function getGroupedPosition(position) {
  for (const group in positionGroups) {
    if (positionGroups[group].includes(position)) {
      return group; // Retorna a posição agrupada, como "DB" ou "DL"
    }
  }
  return position; // Retorna a posição original se não estiver no mapa
}

export default function MyTeam() {
  const {
    starters,
    bench,
    injuredReserve,
    taxi,
    playersData,
    loading,
    teamOwner,
    isConnected,
  } = useTeamData();

  if (loading) {
    console.log("Carregando dados...");
    return <LoadingSkeleton />;
  }

  if (!isConnected || (!starters.length && !bench.length && !injuredReserve.length && !taxi.length)) {
    console.warn("Erro ao carregar os dados do time.");
    return (
      <div className="container mx-auto p-6">
        <TeamHeader teamOwner={teamOwner} />
        <div className="text-center text-muted-foreground">
          Não foi possível carregar os dados do seu time. Tente novamente mais tarde.
        </div>
      </div>
    );
  }

  // Processar o agrupamento das posições no playersData
  const groupedPlayersData = Object.keys(playersData).reduce((acc, playerId) => {
    const player = playersData[playerId];
    const groupedPosition = getGroupedPosition(player.position || "N/A"); // Agrupa a posição do jogador
    acc[playerId] = { ...player, position: groupedPosition }; // Sobrescreve no playersData com a posição agrupada
    return acc;
  }, {});

  // Logs de depuração para verificar as categorias
  console.log("Starters:", starters);
  console.log("Bench:", bench);
  console.log("Injured Reserve:", injuredReserve);
  console.log("Taxi Squad:", taxi);
  console.log("Players Agrupados:", groupedPlayersData);

  return (
    <div className="container mx-auto p-6">
      <TeamHeader teamOwner={teamOwner} />

      {/* Exibição do time por categorias */}
      <TeamSection
        title={`Starters (${starters.length})`} // Título com a quantidade
        playerIds={starters}
        playersData={groupedPlayersData} // Usa os dados com posições agrupadas
      />
      <TeamSection
        title={`Bench (${bench.length})`} // Título com a quantidade
        playerIds={bench}
        playersData={groupedPlayersData} // Usa os dados com posições agrupadas
      />
      <TeamSection
        title={`Injured Reserve (${injuredReserve.length})`} // Título com a quantidade
        playerIds={injuredReserve}
        playersData={groupedPlayersData} // Usa os dados com posições agrupadas
      />
      <TeamSection
        title={`Taxi Squad (${taxi.length})`} // Título com a quantidade
        playerIds={taxi}
        playersData={groupedPlayersData} // Usa os dados com posições agrupadas
      />
    </div>
  );
}