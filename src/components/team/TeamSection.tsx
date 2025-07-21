import { SleeperPlayer } from "@/types/sleeper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PositionColumn } from "./PositionColumn";

// Lista de todas as posições possíveis no roster
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
   * Função para organizar os jogadores por posição
   */
  const getPlayersByPosition = (playerIds: string[]) => {
    const playersByPosition: Record<string, PlayerWithDetails[]> = {};

    // Inicializar arrays vazios para cada posição definida em ROSTER_POSITIONS
    ROSTER_POSITIONS.forEach((position) => {
      playersByPosition[position] = [];
    });

    playerIds.forEach((playerId) => {
      const player = playersData[playerId];

      if (player) {
        // Verificar se o jogador tem uma posição válida
        const position = player.position || "BN"; // Jogadores sem posição específica vão ao banco
        if (ROSTER_POSITIONS.includes(position)) {
          playersByPosition[position].push({
            ...player,
            player_id: playerId,
          });
        } else {
          // Caso não esteja em ROSTER_POSITIONS, enviar para "BN" (fallback)
          console.warn(`⚠️ Posição desconhecida para jogador:`, player);
          playersByPosition["BN"].push({
            ...player,
            player_id: playerId,
          });
        }
      } else {
        // Jogadores com ID sem correspondência no playersData
        console.error(`❌ Dados do jogador não encontrados para ID: ${playerId}`);
        playersByPosition["BN"].push({
          player_id: playerId, // Dados mínimos
          name: "Desconhecido",
          position: "Indefinido",
        } as PlayerWithDetails);
      }
    });

    return playersByPosition;
  };

  // Organizar os jogadores com base nas posições
  const playersByPosition = getPlayersByPosition(playerIds);

  // Logs para conferência
  console.log(`Seção: "${title}" - Organização por posição:`, playersByPosition);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          {/* Renderizar as colunas para cada posição */}
          <div className="flex gap-4 pb-4">
            {ROSTER_POSITIONS.map((position) => (
              <PositionColumn
                key={position}
                position={position}
                players={playersByPosition[position]}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Diagnóstico adicional para jogadores não carregados */}
        <div className="mt-6">
          <h3 className="font-bold text-center">Jogadores disponíveis (diagnóstico):</h3>
          <div className="grid grid-cols-4 gap-4">
            {playerIds.map((playerId) => {
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