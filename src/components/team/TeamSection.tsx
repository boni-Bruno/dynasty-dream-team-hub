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

    // Inicializar arrays vazios para cada posição
    ROSTER_POSITIONS.forEach((position) => {
      playersByPosition[position] = [];
    });

    // Iterar pelos playerIds e organizar os jogadores por posição
    playerIds.forEach((playerId) => {
      const player = playersData[playerId];

      if (player) {
        const position = player.position || "BN"; // Jogadores sem posição vão para o banco
        if (ROSTER_POSITIONS.includes(position)) {
          playersByPosition[position].push({
            ...player,
            player_id: playerId,
          });
        } else {
          console.warn(`⚠️ Posição inválida para jogador:`, player);
          playersByPosition["BN"].push({
            ...player,
            player_id: playerId,
          });
        }
      } else {
        // Jogadores com ID sem correspondência no playersData
        console.error(`❌ ID "${playerId}" não encontrado no playersData.`);
        playersByPosition["BN"].push({
          player_id: playerId,
          full_name: "Dados não encontrados",
          position: "Indefinido",
        } as PlayerWithDetails);
      }
    });

    return playersByPosition;
  };

  // Organiza os jogadores enviados para a seção pela posição
  const playersByPosition = getPlayersByPosition(playerIds);

  // Logs para depuração
  console.log(`🔍 Seção "${title}" - Jogadores por posição:`, playersByPosition);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          {/* Renderizar as colunas dos jogadores por posição */}
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

        {/* Diagnóstico adicional: Exibe IDs sem correspondência */}
        <div className="mt-6">
          <h3 className="font-bold text-center">Jogadores disponíveis (diagnóstico):</h3>
          <div className="grid grid-cols-4 gap-4">
            {playerIds.map((playerId) => {
              const player = playersData[playerId];
              console.log(`🔍 ID jogador: ${playerId} - Encontrado no playersData? ${!!player}`);
              return (
                <div key={playerId} className="p-2 border rounded">
                  <p>
                    <strong>Nome:</strong> {player?.full_name || "Desconhecido"}
                  </p>
                  <p>
                    <strong>Posição:</strong> {player?.position || "Indefinido"}
                  </p>
                  <p>
                    <strong>ID:</strong> {playerId}
                  </p>
                  {!player && (
                    <p className="text-red-500">
                      ⚠️ Dados ausentes no playersData.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}