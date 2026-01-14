import React from 'react';
import { LucideIcon, AlertTriangle, RefreshCw, ShieldAlert } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  icon?: LucideIcon;
  onRetry?: () => void;
  variant?: 'error' | 'warning' | 'unauthorized';
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  title, 
  message, 
  icon, 
  onRetry,
  variant = 'error'
}) => {
  const Icon = icon || (variant === 'unauthorized' ? ShieldAlert : AlertTriangle);
  
  const variantStyles = {
    error: {
      glow: 'from-red-500/10 to-orange-500/10 group-hover:from-red-500/20 group-hover:to-orange-500/20',
      iconBg: 'from-red-500/10 to-orange-500/10',
      iconText: 'text-red-500 group-hover:text-red-400',
      titleGradient: 'from-red-400 to-orange-400',
      accentColor: 'bg-red-500 shadow-red-500/40',
    },
    warning: {
      glow: 'from-amber-500/10 to-yellow-500/10 group-hover:from-amber-500/20 group-hover:to-yellow-500/20',
      iconBg: 'from-amber-500/10 to-yellow-500/10',
      iconText: 'text-amber-500 group-hover:text-amber-400',
      titleGradient: 'from-amber-400 to-yellow-400',
      accentColor: 'bg-amber-500 shadow-amber-500/40',
    },
    unauthorized: {
      glow: 'from-purple-500/10 to-pink-500/10 group-hover:from-purple-500/20 group-hover:to-pink-500/20',
      iconBg: 'from-purple-500/10 to-pink-500/10',
      iconText: 'text-purple-500 group-hover:text-purple-400',
      titleGradient: 'from-purple-400 to-pink-400',
      accentColor: 'bg-purple-500 shadow-purple-500/40',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="relative group overflow-hidden w-full max-w-4xl mx-auto">
      {/* Background Glow */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${styles.glow} rounded-[3.5rem] blur-xl transition-all duration-700 opacity-50`} />
      
      <div className="relative flex flex-col items-center justify-center p-16 text-center space-y-8 bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/80 rounded-[3rem] animate-in fade-in zoom-in duration-700 shadow-2xl">
        <div className="relative">
          {/* Icon Container */}
          <div className={`w-24 h-24 bg-gradient-to-br ${styles.iconBg} rounded-[2rem] flex items-center justify-center ${styles.iconText} ring-1 ring-white/5 shadow-[rgba(0,0,0,0.5)_0px_8px_24px] group-hover:scale-105 transition-all duration-500`}>
            <Icon size={40} className="stroke-[1.5]" />
          </div>
          
          {/* Animated Alert Badge */}
          <div className={`absolute -top-3 -right-3 w-10 h-10 ${styles.accentColor} rounded-2xl flex items-center justify-center text-white shadow-xl animate-pulse`}>
            <AlertTriangle size={18} />
          </div>

          {/* Decorative elements */}
          <div className={`absolute -bottom-1 -left-1 w-4 h-4 rounded-full ${styles.accentColor} blur-sm opacity-50`} />
        </div>
        
        <div className="max-w-md space-y-3">
          {title && (
            <h3 className={`text-2xl font-bold bg-gradient-to-br ${styles.titleGradient} bg-clip-text text-transparent`}>
              {title}
            </h3>
          )}
          <p className="text-neutral-300 text-sm leading-relaxed antialiased font-medium">
            {message}
          </p>
        </div>

        {onRetry && (
          <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <button
              onClick={onRetry}
              className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${styles.iconBg} hover:${styles.iconBg} text-white rounded-2xl font-bold transition-all shadow-xl ${styles.accentColor.split(' ')[0]}/20 hover:scale-105 active:scale-95 border border-neutral-700`}
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
