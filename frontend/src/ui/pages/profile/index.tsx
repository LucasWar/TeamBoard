import { Modal } from '../../../components/Modal';
import type { User } from '../../../app/interfaces/user';
import { Controller } from 'react-hook-form';
import { ImageInput } from '../../../components/imageInput';
import { useProfileController } from './profileController';
import { ChangePassword } from './components/changePassword';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  const {
    changePassword,
    control,
    handleSwitchChangePassword,
    register,
    handleUpdateProfile,
    isLoading 
  } = useProfileController(user, onClose)

  return (
    <Modal open={isOpen} title="Editar perfil" onClose={onClose}>  
        {
          !changePassword ? (
            <>
              <form className="p-6 space-y-5"  key="profile-form" onSubmit={handleUpdateProfile}>
                <div className="flex flex-col items-center gap-4 mb-2">
                  <div className="flex items-center justify-center">
                    <Controller
                      name="avatar"
                      control={control}
                      render={({ field }) => (
                        <ImageInput
                          className="size-25"
                          value={field.value}
                          preview={user!.avatar}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    Alterar foto
                  </button>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço de E-mail
                  </label>
                  <input
                    {...register('email')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="flex justify-between gap-3 pt-4 border-t border-gray-100 mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-25"
                  >
                    {isLoading ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
                <div className='flex justify-center items-center'> 
                  <p className="text-sm text-blue-400 mt-1 cursor-pointer" onClick={() => handleSwitchChangePassword()}>
                    Alterar senha
                  </p>
                </div>
              </form>  
            </>
          ) : (
            <ChangePassword 
              handleSwitchChangePasswordPage={handleSwitchChangePassword}
              isLoading={isLoading}
              onClose={onClose}
            />
          )
        } 
    </Modal>      
  );
}