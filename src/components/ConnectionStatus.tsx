import { Badge } from "@/components/ui/badge";

export function ConnectionStatus() {
  const isConnected = false; // Será controlado por contexto/estado global depois

  return (
    <div className="p-3 border-t">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-xs text-muted-foreground">
          {isConnected ? 'Sleeper Conectado' : 'Desconectado'}
        </span>
      </div>
      {!isConnected && (
        <Badge variant="outline" className="mt-2 text-xs">
          Requer Supabase
        </Badge>
      )}
    </div>
  );
}