import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSleeperData } from "@/hooks/useSleeperData";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const Trades = () => {
  const { state, fetchTrades, fetchRosters } = useSleeperData();
  const [trades, setTrades] = useState<any[]>([]);
  const [rosters, setRosters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state.isConnected && state.leagueId) {
      loadTradesData();
    }
  }, [state.isConnected, state.leagueId]);

  const loadTradesData = async () => {
    try {
      setLoading(true);
      const [tradesData, rostersData] = await Promise.all([
        fetchTrades(state.leagueId!),
        fetchRosters(state.leagueId!)
      ]);
      
      setTrades(tradesData || []);
      setRosters(rostersData || []);
    } catch (error) {
      console.error('Error loading trades data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRosterName = (rosterId: number) => {
    const roster = rosters.find(r => r.roster_id === rosterId);
    return roster ? `Time ${roster.roster_id}` : `Time ${rosterId}`;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciamento de Trades</h1>
        <p className="text-muted-foreground">Crie, avalie e simule trades com outros times</p>
        {state.isConnected && state.currentLeague && (
          <Badge variant="secondary" className="mt-2">
            {state.currentLeague.name}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Novo Trade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              {state.isConnected ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground mb-4">
                    Crie uma proposta de trade com {state.currentLeague?.total_rosters} times
                  </p>
                  <Button variant="outline">Criar Trade</Button>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Conectando à liga...
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sugestões Automáticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Baseado nas necessidades do seu time
                </p>
                {state.isConnected && (
                  <Badge variant="outline" className="text-xs">
                    {rosters.length} times disponíveis
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Trades</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Carregando histórico de trades...
              </p>
            </div>
          ) : trades.length > 0 ? (
            <div className="space-y-4">
              {trades.slice(0, 10).map((trade, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">
                        Trade: {trade.roster_ids?.map(getRosterName).join(' ↔ ')}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(trade.created).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge 
                      variant={trade.status === 'complete' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {trade.status}
                    </Badge>
                  </div>
                  
                  {trade.adds && Object.keys(trade.adds).length > 0 && (
                    <div className="mt-2 text-sm">
                      <p className="text-muted-foreground">
                        Jogadores envolvidos: {Object.keys(trade.adds).length}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              
              {trades.length > 10 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Mostrando primeiros 10 de {trades.length} trades
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {state.isConnected 
                  ? "Nenhum trade encontrado nesta liga"
                  : "Conectando à liga..."
                }
              </p>
              {state.isConnected && (
                <Badge variant="secondary" className="mt-2">
                  Liga conectada ao Sleeper
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Trades;