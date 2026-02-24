import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb = React.forwardRef<
  HTMLElement,
  BreadcrumbProps
>(({ items, className = '' }, ref) => {
  return (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={`text-xs text-slate-400 ${className}`}
    >
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-slate-300 font-medium">{item.label}</span>
              ) : (
                <>
                  <Link
                    href={item.href || '#'}
                    className="hover:text-slate-200 transition-colors"
                  >
                    {item.label}
                  </Link>
                  <svg
                    className="w-3 h-3 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';
