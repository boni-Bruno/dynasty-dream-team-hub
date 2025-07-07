import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SleeperAuth } from "@/components/SleeperAuth";

const Dashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dynasty Hub</h1>
        <p className="text-muted-foreground">Gerencie sua liga dynasty com estratégia</p>
      </div>

      <div className="mb-8">
        <SleeperAuth />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Seu Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Conecte-se ao Sleeper para ver seu roster</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Próximo Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Picks futuros e posições</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Liga</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Status da liga e eventos</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card rounded-lg p-6 border">
        <h2 className="text-xl font-semibold mb-4">Eventos Recentes</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
            <span className="text-sm">Integração com Sleeper necessária</span>
            <span className="text-xs text-muted-foreground">Aguardando conexão</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;