import React from 'react';
import Image from 'next/image';

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base'
};

export const Avatar = React.forwardRef<
  HTMLDivElement,
  AvatarProps
>(({ src, alt = 'Avatar', initials = '?', size = 'md', className = '' }, ref) => {
  return (
    <div
      ref={ref}
      className={`${sizeStyles[size]} rounded-full flex items-center justify-center flex-shrink-0 border border-forge-border/40 bg-gradient-to-br from-forge-accent/20 to-slate-700/20 font-semibold text-forge-accent ${className}`}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="w-full h-full object-cover rounded-full" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';
