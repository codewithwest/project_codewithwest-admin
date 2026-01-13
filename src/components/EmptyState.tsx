import React from 'react';
import { LucideIcon, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  icon: LucideIcon;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message, icon: Icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 bg-neutral-900/30 border border-neutral-800/50 border-dashed rounded-[3rem] animate-in fade-in zoom-in duration-500">
      <div className="relative">
        <div className="w-20 h-20 bg-neutral-800 rounded-3xl flex items-center justify-center text-neutral-500 ring-1 ring-neutral-700/50 shadow-inner">
          <Icon size={36} />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
          <Sparkles size={16} />
        </div>
      </div>
      
      <div className="max-w-xs space-y-2">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-neutral-500 leading-relaxed">
          {message}
        </p>
      </div>

      {action && (
        <div className="pt-2">
          {action}
        </div>
      )}
    </div>
  );
};
