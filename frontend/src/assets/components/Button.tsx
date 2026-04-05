import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";
import { Spinner } from "./Spinner";

interface ButtonProps extends ComponentProps<'button'> {
  isLoading?: boolean
}

export function Button ({className, children, isLoading, ...props}: ButtonProps) {
  return (
    <button 
      {...props} 
      className={cn("bg-secondary-bg hover:bg-button-secondary-hover disabled:bg-gray-100 px-6 h-12 rounded-2xl font-medium text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-all", className)}
    >
      {!isLoading && children}
      {isLoading && <Spinner />}
    </button>

  )
}