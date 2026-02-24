import React from 'react';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  CheckboxProps
>(({ checked = false, onChange, label, disabled = false, className = '', id }, ref) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="appearance-none w-5 h-5 rounded border border-forge-border bg-black/40 cursor-pointer transition-colors hover:border-forge-accent/50 checked:bg-forge-accent checked:border-forge-accent disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {checked && (
          <svg
            className="absolute inset-0 w-5 h-5 text-black pointer-events-none flex items-center justify-center"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      {label && (
        <label
          htmlFor={id}
          className="text-sm text-slate-300 cursor-pointer select-none"
        >
          {label}
        </label>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
