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
  // Dados fornecidos pelo hook customizado
  const { userRoster, allPlayerIds, playersData, loading, teamOwner, isConnected } = useTeamData();

  // Exibição enquanto os dados estão sendo carregados
  if (loading) {
    console.log("Carregando dados do time...");
    return <LoadingSkeleton />;
  }

  // Tratamento para caso ainda não esteja conectado ou dados estejam ausentes
  if (!isConnected || !userRoster) {
    console.warn("Usuário não está conectado ou Roster não encontrado.");
    return (
      <div className="container mx-auto p-6">
        <TeamHeader teamOwner={teamOwner} />
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              Não foi possível carregar os dados do seu time. Tente novamente mais tarde.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Logs de validação do que está sendo enviado
  console.log("IDs de jogadores (allPlayerIds):", allPlayerIds);
  console.log("Detalhes dos jogadores (playersData):", playersData);

  return (
    <div className="container mx-auto p-6">
      <TeamHeader teamOwner={teamOwner} />

      {/* Exibição do time completo */}
      <TeamSection
        title="Time Completo"
        playerIds={allPlayerIds} // Todos os IDs combinados do time
        playersData={playersData} // Dados detalhados dos jogadores
      />
    </div>
  );
}
