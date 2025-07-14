import { useEffect, useState } from "react";
import { useSleeperData } from "@/hooks/useSleeperData";
import { SleeperPlayer, SleeperRoster, SleeperUser } from "@/types/sleeper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const ROSTER_POSITIONS = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'K', 'DEF', 'DL', 'LB', 'DB', 'IDP_FLEX', 'BN'];

interface PlayerWithDetails extends SleeperPlayer {
  player_id: string;
}

export default function MyTeam() {
  const { state, fetchRosters, fetchPlayers, fetchUsers } = useSleeperData();
  const [userRoster, setUserRoster] = useState<SleeperRoster | null>(null);
  const [playersData, setPlayersData] = useState<Record<string, SleeperPlayer>>({});
  const [loading, setLoading] = useState(true);
  const [teamOwner, setTeamOwner] = useState<SleeperUser | null>(null);

  useEffect(() => {
    const loadTeamData = async () => {
      if (!state.isConnected || !state.currentLeague) return;

      try {
        setLoading(true);
        
        // Buscar rosters, jogadores e usuários
        const [rostersData, playersResponse, usersData] = await Promise.all([
          fetchRosters(state.currentLeague.league_id),
          fetchPlayers(),
          fetchUsers(state.currentLeague.league_id)
        ]);

        if (rostersData && rostersData.length > 0 && usersData) {
          // Encontrar o usuário com team_name "Shadows"
          const shadowsOwner = usersData.find((user: SleeperUser) => 
            user.metadata?.team_name === "Shadows" || 
            user.display_name === "Shadows" ||
            user.username === "Shadows"
          );
          
          if (shadowsOwner) {
            // Encontrar o roster deste usuário
            const shadowsRoster = rostersData.find((roster: SleeperRoster) => 
              roster.owner_id === shadowsOwner.user_id
            );
            
            if (shadowsRoster) {
              setUserRoster(shadowsRoster);
              setTeamOwner(shadowsOwner);
            }
          }
        }

        if (playersResponse) {
          setPlayersData(playersResponse);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do time:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, [state.isConnected, state.currentLeague, fetchRosters, fetchPlayers, fetchUsers]);

  const getPlayersByPosition = (playerIds: string[]) => {
    const playersByPosition: Record<string, PlayerWithDetails[]> = {};
    
    ROSTER_POSITIONS.forEach(position => {
      playersByPosition[position] = [];
    });

    playerIds.forEach(playerId => {
      const player = playersData[playerId];
      if (player) {
        const position = player.position || 'UNKNOWN';
        if (ROSTER_POSITIONS.includes(position)) {
          playersByPosition[position].push({
            ...player,
            player_id: playerId
          });
        } else {
          // Para jogadores de banco, adicionar à posição BN se não tiver posição específica
          if (!playersByPosition['BN']) {
            playersByPosition['BN'] = [];
          }
          playersByPosition['BN'].push({
            ...player,
            player_id: playerId
          });
        }
      }
    });

    return playersByPosition;
  };

  const renderPlayerCard = (player: PlayerWithDetails) => (
    <div key={player.player_id} className="flex items-center space-x-3 p-3 border rounded-lg bg-card">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        {player.first_name?.[0]}{player.last_name?.[0]}
      </div>
      <div className="flex-1">
        <div className="font-medium">{player.first_name} {player.last_name}</div>
        <div className="text-sm text-muted-foreground">{player.team}</div>
        {player.injury_status && (
          <Badge variant="destructive" className="text-xs mt-1">
            {player.injury_status}
          </Badge>
        )}
      </div>
    </div>
  );

  const renderPositionColumn = (position: string, players: PlayerWithDetails[]) => (
    <div key={position} className="min-w-[200px]">
      <div className="font-semibold text-center p-2 bg-muted rounded-t-lg">
        {position}
      </div>
      <div className="space-y-2 p-2 border-x border-b rounded-b-lg min-h-[100px]">
        {players.length > 0 ? (
          players.map(renderPlayerCard)
        ) : (
          <div className="text-center text-muted-foreground text-sm py-4">
            Nenhum jogador
          </div>
        )}
      </div>
    </div>
  );

  const renderTeamSection = (title: string, playerIds: string[]) => {
    const playersByPosition = getPlayersByPosition(playerIds);
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-4">
              {ROSTER_POSITIONS.map(position => 
                renderPositionColumn(position, playersByPosition[position])
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Meu Time</h1>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {ROSTER_POSITIONS.map((pos) => (
                    <div key={pos} className="min-w-[200px]">
                      <Skeleton className="h-10 w-full mb-2" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!state.isConnected || !userRoster) {
    return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Meu Time</h1>
        {teamOwner && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              {teamOwner.display_name?.[0] || teamOwner.username?.[0]}
            </div>
            <div>
              <div className="font-semibold">Shadows</div>
              <div className="text-sm text-muted-foreground">
                {teamOwner.display_name || teamOwner.username}
              </div>
            </div>
          </div>
        )}
      </div>
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Meu Time</h1>
        {teamOwner && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              {teamOwner.display_name?.[0] || teamOwner.username?.[0]}
            </div>
            <div>
              <div className="font-semibold">Shadows</div>
              <div className="text-sm text-muted-foreground">
                {teamOwner.display_name || teamOwner.username}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {renderTeamSection("Time Titular", userRoster.starters || [])}
      {renderTeamSection("Reservas", userRoster.reserve || [])}
      {renderTeamSection("Lista de Lesionados (IR)", userRoster.taxi || [])}
    </div>
  );
}