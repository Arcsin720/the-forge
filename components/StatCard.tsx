import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard = React.forwardRef<
  HTMLDivElement,
  StatCardProps
>(({ label, value, unit = '', icon, trend, className = '' }, ref) => {
  return (
    <Card ref={ref} variant="dark" padding="md" className={className}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-slate-100 mt-1">
              {value}
              {unit && <span className="text-sm text-slate-400 ml-1">{unit}</span>}
            </p>
          </div>
          {icon && (
            <div className="text-forge-accent/60">
              {icon}
            </div>
          )}
        </div>

        {trend && (
          <div className={`text-xs font-medium flex items-center gap-1 ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}% vs mois dernier</span>
          </div>
        )}
      </div>
    </Card>
  );
});

StatCard.displayName = 'StatCard';
