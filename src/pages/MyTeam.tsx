import { useTeamData } from "@/hooks/useTeamData";
import { TeamSection } from "@/components/team/TeamSection";
import { LoadingSkeleton } from "@/components/team/LoadingSkeleton";
import { TeamHeader } from "@/components/team/TeamHeader";

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

  // Logs de depuração para verificar as categorias
  console.log("Starters:", starters);
  console.log("Bench:", bench);
  console.log("Injured Reserve:", injuredReserve);
  console.log("Taxi Squad:", taxi);

  return (
    <div className="container mx-auto p-6">
      <TeamHeader teamOwner={teamOwner} />

      {/* Exibição do time por categorias */}
      <TeamSection
        title={`Starters (${starters.length})`} // Título com a quantidade
        playerIds={starters}
        playersData={playersData}
      />
      <TeamSection
        title={`Bench (${bench.length})`} // Título com a quantidade
        playerIds={bench}
        playersData={playersData}
      />
      <TeamSection
        title={`Injured Reserve (${injuredReserve.length})`} // Título com a quantidade
        playerIds={injuredReserve}
        playersData={playersData}
      />
      <TeamSection
        title={`Taxi Squad (${taxi.length})`} // Título com a quantidade
        playerIds={taxi}
        playersData={playersData}
      />
    </div>
  );
}