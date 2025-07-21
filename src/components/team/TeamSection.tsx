import { SleeperPlayer } from "@/types/sleeper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface PlayerWithDetails extends SleeperPlayer {
  player_id: string;
}

interface TeamSectionProps {
  title: string;
  playerIds: string[];
  playersData: Record<string, SleeperPlayer>;
}

const DISPLAY_POSITIONS = [
  "QB", "WR", "RB", "TE", "K", "CB", "DB", "DE", "DL", "DT", "LB",
];

export function TeamSection({ title, playerIds, playersData }: TeamSectionProps) {
  /**
   * Filtra e organiza os jogadores pelas posições desejadas
   */
  const getPlayersByPosition = (): Record<string, PlayerWithDetails[]> => {
    const playersByPosition: Record<string, PlayerWithDetails[]> = {};

    DISPLAY_POSITIONS.forEach((position) => {
      playersByPosition[position] = [];
    });

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
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <div className="flex gap-4 pb-4">
            {DISPLAY_POSITIONS.map((position) => (
              <div key={position} className="min-w-[150px]">
                <h4 className="font-bold text-center mb-2">{position}</h4>
                <div className="space-y-2">
                  {playersByPosition[position].map((player) => (
                    <div key={player.player_id} className="p-2 border rounded">
                      <p className="text-sm font-medium">{player.full_name}</p>
                      <p className="text-xs text-muted-foreground">{player.team || "Sem time"}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}