import { useChangePasswordController } from "./changePasswordController"

interface ChangePasswordProps{
  handleSwitchChangePasswordPage: () => void
  onClose: () => void
  isLoading: boolean
}

export function ChangePassword({handleSwitchChangePasswordPage, onClose, isLoading}: ChangePasswordProps){

  const { handleSubmit, register, errors } = useChangePasswordController(onClose)

  return(
    <>
      <form className="p-6 space-y-5" key="password-form" onSubmit={handleSubmit}>
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Senha Atual
          </span>
          <input      
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            required
            {...register("oldPassword")}
          />
           {errors?.oldPassword && <span className="text-primary-red">{errors?.oldPassword.message}</span>}
        </div>

        <div>
          <span className="text-sm font-medium text-gray-700 mb-1">
            Nova Senha
          </span>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            required
            {...register("newPassword")}
          />
          {errors?.newPassword && <span className="text-primary-red">{errors?.newPassword.message}</span>}
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
          <p className="text-sm text-blue-400 mt-1 cursor-pointer" onClick={() => handleSwitchChangePasswordPage()}>
            Alterar meus dados
          </p>
        </div>
      </form>  
    </>
  )
}