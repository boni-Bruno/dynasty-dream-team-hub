import { useEffect, useState } from "react";
import { useSleeperData } from "@/hooks/useSleeperData";
import { SleeperPlayer, SleeperRoster } from "@/types/sleeper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const ROSTER_POSITIONS = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'];

interface PlayerWithDetails extends SleeperPlayer {
  player_id: string;
}

export default function MyTeam() {
  const { state, fetchRosters, fetchPlayers } = useSleeperData();
  const [userRoster, setUserRoster] = useState<SleeperRoster | null>(null);
  const [playersData, setPlayersData] = useState<Record<string, SleeperPlayer>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeamData = async () => {
      if (!state.isConnected || !state.currentLeague) return;

      try {
        setLoading(true);
        
        // Buscar rosters e jogadores
        const [rostersData, playersResponse] = await Promise.all([
          fetchRosters(state.currentLeague.league_id),
          fetchPlayers()
        ]);

        if (rostersData && rostersData.length > 0) {
          // Para este exemplo, vamos pegar o primeiro roster
          // Em uma implementação real, você identificaria o roster do usuário
          setUserRoster(rostersData[0]);
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
  }, [state.isConnected, state.currentLeague, fetchRosters, fetchPlayers]);

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
          <div className="flex gap-4 overflow-x-auto">
            {ROSTER_POSITIONS.map(position => 
              renderPositionColumn(position, playersByPosition[position])
            )}
          </div>
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
        <h1 className="text-3xl font-bold mb-6">Meu Time</h1>
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
      <h1 className="text-3xl font-bold mb-6">Meu Time</h1>
      
      {renderTeamSection("Time Titular", userRoster.starters || [])}
      {renderTeamSection("Reservas", userRoster.reserve || [])}
      {renderTeamSection("Lista de Lesionados (IR)", userRoster.taxi || [])}
    </div>
  );
}