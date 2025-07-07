import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Players = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Avaliação de Jogadores</h1>
        <p className="text-muted-foreground">Pesquise estatísticas e projeções de jogadores</p>
      </div>

      <div className="mb-6">
        <Input 
          placeholder="Buscar jogadores..." 
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Jogadores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Lista de jogadores será carregada após conexão com Sleeper
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Posição</p>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="text-sm text-muted-foreground">Idade</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Favoritos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Seus jogadores marcados
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Players;