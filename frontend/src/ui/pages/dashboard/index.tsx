import { useAuth } from '../../../app/hooks/useAuth';
import { Indicators } from './components/indicators/Indicators';
import { NextTask } from './components/NextTask';
import { TeamActivity } from './teamActivity';

export function Dashboard() {
  const { user } = useAuth()
  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Olá, {user.name} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Aqui está o resumo do seu dia na Minha Organização.</p>
      </header>

      <Indicators />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        <NextTask />

        <div className="xl:col-span-1 space-y-8">
          
          <TeamActivity />
        </div>
      </div>
    </div>
  );
}