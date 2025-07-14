import { SleeperUser } from "@/types/sleeper";

interface TeamHeaderProps {
  teamOwner: SleeperUser | null;
}

export function TeamHeader({ teamOwner }: TeamHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Meu Time</h1>
      {teamOwner && (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            {teamOwner.display_name?.[0] || teamOwner.username?.[0]}
          </div>
          <div>
            <div className="font-semibold">Shadows</div>
            <div className="text-sm text-muted-foreground">
              {teamOwner.display_name || teamOwner.username}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}