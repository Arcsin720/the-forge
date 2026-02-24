import React, { useState, useRef, useEffect } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const Select = React.forwardRef<
  HTMLDivElement,
  SelectProps
>(({ options, value, onChange, placeholder = 'Sélectionner...', disabled = false, className = '' }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-4 py-2.5 rounded-lg border border-forge-border bg-black/40 text-slate-300 text-sm flex items-center justify-between hover:border-forge-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>{selectedOption?.label || placeholder}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          ref={containerRef}
          className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-forge-border/50 rounded-lg shadow-lg z-50"
        >
          <ul className="max-h-64 overflow-y-auto">
            {options.map(option => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange?.(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    value === option.value
                      ? 'bg-forge-accent/10 text-forge-accent'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';
