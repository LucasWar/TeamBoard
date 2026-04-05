import { Spinner } from "../../../../../assets/components/Spinner"
import { useIndicatorController } from "./indicatorsController"

export function Indicators(){
  const {mykips, isFetchingMykips} = useIndicatorController()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm border-t-4 border-t-red-500">
        <h3 className="text-sm font-medium text-gray-500">Tarefas Atrasadas</h3>
        {!isFetchingMykips ? <p className="text-3xl font-bold text-gray-800 mt-2">{mykips!.late}</p> : <Spinner />}
        
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm border-t-4 border-t-yellow-400">
        <h3 className="text-sm font-medium text-gray-500">Vencem Hoje</h3>
        {!isFetchingMykips ? <p className="text-3xl font-bold text-gray-800 mt-2">{mykips!.forToday}</p> : <Spinner />}
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm border-t-4 border-t-green-500">
        <h3 className="text-sm font-medium text-gray-500">Concluídas na Semana</h3>
        {!isFetchingMykips ? <p className="text-3xl font-bold text-gray-800 mt-2">{mykips!.complets}</p> : <Spinner />}
      </div>
    </div>
  )
}