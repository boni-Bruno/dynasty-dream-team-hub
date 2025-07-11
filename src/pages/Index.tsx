import { LeagueDashboard } from "@/components/LeagueDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Dynasty Fantasy Football Manager</h1>
          <p className="text-xl text-muted-foreground">Liga Dynasty - Informações em Tempo Real</p>
        </div>
        
        <LeagueDashboard />
      </div>
    </div>
  );
};

export default Index;
