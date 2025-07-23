import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useSleeperData } from "@/hooks/useSleeperData";
import { SleeperPlayer, SleeperRoster, SleeperUser } from "@/types/sleeper";

// Agrupamento de posições usado no seletor
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

// Define o ano fixo que será apresentado na página
const YEAR = 2024;

// Função para buscar pontuações no Fleaflicker
const fetchFleaflickerFPTS = async (leagueId: string, year: number) => {
  const weeks = 18; // Número máximo de semanas
  const totalFPTS: Record<string, number> = {};

  try {
    for (let week = 1; week <= weeks; week++) {
      // URL para buscar pontuação semanal
      const url = `https://api.fleaflicker.com/FetchLeagueScoreboard?sport=NFL&league_id=${leagueId}&season=${year}&scoring_period=${week}`;
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Erro ao buscar pontuações da semana ${week}:`, response.statusText);
        continue;
      }

      const data = await response.json();
      if (!data.games) continue;

      // Itera por todos os jogos da semana e soma os pontos
      for (const game of data.games) {
        const fantasyGameId = game.fantasy_game_id;

        // Busca detalhes do jogo
        const boxscoreUrl = `https://api.fleaflicker.com/FetchLeagueBoxscore?sport=NFL&league_id=${leagueId}&season=${year}&fantasy_game_id=${fantasyGameId}`;
        const boxscoreResponse = await fetch(boxscoreUrl);
        if (!boxscoreResponse.ok) continue;

        const boxscoreData = await boxscoreResponse.json();
        const addFPTS = (players: any[]) => {
          players.forEach((player) => {
            totalFPTS[player.player_id] = (totalFPTS[player.player_id] || 0) + player.fpts;
          });
        };

        // Soma pontos do time da casa e do visitante
        addFPTS(boxscoreData.home_team.players);
        addFPTS(boxscoreData.away_team.players);
      }
    }

    return totalFPTS;
  } catch (error) {
    console.error("Erro ao buscar dados do Fleaflicker:", error);
    return {};
  }
};

const Players = () => {
  const { state, fetchRosters, fetchPlayers, fetchUsers } = useSleeperData();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string>("all");
  const [playersData, setPlayersData] = useState<Record<string, SleeperPlayer>>({});
  const [rosters, setRosters] = useState<SleeperRoster[]>([]);
  const [users, setUsers] = useState<SleeperUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [fleaflickerFPTS, setFleaflickerFPTS] = useState<Record<string, number>>({});

  // Carregar informações dos jogadores e times
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

  // Carregar FPTS diretamente do Fleaflicker
  useEffect(() => {
    const loadFleaflickerFPTS = async () => {
      if (!state.currentLeague) return;

      const fleaflickerData = await fetchFleaflickerFPTS(state.currentLeague.league_id, YEAR);
      setFleaflickerFPTS(fleaflickerData);
    };

    if (!loading) loadFleaflickerFPTS();
  }, [state.currentLeague, loading]);

  // Filtrar jogadores pelo time selecionado
  const selectedTeamPlayers = selectedTeam
    ? rosters.find((roster) => roster.owner_id === selectedTeam)?.players || []
    : [];

  // Aplicar filtros (posição) nos jogadores
  const filteredPlayers = useMemo(() => {
    if (selectedPosition === "all") {
      return selectedTeamPlayers;
    }
    const allowedPositions = positionGroups[selectedPosition] || [];
    return selectedTeamPlayers.filter(
      (playerId) => playersData[playerId] && allowedPositions.includes(playersData[playerId].position)
    );
  }, [selectedTeamPlayers, selectedPosition, playersData]);

  // Obter o nome do time
  const getTeamName = (ownerId: string): string => {
    const user = users.find((u) => u.user_id === ownerId);
    return user?.metadata.team_name || user?.display_name || "Nome do Time Indisponível";
  };

  // Obter os pontos do jogador para o ano de 2024 (FPTS)
  const getPlayerFPTS = (playerId: string) => {
    // Se os dados da Fleaflicker estiverem disponíveis
    if (fleaflickerFPTS[playerId] !== undefined) {
      return `${fleaflickerFPTS[playerId]} FPTS`;
    }

    // Caso contrário, busque nos dados do Sleeper
    const stats = playersData[playerId]?.stats || {};
    return stats[YEAR] ? `${stats[YEAR].fpts || "N/A"} FPTS` : "N/A";
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Jogadores por Time</h1>
        <p className="text-muted-foreground">Selecione um time e posição para visualizar os jogadores e suas pontuações para {YEAR}.</p>
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
                    {/* Informações do jogador */}
                    <div>
                      <h4 className="font-medium">
                        {player.first_name} {player.last_name}
                      </h4>
                      <div className="text-muted-foreground text-sm">
                        <span>{player.position || "Posição não disponível"}</span>
                      </div>
                    </div>

                    {/* Pontuações do jogador */}
                    <div className="flex space-x-6">
                      <div className="text-center">
                        <span className="block font-medium">{YEAR}</span> {/* Ano */}
                        <span className="text-muted-foreground text-sm">{getPlayerFPTS(player.player_id)}</span> {/* FPTS */}
                      </div>
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