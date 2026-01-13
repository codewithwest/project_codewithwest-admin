import React from 'react';
import { useAuthStore } from '../auth/store';
import { User, Mail, Shield, LogOut, ExternalLink } from 'lucide-react';

export const Settings = () => {
  const { email, userId, logout } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <h2 className="text-3xl font-bold mb-2">Settings</h2>
        <p className="text-neutral-400">Manage your profile and application preferences.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <section className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold flex items-center space-x-2">
              <User size={20} className="text-blue-500" />
              <span>Profile Information</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="space-y-1">
                 <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Email Address</p>
                 <div className="flex items-center space-x-2 text-white">
                   <Mail size={16} className="text-neutral-500" />
                   <span>{email || 'Not available'}</span>
                 </div>
               </div>
               <div className="space-y-1">
                 <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Admin ID</p>
                 <div className="flex items-center space-x-2 text-white font-mono text-sm">
                   <Shield size={16} className="text-neutral-500" />
                   <span>{userId || 'N/A'}</span>
                 </div>
               </div>
            </div>
          </section>

          <section className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl space-y-4">
             <h3 className="text-xl font-bold">About Application</h3>
             <div className="space-y-2 text-sm text-neutral-400">
               <div className="flex justify-between border-b border-neutral-800/50 pb-2">
                 <span>Version</span>
                 <span className="text-white font-semibold">1.0.0</span>
               </div>
               <div className="flex justify-between border-b border-neutral-800/50 pb-2">
                 <span>Developer</span>
                 <span className="text-white font-semibold">CodeWithWest</span>
               </div>
               <div className="flex justify-between pt-2">
                 <span>Environment</span>
                 <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">Production</span>
               </div>
             </div>
          </section>
        </div>

        <div className="space-y-6">
           <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 p-8 rounded-3xl space-y-4">
              <h3 className="font-bold text-white">System Logs</h3>
              <p className="text-xs text-neutral-400">View detailed system logs for debugging and auditing.</p>
              <button className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2">
                <span>Open Logs</span>
                <ExternalLink size={14} />
              </button>
           </div>

           <button 
            onClick={() => logout()}
            className="w-full p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-2xl transition-all duration-300 font-bold flex items-center justify-center space-x-3 group"
           >
             <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
             <span>Sign Out</span>
           </button>
        </div>
      </div>
    </div>
  );
};
