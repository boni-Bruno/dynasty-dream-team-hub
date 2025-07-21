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

  // Logs de depuração
  console.log("Starters:", starters);
  console.log("Bench:", bench);
  console.log("Injured Reserve:", injuredReserve);
  console.log("Taxi Squad:", taxi);

  return (
    <div className="container mx-auto p-6">
      <TeamHeader teamOwner={teamOwner} />

      {/* Exibição por categorias */}
      <TeamSection title="Starters" playerIds={starters} playersData={playersData} />
      <TeamSection title="Bench" playerIds={bench} playersData={playersData} />
      <TeamSection title="Injured Reserve" playerIds={injuredReserve} playersData={playersData} />
      <TeamSection title="Taxi Squad" playerIds={taxi} playersData={playersData} />
    </div>
  );
}