
/*
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

*/

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

    // Inicializar arrays para todas as posições
    ROSTER_POSITIONS.forEach(position => {
      playersByPosition[position] = [];
    });

    playerIds.forEach(playerId => {
      const player = playersData[playerId];

      if (player) {
        const position = player.position || 'BN'; // Define posição padrão como 'BN'
        if (ROSTER_POSITIONS.includes(position)) {
          // Adicionar jogador na posição correspondente
          playersByPosition[position].push({
            ...player,
            player_id: playerId
          });
        } else {
          // Jogadores com posições fora do esperado também são adicionados no banco ('BN')
          console.warn(`Jogador com posição desconhecida:`, player);
          playersByPosition['BN'].push({
            ...player,
            player_id: playerId
          });
        }
      } else {
        // Exibir aviso de jogador não encontrado
        console.error(`Nenhum dado encontrado para o jogador com ID: ${playerId}`);
      }

      playerIds.forEach(playerId => {
        const player = playersData[playerId];
       if (!player) {
        console.warn(`⚠️ Jogador não encontrado para o ID ${playerId}`);
        }
      });
    });

    return playersByPosition;
  };

  console.log("Jogadores recebidos:", playerIds);
  console.log("Informações detalhadas dos jogadores (playersData):", playersData);

  const playersByPosition = getPlayersByPosition(playerIds);

  <div>
    <h3>Todos os jogadores disponíveis (diagnóstico):</h3>
    <div className="grid grid-cols-4 gap-4">
      {Object.keys(playersData).map((playerId) => (
        <div key={playerId} className="player-diagnostic-card">
          <p><strong>Nome:</strong> {playersData[playerId]?.name || "Desconhecido"}</p>
          <p><strong>Posição:</strong> {playersData[playerId]?.position || "Indefinida"}</p>
          <p><strong>ID:</strong> {playerId}</p>
        </div>
      ))}
    </div>
  </div>

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