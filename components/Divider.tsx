import React from 'react';

interface DividerProps {
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Divider = React.forwardRef<
  HTMLDivElement,
  DividerProps
>(({ label, orientation = 'horizontal', className = '' }, ref) => {
  if (orientation === 'vertical') {
    return (
      <div
        ref={ref}
        className={`h-full w-px bg-gradient-to-b from-transparent via-forge-border/40 to-transparent ${className}`}
      />
    );
  }

  return (
    <div ref={ref} className={`flex items-center gap-3 my-4 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-forge-border/40 to-transparent" />
      {label && (
        <span className="text-xs text-slate-500 font-medium px-2">{label}</span>
      )}
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-forge-border/40 to-transparent" />
    </div>
  );
});

Divider.displayName = 'Divider';
