import { useTeamData } from "@/hooks/useTeamData";
import { TeamSection } from "@/components/team/TeamSection";
import { LoadingSkeleton } from "@/components/team/LoadingSkeleton";
import { TeamHeader } from "@/components/team/TeamHeader";

// Mapa de Posições Agrupadas
const positionGroups = {
  DB: ["CB", "S"], // Defensive Backs
  DL: ["DE", "DT", "DL"], // Defensive Line
  LB: ["LB"], // Linebackers
};

// Ordem de Exibição das Posições
const positionOrder = [
  "QB",   // Quarterbacks
  "RB",   // Running Backs
  "WR",   // Wide Receivers
  "TE",   // Tight Ends
  "W/R/T", // Flex
  "IDP",  // Individual Defensive Players
  "K",    // Kickers
  "DL",   // Defensive Line
  "LB",   // Linebackers
  "DB",   // Defensive Backs
];

// Função para Agrupamento de Posições
function getGroupedPosition(position) {
  // Verifica se a posição pertence a algum grupo
  for (const group in positionGroups) {
    if (positionGroups[group].includes(position)) {
      return group; // Retorna a posição agrupada (como "DB" ou "DL")
    }
  }
  return position; // Retorna a posição original se não estiver no mapa
}

// Função para Ordenar Jogadores Baseado na Ordem Desejada
function sortByPosition(playerA, playerB, playersData) {
  const positionA = playersData[playerA]?.position || "N/A"; // Posição do jogador A
  const positionB = playersData[playerB]?.position || "N/A"; // Posição do jogador B

  // Agrupa posições antes de comparar
  const groupedPositionA = getGroupedPosition(positionA);
  const groupedPositionB = getGroupedPosition(positionB);

  // Obtém os índices das posições na ordem desejada
  const indexA = positionOrder.indexOf(groupedPositionA);
  const indexB = positionOrder.indexOf(groupedPositionB);

  // Caso posição não esteja na ordem, coloca no final
  if (indexA === -1 && indexB === -1) return 0; // Sem ordem definida, mantém posição original
  if (indexA === -1) return 1; // A vai para o final
  if (indexB === -1) return -1; // B vai para o final

  // Ordena com base no índice
  return indexA - indexB;
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

  // Processa o agrupamento e ordenação de posições
  const groupedPlayersData = Object.keys(playersData).reduce((acc, playerId) => {
    const player = playersData[playerId];
    const groupedPosition = getGroupedPosition(player.position || "N/A"); // Agrupa a posição do jogador
    acc[playerId] = { ...player, position: groupedPosition }; // Atualiza para posição agrupada
    return acc;
  }, {});

  // Ordena jogadores de cada categoria com base nas posições
  const sortedStarters = [...starters].sort((a, b) =>
    sortByPosition(a, b, groupedPlayersData)
  );
  const sortedBench = [...bench].sort((a, b) =>
    sortByPosition(a, b, groupedPlayersData)
  );
  const sortedInjuredReserve = [...injuredReserve].sort((a, b) =>
    sortByPosition(a, b, groupedPlayersData)
  );
  const sortedTaxi = [...taxi].sort((a, b) =>
    sortByPosition(a, b, groupedPlayersData)
  );

  // Logs Informativos no Console (Usando os Nomes dos Jogadores)
  console.log("Starters Ordenados:", sortedStarters.map((id) => groupedPlayersData[id]?.full_name || id));
  console.log("Bench Ordenado:", sortedBench.map((id) => groupedPlayersData[id]?.full_name || id));
  console.log("Injured Reserve Ordenado:", sortedInjuredReserve.map((id) => groupedPlayersData[id]?.full_name || id));
  console.log("Taxi Squad Ordenado:", sortedTaxi.map((id) => groupedPlayersData[id]?.full_name || id));

  return (
    <div className="container mx-auto p-6">
      <TeamHeader teamOwner={teamOwner} />

      {/* Exibição do time por categorias */}
      <TeamSection
        title={`Starters (${sortedStarters.length})`}
        playerIds={sortedStarters}
        playersData={groupedPlayersData} // Usa os dados com posições agrupadas
      />
      <TeamSection
        title={`Bench (${sortedBench.length})`}
        playerIds={sortedBench}
        playersData={groupedPlayersData} // Usa os dados com posições agrupadas
      />
      <TeamSection
        title={`Injured Reserve (${sortedInjuredReserve.length})`}
        playerIds={sortedInjuredReserve}
        playersData={groupedPlayersData} // Usa os dados com posições agrupadas
      />
      <TeamSection
        title={`Taxi Squad (${sortedTaxi.length})`}
        playerIds={sortedTaxi}
        playersData={groupedPlayersData} // Usa os dados com posições agrupadas
      />
    </div>
  );
}