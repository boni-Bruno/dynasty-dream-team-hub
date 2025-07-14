import { Badge } from "@/components/ui/badge";

interface PlayerCardProps {
  player: {
    player_id: string;
    first_name?: string;
    last_name?: string;
    team?: string;
    injury_status?: string;
  };
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <div className="flex items-center space-x-3 p-3 border rounded-lg bg-card">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        {player.first_name?.[0]}{player.last_name?.[0]}
      </div>
      <div className="flex-1">
        <div className="font-medium">{player.first_name} {player.last_name}</div>
        <div className="text-sm text-muted-foreground">{player.team}</div>
        {player.injury_status && (
          <Badge variant="destructive" className="text-xs mt-1">
            {player.injury_status}
          </Badge>
        )}
      </div>
    </div>
  );
}