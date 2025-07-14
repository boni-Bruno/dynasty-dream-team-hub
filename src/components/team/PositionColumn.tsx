import { PlayerCard } from "./PlayerCard";

interface PlayerWithDetails {
  player_id: string;
  first_name?: string;
  last_name?: string;
  team?: string;
  injury_status?: string;
}

interface PositionColumnProps {
  position: string;
  players: PlayerWithDetails[];
}

export function PositionColumn({ position, players }: PositionColumnProps) {
  return (
    <div className="min-w-[200px]">
      <div className="font-semibold text-center p-2 bg-muted rounded-t-lg">
        {position}
      </div>
      <div className="space-y-2 p-2 border-x border-b rounded-b-lg min-h-[100px]">
        {players.length > 0 ? (
          players.map(player => (
            <PlayerCard key={player.player_id} player={player} />
          ))
        ) : (
          <div className="text-center text-muted-foreground text-sm py-4">
            Nenhum jogador
          </div>
        )}
      </div>
    </div>
  );
}