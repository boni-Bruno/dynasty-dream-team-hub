
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

// Lista de posições do time
const ROSTER_POSITIONS = [
  "QB", "RB", "WR", "TE", "FLEX", "K", "DEF", "DL", "LB", "DB", "IDP_FLEX", "BN"
];

interface PlayerWithDetails extends SleeperPlayer {
  player_id: string;
}

interface TeamSectionProps {
  title: string;
  playerIds: string[];
  playersData: Record<string, SleeperPlayer>;
}

export function TeamSection({ title, playerIds, playersData }: TeamSectionProps) {
  /**
   * Função para organizar os jogadores por posição do time
   */
  const getPlayersByPosition = (playerIds: string[]) => {
    const playersByPosition: Record<string, PlayerWithDetails[]> = {};

    // Inicializar arrays vazios para todas as posições
    ROSTER_POSITIONS.forEach(position => {
      playersByPosition[position] = [];
    });

    // Itera pelos IDs e os organiza com base na posição
    playerIds.forEach(playerId => {
      const player = playersData[playerId];

      if (player) {
        const position = player.position || "UNKNOWN"; // Posição desconhecida -> "UNKNOWN"

        if (ROSTER_POSITIONS.includes(position)) {
          playersByPosition[position].push({
            ...player,
            player_id: playerId,
          });
        } else {
          // Jogadores sem posição válida vão para o banco (BN)
          console.warn(`⚠️ Jogador com posição desconhecida:`, player);
          if (!playersByPosition["BN"]) {
            playersByPosition["BN"] = [];
          }
          playersByPosition["BN"].push({
            ...player,
            player_id: playerId,
          });
        }
      } else {
        console.error(`❌ Jogador com ID "${playerId}" não encontrado em playersData.`);
      }
    });

    return playersByPosition;
  };

  // Organizar os jogadores enviados pelo MyTeam
  const playersByPosition = getPlayersByPosition(playerIds);

  // Log para conferência
  console.log(`Seção: "${title}"`);
  console.log("Jogadores por posição organizados:", playersByPosition);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          {/* Renderiza as colunas de jogadores por posição */}
          <div className="flex gap-4 pb-4">
            {ROSTER_POSITIONS.map(position => (
              <PositionColumn 
                key={position}
                position={position} 
                players={playersByPosition[position]} 
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Diagnóstico adicional: mostra todos os jogadores recebidos */}
        <div className="mt-6">
          <h3 className="font-bold text-center">Jogadores disponíveis (diagnóstico):</h3>
          <div className="grid grid-cols-4 gap-4">
            {playerIds.map(playerId => {
              const player = playersData[playerId];
              return (
                <div key={playerId} className="p-2 border rounded">
                  <p><strong>Nome:</strong> {player?.name || "Desconhecido"}</p>
                  <p><strong>Posição:</strong> {player?.position || "Indefinido"}</p>
                  <p><strong>ID:</strong> {playerId}</p>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}