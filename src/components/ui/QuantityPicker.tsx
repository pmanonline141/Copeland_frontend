"use client";
import { MinusIcon, PlusIcon, TrashIcon } from "./icons";
import { cn } from "@/utils/cn";

interface QuantityPickerProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityPicker({
  value,
  onChange,
  min = 1,
  max,
  className,
}: QuantityPickerProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (max === undefined || value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className={cn("flex items-center gap-1 rounded-lg border border-line p-1", className)}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min && min > 0}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-mist disabled:opacity-30",
          value === 1 && "text-ink-faint hover:text-error hover:bg-error/5"
        )}
        aria-label={value === 1 ? "Remove item" : "Decrease quantity"}
      >
        {value === 1 ? <TrashIcon className="h-4 w-4" /> : <MinusIcon className="h-4 w-4" />}
      </button>
      
      <span className="min-w-[2rem] text-center text-sm font-semibold text-ink">
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={max !== undefined && value >= max}
        className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-mist disabled:opacity-30"
        aria-label="Increase quantity"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
