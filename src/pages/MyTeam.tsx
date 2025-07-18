/*
import { Card, CardContent } from "@/components/ui/card";
import { useTeamData } from "@/hooks/useTeamData";
import { TeamSection } from "@/components/team/TeamSection";
import { LoadingSkeleton } from "@/components/team/LoadingSkeleton";
import { TeamHeader } from "@/components/team/TeamHeader";

export default function MyTeam() {
  const { userRoster, playersData, loading, teamOwner, isConnected } = useTeamData();

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!isConnected || !userRoster) {
    return (
      <div className="container mx-auto p-6">
        <TeamHeader teamOwner={teamOwner} />
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              Carregando dados do seu time...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <TeamHeader teamOwner={teamOwner} />
      
      <TeamSection 
        title="Time Titular" 
        playerIds={userRoster.starters || []} 
        playersData={playersData} 
      />
      <TeamSection 
        title="Reservas" 
        playerIds={userRoster.reserve || []} 
        playersData={playersData} 
      />
      <TeamSection 
        title="Lista de Lesionados (IR)" 
        playerIds={userRoster.taxi || []} 
        playersData={playersData} 
      />
    </div>
  );
} 
*/

import { Card, CardContent } from "@/components/ui/card";
import { useTeamData } from "@/hooks/useTeamData";
import { TeamSection } from "@/components/team/TeamSection";
import { LoadingSkeleton } from "@/components/team/LoadingSkeleton";
import { TeamHeader } from "@/components/team/TeamHeader";

export default function MyTeam() {
  const { userRoster, playersData, loading, teamOwner, isConnected } = useTeamData();

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!isConnected || !userRoster) {
    return (
      <div className="container mx-auto p-6">
        <TeamHeader teamOwner={teamOwner} />
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              Carregando dados do seu time...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Combinar todos os jogadores do time em um único array
  const allPlayers = [
    ...(userRoster.starters || []), // Jogadores titulares
    ...(userRoster.reserve || []), // Jogadores reservas
    ...(userRoster.taxi || []),    // Jogadores lesionados
  ];

  return (
    <div className="container mx-auto p-6">
      <TeamHeader teamOwner={teamOwner} />

      {/* Exibir todos os jogadores na seção "Time Completo" */}
      <TeamSection 
        title="Time Completo" 
        playerIds={allPlayers} 
        playersData={playersData} 
      />
    </div>
  );
}