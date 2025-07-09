import { SleeperAuth } from "@/components/SleeperAuth";
import { SleeperTest } from "@/components/SleeperTest";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Dynasty Fantasy Football Manager</h1>
          <p className="text-xl text-muted-foreground">Conecte-se ao Sleeper para gerenciar sua liga dynasty</p>
        </div>
        
        <div className="space-y-8">
          <SleeperAuth />
          <SleeperTest />
        </div>
      </div>
    </div>
  );
};

export default Index;
