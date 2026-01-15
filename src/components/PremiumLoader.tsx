import React from 'react';
import { motion } from 'framer-motion';

interface PremiumLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  variant?: '3d' | 'subtle';
}

export const PremiumLoader: React.FC<PremiumLoaderProps> = ({ 
  size = 'md', 
  label, 
  variant = '3d' 
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  if (variant === 'subtle') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className={`${sizeMap[size]} border-2 border-transparent border-t-blue-500 border-r-indigo-500 rounded-full`}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-0 ${sizeMap[size]} border-2 border-transparent border-b-purple-500/50 border-l-blue-400/50 rounded-full scale-110 blur-[1px]`}
          />
        </div>
        {label && <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{label}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-6">
      <div className={`relative ${sizeMap[size]} perspective-1000`}>
        {/* Glowing Background Ring */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: 360
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-2xl opacity-40"
        />

        {/* 3D Cube/Object */}
        <motion.div
          animate={{ 
            rotateY: [0, 360],
            rotateX: [0, 180, 360],
            y: [-10, 10, -10]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-full h-full relative preserve-3d"
        >
          {/* Front Face */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center translate-z-8 shadow-xl">
             <div className="w-1/2 h-1/2 bg-blue-500/40 rounded-full blur-lg" />
          </div>
          {/* Back Face */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl -translate-z-8" />
          {/* Sides */}
          <div className="absolute inset-0 bg-indigo-500/10 border border-white/10 rounded-xl rotate-y-90 translate-x-1/2" />
          <div className="absolute inset-0 bg-blue-500/10 border border-white/10 rounded-xl -rotate-y-90 -translate-x-1/2" />
        </motion.div>

        {/* Particle Ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                rotate: 360,
                scale: [1, 1.5, 1],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2 + i * 0.5, 
                repeat: Infinity, 
                delay: i * 0.2,
                ease: "linear" 
              }}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{ transform: `rotate(${i * 60}deg) translateY(-30px)` }}
            />
          ))}
        </div>
      </div>
      
      {label && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-sm font-black text-white uppercase tracking-[0.2em] drop-shadow-lg">
            {label}
          </span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], backgroundColor: ['#3b82f6', '#818cf8', '#3b82f6'] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-1 h-1 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
