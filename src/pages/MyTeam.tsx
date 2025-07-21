import { useTeamData } from "@/hooks/useTeamData";
import { TeamSection } from "@/components/team/TeamSection";
import { LoadingSkeleton } from "@/components/team/LoadingSkeleton";
import { TeamHeader } from "@/components/team/TeamHeader";

export default function MyTeam() {
  const { allPlayerIds, playersData, loading, teamOwner, isConnected } = useTeamData();

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!isConnected || !allPlayerIds.length) {
    return (
      <div className="container mx-auto p-6">
        <TeamHeader teamOwner={teamOwner} />
        <div className="text-center text-muted-foreground">
          Não foi possível carregar os dados do seu time. Tente novamente mais tarde.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <TeamHeader teamOwner={teamOwner} />
      <TeamSection
        title="Meu Time"
        playerIds={allPlayerIds}
        playersData={playersData}
      />
    </div>
  );
}