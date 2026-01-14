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
    <div className="relative group overflow-hidden w-full max-w-4xl mx-auto">
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-[3.5rem] blur-xl group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-700 opacity-50" />
      
      <div className="relative flex flex-col items-center justify-center p-16 text-center space-y-8 bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/80 rounded-[3rem] animate-in fade-in zoom-in duration-700 shadow-2xl">
        <div className="relative">
          {/* Icon Container with multi-layered shadow/glow */}
          <div className="w-24 h-24 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-[2rem] flex items-center justify-center text-neutral-400 ring-1 ring-white/5 shadow-[rgba(0,0,0,0.5)_0px_8px_24px] group-hover:text-blue-400 group-hover:scale-105 transition-all duration-500">
            <Icon size={40} className="stroke-[1.5]" />
          </div>
          
          {/* Animated Sparkles */}
          <div className="absolute -top-3 -right-3 w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/40 animate-bounce cursor-default">
            <Sparkles size={18} className="animate-pulse" />
          </div>

          {/* Optional decorative elements */}
          <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-purple-500/20 blur-sm" />
        </div>
        
        <div className="max-w-sm space-y-3">
          <h3 className="text-2xl font-bold bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-neutral-400 text-sm leading-relaxed antialiased">
            {message}
          </p>
        </div>

        {action && (
          <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};
