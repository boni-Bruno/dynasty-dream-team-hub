import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useSleeperData } from "@/hooks/useSleeperData";
import { SleeperPlayer, SleeperRoster, SleeperUser } from "@/types/sleeper";

// Anos suportados
const YEARS = [2023];

const Players = () => {
  const [playersData, setPlayersData] = useState<Record<string, SleeperPlayer>>({});
  const [loading, setLoading] = useState(true);

  // Carregar dados do backend
  useEffect(() => {
    const loadPlayers = async () => {
      setLoading(true);

      try {
        const response = await fetch("https://<YOUR_SUPABASE_PROJECT>.functions.supabase.co/sleeper-players");
        const data = await response.json();
        setPlayersData(data);
      } catch (error) {
        console.error("❌ Erro ao carregar jogadores:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, []);

  const filteredPlayers = useMemo(() => {
    return Object.values(playersData);
  }, [playersData]);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Jogadores</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jogadores ({filteredPlayers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="animate-spin h-6 w-6 mr-2" />
              Carregando jogadores...
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPlayers.map((player) => (
                <div key={player.player_id} className="p-3 border rounded-lg flex justify-between items-center">
                  {/* Informações gerais do jogador */}
                  <div>
                    <h4 className="font-medium">
                      {player.full_name} ({player.position})
                    </h4>
                    <p className="text-muted-foreground text-sm">{player.team}</p>
                  </div>

                  {/* Exibição das pontuações */}
                  <div className="flex space-x-4">
                    {YEARS.map((year) => (
                      <div key={year} className="text-center">
                        <span className="block font-medium">{year}</span>
                        <span className="text-muted-foreground text-sm">
                          {player.scores[year] || "N/A"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Players;