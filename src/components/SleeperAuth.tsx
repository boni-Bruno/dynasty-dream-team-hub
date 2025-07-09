import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSleeperData } from "@/hooks/useSleeperData";

export function SleeperAuth() {
  const [leagueId, setLeagueId] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const { state, connectToSleeper, disconnectFromSleeper } = useSleeperData();

  const handleConnect = async () => {
    if (!leagueId.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira o ID da liga",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    await connectToSleeper(leagueId.trim());
    setIsConnecting(false);
  };

  if (state.isConnected && state.currentLeague) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-green-600">✅ Liga Conectada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold">{state.currentLeague.name}</h3>
            <p className="text-sm text-muted-foreground">
              {state.currentLeague.total_rosters} times • {state.currentLeague.settings?.type}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Liga ID: {state.leagueId}
            </p>
          </div>
          
          <Button 
            onClick={disconnectFromSleeper}
            variant="outline"
            className="w-full mt-4"
          >
            Desconectar Liga
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Conectar ao Sleeper</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="league-id">ID da Liga Dynasty</Label>
          <Input
            id="league-id"
            placeholder="1181975218791636992"
            value={leagueId}
            onChange={(e) => setLeagueId(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Encontre o ID da sua liga na URL do Sleeper
          </p>
        </div>

        <Button 
          onClick={handleConnect} 
          className="w-full"
          disabled={isConnecting}
        >
          {isConnecting ? "Conectando..." : "Conectar Liga"}
        </Button>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Conecta via Supabase Edge Functions com a API do Sleeper
          </p>
        </div>
      </CardContent>
    </Card>
  );
}