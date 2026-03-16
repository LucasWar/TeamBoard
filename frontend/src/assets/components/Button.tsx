import type { ComponentProps } from "react";

interface ButtonProps extends ComponentProps<'button'> {}

export function Button (props: ButtonProps) {
  return (
    <button 
      {...props} 
      className="bg-secondary-bg hover:bg-button-secondary-hover disabled:bg-gray-100 px-6 h-12 rounded-2xl font-medium text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
    />
  )
}