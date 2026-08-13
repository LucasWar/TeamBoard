import * as  RdxPopover  from "@radix-ui/react-popover";
import { cn } from "../lib/utils";

function PopoverRoot({children}: {children: React.ReactNode}) {
  return(
    <RdxPopover.Root>
      {children}
    </RdxPopover.Root>
  );
}

interface PopoverTriggerProps {
  children: React.ReactNode,
  className?: string
}

function PopoverTrigger({children, className}: PopoverTriggerProps) {
  return(
    <RdxPopover.Trigger className={cn("outline-none", className)}>
      {children}
    </RdxPopover.Trigger>
  );
}

interface PopoverItemProps {
  children: React.ReactNode,
  className?: string,
  onSelect?: () => void
}

interface PopoverContentProps {
  children: React.ReactNode,
  className?: string
  isAlign?: "center" | "start" | "end"
}

function PopoverContent({children, className, isAlign}: PopoverContentProps) {
  return(
    <RdxPopover.Portal>
      <RdxPopover.Content 
        align={isAlign}
        className={cn(
          "rounded-2xl p-2  bg-white space-y-2 shadow-[0_11px_20px_0_rgba(0,0,0,0.10)] z-50",  
          "data-[side=bottom]:animate-slide-up-fade",
          "data-[side=top]:animate-slide-down-fade",
          className
        )}
      >
        {children}
      </RdxPopover.Content>
    </RdxPopover.Portal>
  );
}

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
}