import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings as SettingsIcon, 
  Users, 
  FolderKanban, 
  Tags, 
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../auth/store';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const logout = useAuthStore((state) => state.logout);

  const navItems = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard", color: "group-hover:text-blue-400" },
    { to: "/users", icon: <Users size={20} />, label: "Admin Users", color: "group-hover:text-indigo-400" },
    { to: "/projects", icon: <FolderKanban size={20} />, label: "Projects", color: "group-hover:text-emerald-400" },
    { to: "/categories", icon: <Tags size={20} />, label: "Categories", color: "group-hover:text-amber-400" },
    { to: "/access-requests", icon: <ShieldCheck size={20} />, label: "Access Requests", color: "group-hover:text-red-400" },
    { to: "/settings", icon: <SettingsIcon size={20} />, label: "Settings", color: "group-hover:text-neutral-400" },
  ];

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-900/50 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Admin Desktop
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pb-4">
          {navItems.map((item) => (
            <Link 
              key={item.to} 
              to={item.to} 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-800 transition-all group"
            >
              <span className={`text-neutral-500 transition-colors ${item.color}`}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-800 space-y-4">
           <button 
            onClick={() => logout()}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500/10 text-neutral-500 hover:text-red-400 transition-all group"
           >
             <LogOut size={20} />
             <span className="text-sm font-medium">Logout</span>
           </button>
           <div className="text-[10px] text-neutral-600 uppercase tracking-widest px-3">
             v1.0.0 • CodeWithWest
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-neutral-800 flex items-center justify-between px-8 bg-neutral-950/80 backdrop-blur-md">
          <div className="flex items-center space-x-4">
             {/* breadcrumbs or search could go here */}
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
