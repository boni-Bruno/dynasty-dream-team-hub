import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSleeperData } from "@/hooks/useSleeperData";
import { SleeperRoster, SleeperPlayer } from "@/types/sleeper";
import { Badge } from "@/components/ui/badge";

export function LeagueDashboard() {
  const { state, fetchRosters, fetchPlayers } = useSleeperData();
  const [rosters, setRosters] = useState<SleeperRoster[]>([]);
  const [players, setPlayers] = useState<Record<string, SleeperPlayer>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state.isConnected && state.leagueId) {
      loadLeagueData();
    }
  }, [state.isConnected, state.leagueId]);

  const loadLeagueData = async () => {
    try {
      setLoading(true);
      const [rostersData, playersData] = await Promise.all([
        fetchRosters(state.leagueId!),
        fetchPlayers()
      ]);
      
      setRosters(rostersData || []);
      setPlayers(playersData || {});
    } catch (error) {
      console.error('Error loading league data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!state.isConnected) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Conectando à liga...</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Carregando dados da liga...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* League Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {state.currentLeague?.name}
            <Badge variant="secondary">
              {state.currentLeague?.total_rosters} Times
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{state.currentLeague?.total_rosters}</p>
              <p className="text-sm text-muted-foreground">Times</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{rosters.length}</p>
              <p className="text-sm text-muted-foreground">Rosters Carregados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{Object.keys(players).length}</p>
              <p className="text-sm text-muted-foreground">Jogadores</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{state.currentLeague?.settings?.type}</p>
              <p className="text-sm text-muted-foreground">Tipo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rosters Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Rosters da Liga</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rosters.map((roster) => (
              <Card key={roster.roster_id} className="p-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">
                    Time {roster.roster_id}
                  </h4>
                  <Badge variant="outline">
                    {roster.players?.length || 0} jogadores
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Owner: {roster.owner_id}
                </p>
                <div className="text-sm mt-2">
                  <p>Vitórias: {roster.settings?.wins || 0}</p>
                  <p>Derrotas: {roster.settings?.losses || 0}</p>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}