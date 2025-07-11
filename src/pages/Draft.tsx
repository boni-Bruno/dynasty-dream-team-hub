import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSleeperData } from "@/hooks/useSleeperData";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const Draft = () => {
  const { state, fetchDrafts, fetchPlayers } = useSleeperData();
  const [drafts, setDrafts] = useState<any[]>([]);
  const [players, setPlayers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state.isConnected && state.leagueId) {
      loadDraftData();
    }
  }, [state.isConnected, state.leagueId]);

  const loadDraftData = async () => {
    try {
      setLoading(true);
      const [draftsData, playersData] = await Promise.all([
        fetchDrafts(state.leagueId!),
        fetchPlayers()
      ]);
      
      setDrafts(draftsData || []);
      setPlayers(playersData || {});
    } catch (error) {
      console.error('Error loading draft data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Draft Board</h1>
        <p className="text-muted-foreground">Visualize e simule picks do draft dynasty</p>
        {state.isConnected && state.currentLeague && (
          <Badge variant="secondary" className="mt-2">
            {state.currentLeague.name}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Mock Draft</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    Carregando informações do draft...
                  </p>
                </div>
              ) : drafts.length > 0 ? (
                <div className="space-y-4">
                  {drafts.map((draft, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Draft {draft.season}</h3>
                        <Badge variant="outline">{draft.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Tipo: {draft.type} | Rounds: {draft.settings?.rounds}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    Nenhum draft encontrado para esta liga
                  </p>
                  <Badge variant="secondary">Liga conectada ao Sleeper</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seus Picks</CardTitle>
            </CardHeader>
            <CardContent>
              {state.isConnected ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Draft picks serão carregadas baseadas nos dados da liga
                  </p>
                  <Badge variant="outline" className="text-xs">
                    Liga: {state.currentLeague?.name}
                  </Badge>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Conectando à liga...
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Best Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">{Object.keys(players).length}</span> jogadores disponíveis
                </p>
                <p className="text-xs text-muted-foreground">
                  Rankings e análises em tempo real
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Draft;