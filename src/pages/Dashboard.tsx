import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSleeperData } from "@/hooks/useSleeperData";
import { useEffect, useState } from "react";
import { SleeperRoster, SleeperPlayer } from "@/types/sleeper";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const { state, fetchRosters, fetchPlayers, fetchTrades } = useSleeperData();
  const [rosters, setRosters] = useState<SleeperRoster[]>([]);
  const [players, setPlayers] = useState<Record<string, SleeperPlayer>>({});
  const [userRoster, setUserRoster] = useState<SleeperRoster | null>(null);
  const [recentTrades, setRecentTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state.isConnected && state.leagueId) {
      loadDashboardData();
    }
  }, [state.isConnected, state.leagueId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [rostersData, playersData, tradesData] = await Promise.all([
        fetchRosters(state.leagueId!),
        fetchPlayers(),
        fetchTrades(state.leagueId!)
      ]);
      
      setRosters(rostersData || []);
      setPlayers(playersData || {});
      setRecentTrades(tradesData?.slice(0, 5) || []);
      
      // Para demo, pegar o primeiro roster como "user roster"
      if (rostersData && rostersData.length > 0) {
        setUserRoster(rostersData[0]);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dynasty Hub</h1>
        <p className="text-muted-foreground">Gerencie sua liga dynasty com estratégia</p>
        {state.isConnected && state.currentLeague && (
          <Badge variant="secondary" className="mt-2">
            {state.currentLeague.name}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Seu Time TST</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Carregando roster...</p>
            ) : userRoster ? (
              <div className="space-y-2">
                <p className="font-semibold">Time {userRoster.roster_id}</p>
                <p className="text-sm text-muted-foreground">
                  {userRoster.players?.length || 0} jogadores
                </p>
                <div className="text-xs">
                  <p>Vitórias: {userRoster.settings?.wins || 0}</p>
                  <p>Derrotas: {userRoster.settings?.losses || 0}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Roster não encontrado</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Liga</CardTitle>
          </CardHeader>
          <CardContent>
            {state.currentLeague ? (
              <div className="space-y-2">
                <p className="text-sm">{state.currentLeague.total_rosters} times</p>
                <p className="text-xs text-muted-foreground">
                  Temporada {state.currentLeague.season}
                </p>
                <Badge variant="outline" className="text-xs">
                  {state.currentLeague.status}
                </Badge>
              </div>
            ) : (
              <p className="text-muted-foreground">Conectando à liga...</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-semibold">{rosters.length}</span> times ativos
              </p>
              <p className="text-sm">
                <span className="font-semibold">{Object.keys(players).length}</span> jogadores
              </p>
              <p className="text-sm">
                <span className="font-semibold">{recentTrades.length}</span> trades recentes
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card rounded-lg p-6 border">
        <h2 className="text-xl font-semibold mb-4">Eventos Recentes</h2>
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <span className="text-sm">Carregando eventos...</span>
            </div>
          ) : recentTrades.length > 0 ? (
            recentTrades.map((trade, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                <span className="text-sm">Trade entre times {trade.roster_ids?.join(' e ')}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(trade.created).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <span className="text-sm">Nenhum evento recente</span>
              <span className="text-xs text-muted-foreground">Liga conectada</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;