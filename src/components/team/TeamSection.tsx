import { SleeperPlayer } from "@/types/sleeper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface PlayerWithDetails extends SleeperPlayer {
  player_id: string;
}

interface TeamSectionProps {
  title: string; // Título do quadrante (Starters, Bench, etc.)
  playerIds: string[]; // IDs de jogadores nesta categoria
  playersData: Record<string, SleeperPlayer>; // Dados de detalhes de jogadores
}

// Apenas as posições desejadas
const DISPLAY_POSITIONS = [
  "QB", "WR", "RB", "TE", "K", "CB", "DB", "DE", "DL", "DT", "LB",
];

export function TeamSection({ title, playerIds, playersData }: TeamSectionProps) {
  /**
   * Filtra os jogadores pelas posições definidas e organiza
   */
  const getPlayersByPosition = (): Record<string, PlayerWithDetails[]> => {
    const playersByPosition: Record<string, PlayerWithDetails[]> = {};

    // Inicializar arrays vazios para cada posição
    DISPLAY_POSITIONS.forEach((position) => {
      playersByPosition[position] = [];
    });

    // Agrupar jogadores com base nas posições
    playerIds.forEach((playerId) => {
      const player = playersData[playerId];
      if (player && DISPLAY_POSITIONS.includes(player.position)) {
        playersByPosition[player.position].push({
          ...player,
          player_id: playerId,
        });
      }
    });

    return playersByPosition;
  };

  const playersByPosition = getPlayersByPosition();

  return (
    <Card className="mb-6">
      {/* Cabeçalho do Quadrante */}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      {/* Conteúdo do Quadrante */}
      <CardContent>
        <ScrollArea>
          {/* Colunas por posição */}
          <div className="flex gap-4 pb-4">
            {DISPLAY_POSITIONS.map((position) => (
              <div key={position} className="min-w-[150px]">
                <h4 className="font-bold text-center mb-2">{position}</h4>
                <div className="space-y-2">
                  {playersByPosition[position].map((player) => (
                    <div key={player.player_id} className="p-2 border rounded">
                      <p className="text-sm font-medium">{player.full_name}</p>
                      <p className="text-xs text-muted-foreground">{player.team || "Sem Time"}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Barra de rolagem horizontal */}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}