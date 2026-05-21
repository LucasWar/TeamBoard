import { useSummary } from "../../../app/hooks/useSummary"
import { getTimeDifference } from "../../../app/utils/getTimeDifference"

export function TeamActivity() {
  const { data:teamActivities } = useSummary()
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Atividade da Equipe</h2>
      <div className="relative border-l border-gray-200 ml-3 space-y-6">
        {
          teamActivities ? teamActivities.map((teamActivitie) => (
            <div className="pl-4 relative" key={teamActivitie.id}>
              <div className="w-3 h-3 bg-blue-500 rounded-full absolute -left-[6.5px] top-1.5 ring-4 ring-white"></div>
              <p className="text-sm text-gray-800"><strong>{teamActivitie.actor}</strong> {teamActivitie.description}.</p>
              <span className="text-xs text-gray-400">Há {getTimeDifference(teamActivitie.createdAt)}</span>
            </div>
          )) : <div>Teste</div>
        }
      </div>
    </div>
  )
}