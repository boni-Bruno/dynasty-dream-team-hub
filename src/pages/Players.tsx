import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useMemo } from "react";
import { useSleeperData } from "@/hooks/useSleeperData";
import { SleeperPlayer } from "@/types/sleeper";
import { Loader2, Search, User } from "lucide-react";

const Players = () => {
  const { state, fetchPlayers } = useSleeperData();
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [players, setPlayers] = useState<Record<string, SleeperPlayer>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPlayers = async () => {
      if (state.isConnected) {
        setLoading(true);
        try {
          const playersData = await fetchPlayers();
          setPlayers(playersData || {});
        } catch (error) {
          console.error("Erro ao carregar jogadores:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadPlayers();
  }, [state.isConnected, fetchPlayers]);

  const filteredPlayers = useMemo(() => {
    return Object.values(players).filter((player) => {
      const matchesSearch = !searchTerm || 
        `${player.first_name} ${player.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPosition = positionFilter === "all" || player.position === positionFilter;
      const matchesTeam = teamFilter === "all" || player.team === teamFilter;
      
      return matchesSearch && matchesPosition && matchesTeam;
    });
  }, [players, searchTerm, positionFilter, teamFilter]);

  const positions = useMemo(() => {
    const pos = new Set(Object.values(players).map(p => p.position).filter(Boolean));
    return Array.from(pos).sort();
  }, [players]);

  const teams = useMemo(() => {
    const teamSet = new Set(Object.values(players).map(p => p.team).filter(Boolean));
    return Array.from(teamSet).sort();
  }, [players]);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Avaliação de Jogadores</h1>
        <p className="text-muted-foreground">Pesquise estatísticas e projeções de jogadores</p>
      </div>

      <div className="mb-6 flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar jogadores..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={positionFilter} onValueChange={setPositionFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Posição" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {positions.map(pos => (
              <SelectItem key={pos} value={pos}>{pos}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={teamFilter} onValueChange={setTeamFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {teams.map(team => (
              <SelectItem key={team} value={team}>{team}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Lista de Jogadores ({filteredPlayers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!state.isConnected ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Conecte-se ao Sleeper para ver os jogadores
                  </p>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span className="text-muted-foreground">Carregando jogadores...</span>
                </div>
              ) : filteredPlayers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {searchTerm || positionFilter !== "all" || teamFilter !== "all" 
                      ? "Nenhum jogador encontrado com os filtros aplicados"
                      : "Nenhum jogador encontrado"
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredPlayers.slice(0, 50).map((player) => (
                    <div key={player.player_id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-medium">
                            {player.first_name} {player.last_name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{player.team || "N/A"}</span>
                            {player.position && (
                              <>
                                <span>•</span>
                                <Badge variant="outline" className="text-xs">
                                  {player.position}
                                </Badge>
                              </>
                            )}
                            {player.age && (
                              <>
                                <span>•</span>
                                <span>{player.age} anos</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {player.injury_status && (
                          <Badge variant="destructive" className="text-xs">
                            {player.injury_status}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {player.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {filteredPlayers.length > 50 && (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      Mostrando primeiros 50 de {filteredPlayers.length} jogadores
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total de Jogadores:</span>
                  <span className="font-medium">{Object.keys(players).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Filtrados:</span>
                  <span className="font-medium">{filteredPlayers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Posições:</span>
                  <span className="font-medium">{positions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Times:</span>
                  <span className="font-medium">{teams.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conexão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${state.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm">
                  {state.isConnected ? 'Conectado ao Sleeper' : 'Desconectado'}
                </span>
              </div>
              {state.currentLeague && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    {state.currentLeague.name}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Players;