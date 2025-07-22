import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useSleeperData } from "@/hooks/useSleeperData";
import { SleeperPlayer, SleeperRoster, SleeperUser } from "@/types/sleeper";

const positionGroups = {
  QB: ["QB"],
  RB: ["RB"],
  WR: ["WR"],
  TE: ["TE"],
  K: ["K"],
  DL: ["DE", "DT", "DL"],
  LB: ["LB"],
  DB: ["CB", "DB", "S"],
};

const YEARS = [2023]; // Só mostra as pontuações para 2023

const Players = () => {
  const { state, fetchRosters, fetchPlayers, fetchUsers } = useSleeperData();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string>("all");
  const [playersData, setPlayersData] = useState<Record<string, SleeperPlayer>>({});
  const [rosters, setRosters] = useState<SleeperRoster[]>([]);
  const [users, setUsers] = useState<SleeperUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlayersAndTeams = async () => {
      if (!state.isConnected || !state.currentLeague) return;

      setLoading(true);

      try {
        const [rostersData, playersResponse, usersResponse] = await Promise.all([
          fetchRosters(state.currentLeague.league_id),
          fetchPlayers(),
          fetchUsers(state.currentLeague.league_id),
        ]);

        setRosters(rostersData || []);
        setUsers(usersResponse || []);
        setPlayersData(playersResponse || {});
      } catch (error) {
        console.error("❌ Erro ao carregar jogadores ou times:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlayersAndTeams();
  }, [state.isConnected, state.currentLeague, fetchRosters, fetchPlayers, fetchUsers]);

  const selectedTeamPlayers = selectedTeam
    ? rosters.find((roster) => roster.owner_id === selectedTeam)?.players || []
    : [];

  const filteredPlayers = useMemo(() => {
    if (selectedPosition === "all") {
      return selectedTeamPlayers;
    }
    const allowedPositions = positionGroups[selectedPosition] || [];
    return selectedTeamPlayers.filter(
      (playerId) => playersData[playerId] && allowedPositions.includes(playersData[playerId].position)
    );
  }, [selectedTeamPlayers, selectedPosition, playersData]);

  const getTeamName = (ownerId: string): string => {
    const user = users.find((u) => u.user_id === ownerId);
    return user?.metadata.team_name || user?.display_name || "Nome do Time Indisponível";
  };

  const getPlayerScores = (playerId: string) => {
    const scores = playersData[playerId]?.scores || {};
    return YEARS.map((year) => scores[year] || "N/A");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Jogadores por Time</h1>
        <p className="text-muted-foreground">Selecione um time e posição para visualizar os jogadores e suas pontuações.</p>
      </div>

      <div className="mb-6 space-y-4">
        {loading ? (
          <div className="flex items-center text-muted-foreground gap-2">
            <Loader2 className="animate-spin h-4 w-4" />
            Carregando times...
          </div>
        ) : (
          <Select value={selectedTeam || ""} onValueChange={setSelectedTeam}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Selecione um Time" />
            </SelectTrigger>
            <SelectContent>
              {rosters.map((roster) => (
                <SelectItem key={roster.owner_id} value={roster.owner_id}>
                  {getTeamName(roster.owner_id)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={selectedPosition} onValueChange={setSelectedPosition}>
          <SelectTrigger className="w-full max-w-md">
            <SelectValue placeholder="Selecione uma Posição" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Posições</SelectItem>
            {Object.keys(positionGroups).map((position) => (
              <SelectItem key={position} value={position}>
                {position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jogadores ({filteredPlayers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span className="text-muted-foreground">Carregando jogadores...</span>
            </div>
          ) : filteredPlayers.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              Nenhum jogador encontrado para os critérios selecionados.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPlayers
                .map((playerId) => playersData[playerId])
                .filter(Boolean)
                .map((player) => (
                  <div key={player.player_id} className="p-3 border rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">
                        {player.first_name} {player.last_name}
                      </h4>
                      <div className="text-muted-foreground text-sm">
                        <span>{player.position || "Posição não disponível"}</span>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      {getPlayerScores(player.player_id).map((score, index) => (
                        <div key={YEARS[index]} className="text-center">
                          <span className="block font-medium">{YEARS[index]}</span>
                          <span className="text-muted-foreground text-sm">{score}</span>
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