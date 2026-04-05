import { forwardRef, type ComponentProps } from "react"
interface InputProps extends ComponentProps<'input'> {
  name: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({name, className, placeholder, id,error, ...props}, ref) => {
  const inputId = id ?? name;
  return (
    <div className="relative">
      <input 
        ref={ref}
        name={name}
        id={inputId}
        {...props}
        className="bg-white w-full rounded-lg border border-gray-500 px-3 pt-4 h-13 text-gray-800 peer placeholder-shown:pt-0 focus:border-gray-800 transition-all"
        placeholder=" "
      /> 
      <label 
        htmlFor={inputId} 
        className="absolute text-xs left-3.25 top-2 pointer-events-none text-gray-700 peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 transition-all"
      >
        {placeholder}
      </label>
      {error && <span className="text-primary-red">{error}</span>}
    </div>
  )
})