import { Badge } from "@/components/ui/badge";
import { useSleeperData } from "@/hooks/useSleeperData";

export function ConnectionStatus() {
  const { state } = useSleeperData();
  const isConnected = state.isConnected;

  return (
    <div className="p-3 border-t">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-xs text-muted-foreground">
          {isConnected ? 'Sleeper Conectado' : 'Desconectado'}
        </span>
      </div>
      {isConnected && state.currentLeague && (
        <Badge variant="outline" className="mt-2 text-xs">
          {state.currentLeague.name}
        </Badge>
      )}
      {!isConnected && (
        <Badge variant="outline" className="mt-2 text-xs">
          Não Conectado
        </Badge>
      )}
    </div>
  );
}