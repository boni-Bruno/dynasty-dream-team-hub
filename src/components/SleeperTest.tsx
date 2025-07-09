import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export function SleeperTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<string>("");

  const testSleeperConnection = async () => {
    setTesting(true);
    setResult("");
    
    try {
      console.log("Testing Sleeper connection...");
      
      // Test with a known league ID (you can change this)
      const testLeagueId = "1181975218791636992";
      
      console.log("Calling sleeper-league function with:", testLeagueId);
      
      const { data, error } = await supabase.functions.invoke('sleeper-league', {
        body: { leagueId: testLeagueId }
      });

      console.log("Function response:", { data, error });

      if (error) {
        setResult(`Erro: ${error.message}`);
        return;
      }

      if (data && data.name) {
        setResult(`Sucesso! Liga encontrada: ${data.name}`);
      } else if (data && data.error) {
        setResult(`Erro da API: ${data.error}`);
      } else {
        setResult("Resposta inesperada da API");
      }
      
    } catch (error) {
      console.error("Test error:", error);
      setResult(`Erro no teste: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Teste de Conexão Sleeper</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testSleeperConnection} 
          disabled={testing}
          className="w-full"
        >
          {testing ? "Testando..." : "Testar Conexão"}
        </Button>
        
        {result && (
          <div className="p-3 border rounded-lg">
            <p className="text-sm">{result}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}