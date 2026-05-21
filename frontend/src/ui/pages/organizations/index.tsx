import { Plus, SearchIcon } from 'lucide-react';
import { useOrganization } from '../../../app/hooks/useOrganization';
import { DeleteOrganizationModal } from './modalDeleteOrganization';
import { OrganizationModal } from './modalOrganization';
import { OrganizationCard } from './OrganizationCard';
import { useOrganizationController } from './useOrganizationCotroller';
import Pagination from '../../../assets/components/Pagination';

export function MyOrganizations() {
  const {
    selectedOrganization,
  } = useOrganization();
 
  const {
    pagination,
    organizations,
    setSearchTerm,
    searchTerm,
    handleCloseOrganizationModal,
    openOrganizationModal,
    handleCreateProject,
    handleEditProject,
    selectedOrganizationData,
    handleSelectOrganization,
    selectedOrganizationEditId,
    confirmDelete,
    openOrganizationDeleteModal,
    handleCloseOrganizationDeleteModal,
    handleOpenOrganizationDeleteModal ,
    handleChangeOrganizationLocal,
    filter,
    handlePageChange,
  } = useOrganizationController()

  return (
    <div className='flex-1'>
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
      <div className="p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Minhas Organizações</h1>
            <p className="text-gray-500">Gerencie seus espaços de trabalho</p>
          </div>
        </header>

        <div className='flex justify-between mb-2'>
          <div className="relative bg-white border-2 border-gray-200 w-1/2 lg:w-1/4 ">
            <SearchIcon className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />

            <input
              className="border pl-8 pr-2 text-lg w-full h-full"
              placeholder="Pesquisar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hidden lg:flex" onClick={handleCreateProject}>
            + Nova Organização
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {organizations.map((org) => (
            <OrganizationCard 
              key={org.organizationId}
              name={org.name}
              organizationId={org.organizationId}
              role={org.role}
              onChange={handleChangeOrganizationLocal}
              isSelectedOrganization={selectedOrganization!}
              onEdit={handleEditProject}
              onSelectId={handleSelectOrganization}
              onDelete={handleOpenOrganizationDeleteModal}
            />
          ))}
        </div>
      </div>
       {pagination && pagination.total > 1 &&
          <Pagination 
            currentPage={filter.page}
            totalPages={pagination.total}
            onPageChange={handlePageChange}
          />
        }
        <button className="flex fixed bottom-3 right-3 bg-blue-600 p-3 rounded-full text-white lg:hidden" onClick={() => handleCreateProject()}>
          <Plus />
        </button>
    </div>
  );
}