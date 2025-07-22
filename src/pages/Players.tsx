import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useSleeperData } from "@/hooks/useSleeperData"; // Lida com os dados do Sleeper
import { SleeperPlayer, SleeperRoster, SleeperUser } from "@/types/sleeper";

// Grupos de posições (utilizado no filtro de posição)
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

// Anos fixos para exibição de pontuações
const YEARS = [2025, 2024, 2023, 2022, 2021, 2020];

const Players = () => {
  const { state, fetchRosters, fetchPlayers, fetchUsers } = useSleeperData();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null); // Time selecionado
  const [selectedPosition, setSelectedPosition] = useState<string>("all"); // Posição selecionada
  const [playersData, setPlayersData] = useState<Record<string, SleeperPlayer>>({});
  const [rosters, setRosters] = useState<SleeperRoster[]>([]);
  const [users, setUsers] = useState<SleeperUser[]>([]);
  const [loading, setLoading] = useState(true); // Loading global para carregar dados

  /** ============================
   * Load Players, Teams, and Users
   * =========================== */
  useEffect(() => {
    const loadPlayersAndTeams = async () => {
      if (!state.isConnected || !state.currentLeague) return;

      setLoading(true); // Ativa loading

      try {
        // Faz múltiplas requisições ao backend: times, jogadores e usuários
        const [rostersData, playersResponse, usersResponse] = await Promise.all([
          fetchRosters(state.currentLeague.league_id), // Pega os times
          fetchPlayers(), // Pega os jogadores
          fetchUsers(state.currentLeague.league_id), // Pega os usuários associados
        ]);

        console.log("🎯 Jogadores Recebidos do Backend:", playersResponse);
        setRosters(rostersData || []);
        setUsers(usersResponse || []);
        setPlayersData(playersResponse || {});
      } catch (error) {
        console.error("❌ Erro ao carregar dados do Sleeper:", error);
      } finally {
        setLoading(false); // Termina o loading
      }
    };

    loadPlayersAndTeams();
  }, [state.isConnected, state.currentLeague, fetchRosters, fetchPlayers, fetchUsers]);

  /** ============================
   * Filtros de Times e Posições
   * =========================== */
  // Jogadores filtrados pelo time
  const selectedTeamPlayers = selectedTeam
    ? rosters.find((roster) => roster.owner_id === selectedTeam)?.players || []
    : [];

  // Jogadores filtrados pela posição
  const filteredPlayers = useMemo(() => {
    if (selectedPosition === "all") {
      return selectedTeamPlayers; // Todos os jogadores
    }
    const allowedPositions = positionGroups[selectedPosition] || []; // Apenas posições permitidas
    return selectedTeamPlayers.filter(
      (playerId) => playersData[playerId] && allowedPositions.includes(playersData[playerId].position)
    );
  }, [selectedTeamPlayers, selectedPosition, playersData]);

  /** ============================
   * Helper: Nome dos Times
   * =========================== */
  const getTeamName = (ownerId: string): string => {
    const user = users.find((u) => u.user_id === ownerId); // Encontra o dono do time
    return user?.metadata?.team_name || user?.display_name || "Nome do Time Indisponível";
  };

  /** ============================
   * Helper: Pontuações do Jogador
   * =========================== */
  const getPlayerScores = (playerId: string) => {
    const scores = playersData[playerId]?.scores || {}; // Pega as pontuações do jogador
    return YEARS.map((year) => scores[year] || "N/A"); // Retorna as pontuações ou exibe "N/A"
  };

  /** ============================
   * Renderização
   * =========================== */
  return (
    <div className="container mx-auto p-6">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Jogadores por Time</h1>
        <p className="text-muted-foreground">
          Selecione um time e uma posição para visualizar os jogadores e suas pontuações.
        </p>
      </div>

      {/* Seleção de Filtros (Times e Posições) */}
      <div className="mb-6 space-y-4">
        {loading ? (
          <div className="flex items-center text-muted-foreground gap-2">
            <Loader2 className="animate-spin h-6 w-6" />
            Carregando times e jogadores...
          </div>
        ) : (
          <>
            {/* Dropdown: Seleção do Time */}
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

            {/* Dropdown: Seleção da Posição */}
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
          </>
        )}
      </div>

      {/* Listagem dos Jogadores */}
      <Card>
        <CardHeader>
          <CardTitle>Jogadores ({filteredPlayers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-muted-foreground ml-2">Carregando jogadores...</span>
            </div>
          ) : filteredPlayers.length === 0 ? (
            <div className="text-center text-muted-foreground py-6">
              Nenhum jogador encontrado para os critérios selecionados.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPlayers.map((playerId) => {
                const player = playersData[playerId];
                if (!player) return null;

                return (
                  <div key={player.player_id} className="p-3 border rounded-lg flex justify-between items-center">
                    {/* Informações do Jogador */}
                    <div>
                      <h4 className="font-medium">
                        {player.first_name} {player.last_name}
                      </h4>
                      <div className="text-muted-foreground text-sm">
                        <span>{player.position || "Posição não disponível"}</span>
                      </div>
                    </div>

                    {/* Pontuações do Jogador */}
                    <div className="flex space-x-4">
                      {getPlayerScores(player.player_id).map((score, index) => (
                        <div key={YEARS[index]} className="text-center">
                          <span className="block font-medium">{YEARS[index]}</span>
                          <span className="text-muted-foreground text-sm">{score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Players;