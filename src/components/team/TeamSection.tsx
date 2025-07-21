import { SleeperPlayer } from "@/types/sleeper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PositionColumn } from "./PositionColumn";

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
   * Função para processar os jogadores em colunas
   */
  const processPlayers = (playerIds: string[]) => {
    return playerIds.map((playerId) => playersData[playerId]).filter(Boolean);
  };

  const players = processPlayers(playerIds);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          {/* Renderizar uma lista dos jogadores */}
          <div className="flex flex-wrap gap-4">
            {players.map((player) => (
              <div key={player.player_id} className="p-2 border rounded w-48">
                <h5 className="font-bold">{player.full_name}</h5>
                <p>Posição: {player.position}</p>
                <p>Time: {player.team || "Nenhum"}</p>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}