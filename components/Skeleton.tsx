import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  count?: number;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton = React.forwardRef<
  HTMLDivElement,
  SkeletonProps
>(({ width = '100%', height = '1rem', borderRadius = '0.5rem', className = '', count = 1, variant = 'text' }, ref) => {
  const skeletonVariants = {
    text: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const baseStyles = 'bg-slate-800/50 animate-pulse';

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          ref={index === 0 ? ref : null}
          style={{
            width: typeof width === 'number' ? `${width}px` : width,
            height: typeof height === 'number' ? `${height}px` : height,
            borderRadius
          }}
          className={`${baseStyles} ${skeletonVariants[variant]} ${className} ${index > 0 ? 'mt-3' : ''}`}
        />
      ))}
    </>
  );
});

Skeleton.displayName = 'Skeleton';
