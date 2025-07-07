import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function SleeperAuth() {
  const [leagueId, setLeagueId] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

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
    
    // Esta funcionalidade será implementada com Supabase
    toast({
      title: "Atenção",
      description: "Integração com Sleeper requer configuração do Supabase",
    });
    
    setIsConnecting(false);
  };

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
            Requer integração com Supabase para acessar a API do Sleeper
          </p>
        </div>
      </CardContent>
    </Card>
  );
}