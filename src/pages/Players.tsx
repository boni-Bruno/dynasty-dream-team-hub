import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const YEARS = [2023];

const Players = () => {
  const [playersData, setPlayersData] = useState({});
  const [rosters, setRosters] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar jogadores e times do backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          "https://<YOUR_SUPABASE_PROJECT>.functions.supabase.co/sleeper-players"
        );
        const data = await response.json();

        setPlayersData(data.players);
        setRosters(data.rosters);
      } catch (error) {
        console.error("❌ Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar jogadores por time selecionado
  const filteredPlayers = useMemo(() => {
    if (!selectedTeam) return Object.values(playersData);

    const rosterPlayers = rosters.find((roster) => roster.owner_id === selectedTeam)?.players || [];
    return rosterPlayers.map((playerId) => playersData[playerId]).filter(Boolean);
  }, [playersData, rosters, selectedTeam]);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Jogadores</h1>
        <p>Selecione um time para visualizar os jogadores e as pontuações.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 mr-2" />
          Carregando...
        </div>
      ) : (
        <>
          {/* Seleção de time */}
          <Select value={selectedTeam || ""} onValueChange={setSelectedTeam}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um Time" />
            </SelectTrigger>
            <SelectContent>
              {rosters.map((roster) => (
                <SelectItem key={roster.owner_id} value={roster.owner_id}>
                  {roster.owner_name || `Time ${roster.owner_id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Lista de jogadores */}
          <Card>
            <CardHeader>
              <CardTitle>Jogadores ({filteredPlayers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredPlayers.map((player) => (
                <div key={player.player_id} className="p-4 border-b">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">
                        {player.first_name} {player.last_name} ({player.position})
                      </p>
                      <p className="text-muted-foreground">{player.team}</p>
                    </div>
                    <div>
                      Pontuações:
                      {YEARS.map((year) => (
                        <p key={year}>
                          {year}: {player.scores[year] || "N/A"}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Players;