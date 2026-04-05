import * as  RdxDropdownMenu  from "@radix-ui/react-dropdown-menu";
import { cn } from "../lib/utils";


function DropdownMenuRoot({children}: {children: React.ReactNode}) {
  return(
    <RdxDropdownMenu.Root>
      {children}
    </RdxDropdownMenu.Root>
  );
}

function DropdownMenuTrigger({children}: {children: React.ReactNode}) {
  return(
    <RdxDropdownMenu.Trigger className="outline-none">
      {children}
    </RdxDropdownMenu.Trigger>
  );
}

interface DropdownMenuItemProps {
  children: React.ReactNode,
  className?: string,
  onSelect?: () => void
}

function DropdownMenuItem({children, className, onSelect}: DropdownMenuItemProps) {
  return(
    <RdxDropdownMenu.Item className={
      cn(
        "min-h-10 outline-none flex items-center text-sm py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer",
        className
      )}
      onSelect={onSelect}
    >
      {children}
    </RdxDropdownMenu.Item>
  );
}

interface DropdownMenuContentProps {
  children: React.ReactNode,
  className?: string
  isAlign?: "center" | "start" | "end"
}

function DropdownMenuContent({children, className, isAlign}: DropdownMenuContentProps) {
  return(
    <RdxDropdownMenu.Portal>
      <RdxDropdownMenu.Content 
        align={isAlign}
        className={cn(
          "rounded-2xl p-2 bg-white space-y-2 shadow-[0_11px_20px_0_rgba(0,0,0,0.10)] z-50",  
          "data-[side=bottom]:animate-slide-up-fade",
          "data-[side=top]:animate-slide-down-fade",
          className
        )}
      >
        {children}
      </RdxDropdownMenu.Content>
    </RdxDropdownMenu.Portal>
  );
}

export const DropdownMenu = {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem
}