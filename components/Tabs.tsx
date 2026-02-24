import React, { useState } from 'react';

interface TabItem {
  label: string;
  value: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const Tabs = React.forwardRef<
  HTMLDivElement,
  TabsProps
>(({ items, defaultValue, onChange, className = '' }, ref) => {
  const [activeTab, setActiveTab] = useState(defaultValue || items[0]?.value);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onChange?.(value);
  };

  const activeContent = items.find(item => item.value === activeTab);

  return (
    <div ref={ref} className={`w-full ${className}`}>
      {/* Tab buttons */}
      <div className="flex border-b border-forge-border/40 gap-0">
        {items.map(item => (
          <button
            key={item.value}
            onClick={() => handleTabChange(item.value)}
            className={`px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-[2px] ${
              activeTab === item.value
                ? 'text-forge-accent border-forge-accent'
                : 'text-slate-400 border-transparent hover:text-slate-300'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeContent && activeContent.content}
      </div>
    </div>
  );
});

Tabs.displayName = 'Tabs';
