import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
};

export const Spinner = React.forwardRef<
  HTMLDivElement,
  SpinnerProps
>(({ size = 'md', className = '' }, ref) => {
  return (
    <div ref={ref} className={`${className}`}>
      <div className={`${sizeStyles[size]} relative`}>
        <div className="absolute inset-0 border-2 border-slate-700/30 rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-forge-accent border-r-forge-accent rounded-full animate-spin" />
      </div>
    </div>
  );
});

Spinner.displayName = 'Spinner';
