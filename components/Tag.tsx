import React from 'react';

interface TagProps {
  label: string;
  onRemove?: () => void;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles = {
  default: 'bg-slate-700/30 text-slate-300 border border-slate-600/50',
  accent: 'bg-forge-accent/10 text-forge-accent border border-forge-accent/30',
  success: 'bg-green-500/10 text-green-400 border border-green-500/30',
  warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/30'
};

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm'
};

export const Tag = React.forwardRef<
  HTMLDivElement,
  TagProps
>(({ label, onRemove, variant = 'default', size = 'sm', className = '' }, ref) => {
  return (
    <div
      ref={ref}
      className={`inline-flex items-center gap-2 rounded-lg border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:opacity-70 transition-opacity flex-shrink-0"
          aria-label={`Remove ${label}`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
});

Tag.displayName = 'Tag';
