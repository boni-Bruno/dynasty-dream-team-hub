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
    ROSTER_POSITIONS.forEach((position) => {
      playersByPosition[position] = [];
    });

    playerIds.forEach((playerId) => {
      const player = playersData[playerId]; // Buscar jogador pelo ID

      if (player) {
        // Distribuir jogadores em suas posições
        const position = player.position || "BN"; // Jogadores sem posição específica vão ao banco
        if (ROSTER_POSITIONS.includes(position)) {
          playersByPosition[position].push({
            ...player,
            player_id: playerId,
          });
        } else {
          // Jogadores com posição desconhecida vão ao banco (BN)
          console.warn(`⚠️ Posição inválida para jogador:`, player);
          playersByPosition["BN"].push({
            ...player,
            player_id: playerId,
          });
        }
      } else {
        // Jogador não encontrado no playersData
        console.error(`❌ Jogador com ID "${playerId}" não encontrado no banco de jogadores.`);
        playersByPosition["BN"].push({
          player_id: playerId,
          name: "Desconhecido",
          position: "Indefinido",
        } as PlayerWithDetails);
      }
    });

    return playersByPosition;
  };

  // Organizar os jogadores com base nas posições definidas
  const playersByPosition = getPlayersByPosition(playerIds);

  // Logs de depuração
  console.log(`🔍 Seção: "${title}" - Organização de jogadores:`, playersByPosition);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          {/* Renderizar colunas de jogadores por posição */}
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

        {/* Diagnóstico adicional: Jogadores não encontrados */}
        <div className="mt-6">
          <h3 className="font-bold text-center">Diagnóstico (Jogadores Não Encontrados):</h3>
          <div className="grid grid-cols-4 gap-4">
            {playerIds.map((playerId) => {
              const player = playersData[playerId];
              return (
                <div key={playerId} className="p-2 border rounded">
                  <p>
                    <strong>Nome:</strong> {player?.name || "Desconhecido"}
                  </p>
                  <p>
                    <strong>Posição:</strong> {player?.position || "Indefinido"}
                  </p>
                  <p>
                    <strong>ID:</strong> {playerId}
                  </p>
                  {!player && (
                    <p className="text-red-500">
                      ⚠️ Dados ausentes no `playersData`.
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