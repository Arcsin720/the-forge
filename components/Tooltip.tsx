import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const positionStyles = {
  top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
  bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
  left: 'right-full mr-2 top-1/2 -translate-y-1/2',
  right: 'left-full ml-2 top-1/2 -translate-y-1/2'
};

export const Tooltip = React.forwardRef<
  HTMLDivElement,
  TooltipProps
>(({ content, children, position = 'top', className = '' }, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      {isVisible && (
        <div
          className={`absolute z-50 px-2 py-1 text-xs bg-slate-950/95 text-slate-200 rounded border border-forge-border/50 whitespace-nowrap pointer-events-none ${positionStyles[position]}`}
        >
          {content}
        </div>
      )}
    </div>
  );
});

Tooltip.displayName = 'Tooltip';
