import * as RdxSelect from "@radix-ui/react-select";
import { cn } from "../lib/utils";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";

// ROOT
function SelectRoot({ children, defaultValue, onValueChange, ...props }: any) {
  return <RdxSelect.Root onValueChange={onValueChange} defaultValue={defaultValue} {...props}>{children}</RdxSelect.Root>;
}

// TRIGGER
function SelectTrigger({ children, className }: any) {
  return (
    <RdxSelect.Trigger
      className={cn(
        "h-10 w-35 px-4 bg-white text-sm flex items-center justify-between gap-2",
        "hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200",
        className
      )}
    >
      {children}
      <RdxSelect.Icon>
        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
      </RdxSelect.Icon>
    </RdxSelect.Trigger>
  );
}

// VALUE
function SelectValue({ placeholder }: { placeholder?: string }) {
  return <RdxSelect.Value placeholder={placeholder} />;
}

// CONTENT
function SelectContent({ children, className }: any) {
  return (
    <RdxSelect.Portal>
      <RdxSelect.Content
        side="bottom"
        position="popper"
        className={cn(
          "bg-white rounded-xl shadow-md p-2 z-50",
          "data-[side=bottom]:animate-slide-up-fade",
          "data-[side=top]:animate-slide-down-fade",
          className
        )}
      >
        <RdxSelect.Viewport className="space-y-1">
          {children}
        </RdxSelect.Viewport>
      </RdxSelect.Content>
    </RdxSelect.Portal>
  );
}

// ITEM
function SelectItem({ children, value, className }: any) {
  return (
    <RdxSelect.Item
      value={value}
      className={cn(
        "flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer",
        "text-gray-700 hover:bg-gray-100",
        "data-[state=checked]:bg-gray-100 data-[state=checked]:font-medium",
        "outline-none",
        className
      )}
    >
      <RdxSelect.ItemText>{children}</RdxSelect.ItemText>

      <RdxSelect.ItemIndicator>
        <CheckIcon className="w-4 h-4" />
      </RdxSelect.ItemIndicator>
    </RdxSelect.Item>
  );
}

// EXPORT PADRÃO IGUAL AO SEU
export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Content: SelectContent,
  Item: SelectItem,
};