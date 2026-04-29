import { useOrganization } from '../../../app/hooks/useOrganization';
import { DeleteOrganizationModal } from './modalDeleteOrganization';
import { OrganizationModal } from './modalOrganization';
import { OrganizationCard } from './OrganizationCard';
import { useOrganizationController } from './useOrganizationCotroller';


export function MyOrganizations() {
  const { organizations, changeOrganization, selectedOrganization } = useOrganization();
  const { handleCloseOrganizationModal, openOrganizationModal, handleCreateProject, handleEditProject, selectedOrganizationData, handleSelectOrganization, selectedOrganizationEditId, confirmDelete, openOrganizationDeleteModal, handleCloseOrganizationDeleteModal, handleOpenOrganizationDeleteModal} = useOrganizationController()
  return (
    <>
      <OrganizationModal 
        open={openOrganizationModal}
        onClose={handleCloseOrganizationModal}
        organizationData={selectedOrganizationData}
        organizationId={selectedOrganizationEditId}
      />
      <DeleteOrganizationModal 
        onConfirm={confirmDelete}
        open={openOrganizationDeleteModal}
        onClose={handleCloseOrganizationDeleteModal}
      /> 
      <div className="p-8 w-full">
        <header className="flex justify-between items-center mb-8 ">
          <div>
            <h1 className="text-2xl font-bold">Minhas Organizações</h1>
            <p className="text-gray-500">Gerencie seus espaços de trabalho</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleCreateProject}>
            + Nova Organização
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {organizations.map((org) => (
            <OrganizationCard 
              name={org.name}
              organizationId={org.organizationId}
              role={org.role}
              onChange={changeOrganization}
              isSelectedOrganization={selectedOrganization!}
              onEdit={handleEditProject}
              onSelectId={handleSelectOrganization}
              onDelete={handleOpenOrganizationDeleteModal}
            />
          ))}
        </div>
      </div>
    </>
  );
}