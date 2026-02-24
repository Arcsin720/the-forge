import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  primary: 'bg-gradient-to-r from-forge-accent via-forge-accentSoft to-forge-accent',
  success: 'bg-gradient-to-r from-green-400 via-green-500 to-green-400',
  warning: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400',
  danger: 'bg-gradient-to-r from-red-400 via-red-500 to-red-400'
};

export const GradientText = React.forwardRef<
  HTMLSpanElement,
  GradientTextProps
>(({ children, variant = 'primary', className = '' }, ref) => {
  return (
    <span
      ref={ref}
      className={`bg-clip-text text-transparent font-bold ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
});

GradientText.displayName = 'GradientText';
