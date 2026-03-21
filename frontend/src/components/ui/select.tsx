// src/components/ui/select.tsx

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";

// ── Context ──────────────────────────────────────────────────────────────────
interface SelectContextValue {
  value: string;
  onValueChange: (val: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  displayLabel: string;
  setDisplayLabel: (label: string) => void;
}

const SelectContext = React.createContext<SelectContextValue>({
  value: "",
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
  displayLabel: "",
  setDisplayLabel: () => {},
});

// ── Select (root) ────────────────────────────────────────────────────────────
interface SelectProps {
  value: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
}

function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [displayLabel, setDisplayLabel] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, displayLabel, setDisplayLabel }}>
      <div ref={ref} className="relative w-full">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

// ── SelectTrigger ────────────────────────────────────────────────────────────
interface SelectTriggerProps {
  className?: string;
  children: React.ReactNode;
}

function SelectTrigger({ className = "", children }: SelectTriggerProps) {
  const { open, setOpen } = React.useContext(SelectContext);

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`flex h-10 w-full items-center justify-between rounded-xl  border-[#DDD0BE] bg-[#FDFAF5] px-3 py-2 text-sm text-[#2C1A0E] outline-none transition hover:border-[#4A2E15]/40 focus:border-[#4A2E15] focus:ring-2 focus:ring-[#4A2E15]/10 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
      <ChevronDown className={`h-4 w-4 text-[#5C3D1E]/55 transition-transform duration-200 flex-shrink-0 ml-2 ${open ? "rotate-180" : ""}`} />
    </button>
  );
}

// ── SelectValue ──────────────────────────────────────────────────────────────
interface SelectValueProps {
  placeholder?: string;
}

function SelectValue({ placeholder }: SelectValueProps) {
  const { displayLabel } = React.useContext(SelectContext);

  return (
    <span className={`truncate ${!displayLabel ? "text-[#120801]" : ""}`}>
      {displayLabel || placeholder}
    </span>
  );
}

// ── SelectContent ────────────────────────────────────────────────────────────
interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

function SelectContent({ children, className = "" }: SelectContentProps) {
  const { open } = React.useContext(SelectContext);

  if (!open) return null;

  return (
    <div
      className={`absolute top-full left-0 z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-xl border border-[#EDE3D0] bg-white shadow-lg animate-in fade-in-0 zoom-in-95 ${className}`}
    >
      <div className="max-h-60 overflow-y-auto p-1">
        {children}
      </div>
    </div>
  );
}

// ── SelectItem ───────────────────────────────────────────────────────────────
interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

function SelectItem({ value, children, className = "" }: SelectItemProps) {
  const { value: selectedValue, onValueChange, setOpen, setDisplayLabel } = React.useContext(SelectContext);
  const isSelected = selectedValue === value;

  const handleClick = () => {
    onValueChange(value);
    setDisplayLabel(typeof children === "string" ? children : value);
    setOpen(false);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative flex cursor-pointer select-none items-center justify-between rounded-lg px-3 py-2 text-sm text-[#120801] transition-colors hover:bg-[#FDF6E3] hover:text-[#2C1A0E] ${isSelected ? "bg-[#F5EDD8] font-medium" : ""} ${className}`}
    >
      <span>{children}</span>
      {isSelected && <Check className="h-4 w-4 text-[#120801]" />}
    </div>
  );
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };