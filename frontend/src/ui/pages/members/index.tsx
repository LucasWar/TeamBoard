import { useControllerMembers } from './useControllerMembers';
import { AddMemberModal } from './addMember';
import { useOrganization } from '../../../app/hooks/useOrganization';
import { roleMap } from '../../../app/utils/roleMap';
import { cn } from '../../../app/utils/cn';
import { Spinner } from '../../../assets/components/Spinner';

export function Members() {
  const { data: members, handleOpenModal, handleCloseModal, openModal, isPending } = useControllerMembers()
  const { currentRole } = useOrganization()

  const canManageMembers = currentRole === 'ADMIN' || currentRole === 'MANAGER';

  if(isPending) {
    return <Spinner />
  }

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <AddMemberModal 
        onClose={handleCloseModal}
        open={openModal}
      />
      {/* CABEÇALHO */}
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Membros da Equipe</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie os acessos e permissões da sua organização.</p>
        </div>
        
        {/* RBAC NA PRÁTICA: O botão só existe se o usuário tiver permissão */}
        {canManageMembers && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm" onClick={() => handleOpenModal()}>
            + Convidar Membro
          </button>
        )}
      </header>

      {/* TABELA DE MEMBROS */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* Cabeçalho da Tabela */}
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Cargo</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            {
              members && (
                <tbody className="divide-y divide-gray-100">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {member.avatar ? (
                            <img src={`${import.meta.env.VITE_BASE_URL}/uploads/users/${member.avatar}`} alt={member.name} className="w-10 h-10 rounded-full border border-gray-200" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold">
                              {member.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={cn(`text-xs font-bold px-2.5 py-1 rounded-md`, roleMap[member.role].classNameStatus)}>
                          {roleMap[member.role].label}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {member.status === 'ACTIVE' ? (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full w-max">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Ativo
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-yellow-700 bg-yellow-50 px-2.5 py-1 rounded-full w-max">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                            Pendente
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {canManageMembers && (
                          <button className="text-gray-400 hover:text-blue-600 font-medium text-sm transition-colors">
                            Remover
                          </button>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              )
            }
          </table>
        </div>
      </div>
    </div>
  );
}