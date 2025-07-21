import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useSleeperData } from "@/hooks/useSleeperData";
import { SleeperPlayer, SleeperRoster, SleeperUser } from "@/types/sleeper";

const Players = () => {
  const { state, fetchRosters, fetchPlayers, fetchUsers } = useSleeperData();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null); // Time selecionado
  const [playersData, setPlayersData] = useState<Record<string, SleeperPlayer>>({});
  const [rosters, setRosters] = useState<SleeperRoster[]>([]); // Lista de todos os times
  const [users, setUsers] = useState<SleeperUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlayersAndTeams = async () => {
      if (!state.isConnected || !state.currentLeague) {
        console.warn("Usuário desconectado ou nenhuma liga foi selecionada.");
        return;
      }

      setLoading(true);

      try {
        // Buscar os rosters, usuários e jogadores da liga
        const [rostersData, playersResponse, usersResponse] = await Promise.all([
          fetchRosters(state.currentLeague.league_id),
          fetchPlayers(),
          fetchUsers(state.currentLeague.league_id),
        ]);

        // Atualizar estados locais com os resultados
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

  // Buscar os jogadores do time selecionado
  const selectedTeamPlayers = selectedTeam
    ? rosters.find((roster) => roster.owner_id === selectedTeam)?.players || []
    : [];

  // Obter o nome do time baseado no usuário
  const getTeamName = (ownerId: string): string => {
    const user = users.find((u) => u.user_id === ownerId);
    return user?.metadata.team_name || user?.display_name || "Time Desconhecido";
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Jogadores por Time</h1>
        <p className="text-muted-foreground">Selecione um time para visualizar os jogadores</p>
      </div>

      <div className="mb-6">
        {/* Dropdown para seleção de times */}
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
      </div>

      {/* Lista de jogadores */}
      <Card>
        <CardHeader>
          <CardTitle>Jogadores</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span className="text-muted-foreground">Carregando jogadores...</span>
            </div>
          ) : !selectedTeam ? (
            <div className="text-center text-muted-foreground py-4">
              Selecione um time para visualizar os jogadores.
            </div>
          ) : selectedTeamPlayers.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              Este time não possui jogadores no momento.
            </div>
          ) : (
            <ScrollArea>
              <div className="space-y-3">
                {selectedTeamPlayers
                  .map((playerId) => playersData[playerId]) // Obter dados do jogador
                  .filter(Boolean) // Remover jogadores inválidos
                  .map((player) => (
                    <div key={player.player_id} className="p-3 border rounded-lg">
                      <h4 className="font-medium">
                        {player.first_name} {player.last_name}
                      </h4>
                      <div className="text-muted-foreground text-sm">
                        <span>{player.position || "Posição não disponível"}</span>
                        {player.team && (
                          <>
                            <span> • </span>
                            <span>{player.team}</span>
                          </>
                        )}
                      </div>

                      {/* Status, se disponível */}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {player.status || "Sem status"}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Players;