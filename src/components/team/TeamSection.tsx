import { SleeperPlayer } from "@/types/sleeper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PositionColumn } from "./PositionColumn";

const ROSTER_POSITIONS = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'K', 'DEF', 'DL', 'LB', 'DB', 'IDP_FLEX', 'BN'];

interface PlayerWithDetails extends SleeperPlayer {
  player_id: string;
}

interface TeamSectionProps {
  title: string;
  playerIds: string[];
  playersData: Record<string, SleeperPlayer>;
}

export function TeamSection({ title, playerIds, playersData }: TeamSectionProps) {
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
              <PositionColumn 
                key={position}
                position={position} 
                players={playersByPosition[position]} 
              />
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function TeamSection({ title, playerIds, playersData }) {
  console.log(`Jogadores na seção ${title}:`, playerIds);
  console.log("Dados completos de jogadores:", playersData);

  return (
    <div className="team-section">
      <h2>{title}</h2>
      {playerIds.map((playerId) => {
        const player = playersData[playerId];
        console.log(`Dados do jogador ${playerId}:`, player);

        if (!player) {
          return (
            <div key={playerId} className="player-placeholder">
              Jogador não encontrado (ID: {playerId})
            </div>
          );
        }

        return (
          <div key={playerId} className="player-card">
            <p>{player.name}</p>
            <p>{player.position}</p>
          </div>
        );
      })}
    </div>
  );
}