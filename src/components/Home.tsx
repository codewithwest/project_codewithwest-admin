import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_PROJECTS, GET_ADMIN_USERS } from '../graphql/queries';
import { FolderKanban, Users, Activity, Loader2 } from 'lucide-react';

export const Home = () => {
  const { data: projectData, loading: projectLoading } = useQuery(GET_PROJECTS, { variables: { limit: 100 } });
  const { data: userData, loading: userLoading } = useQuery(GET_ADMIN_USERS, { variables: { limit: 100 } });

  const projects = (projectData as any)?.getProjects?.data || [];
  const users = (userData as any)?.getAdminUsers?.data || [];

  const stats = [
    { 
      title: "Total Projects", 
      value: projectLoading ? "..." : projects.length, 
      sub: "Active in portfolio", 
      icon: <FolderKanban size={24} />,
      color: "border-blue-500/30",
      iconColor: "text-blue-500"
    },
    { 
      title: "Admin Users", 
      value: userLoading ? "..." : users.length, 
      sub: "Active moderators", 
      icon: <Users size={24} />,
      color: "border-indigo-500/30",
      iconColor: "text-indigo-500"
    },
    { 
      title: "System Status", 
      value: "99.9%", 
      sub: "All systems online", 
      icon: <Activity size={24} />,
      color: "border-emerald-500/30",
      iconColor: "text-emerald-500"
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section>
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-neutral-400">Overview of your admin console activities.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <section className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-3xl">
          <h3 className="text-lg font-bold mb-4">Recent Projects</h3>
          <div className="space-y-4">
             {projects.length === 0 ? (
               <div className="py-8 text-center text-neutral-500 text-sm italic">
                 No projects found. Launch something new!
               </div>
             ) : (
               projects.slice(0, 5).map((p: any) => (
                 <div key={p.id} className="flex items-center justify-between p-3 bg-neutral-950/50 rounded-xl border border-neutral-800/50">
                   <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <FolderKanban size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{p.name}</p>
                        <p className="text-xs text-neutral-500">
                          {Array.isArray(p.tech_stacks) ? p.tech_stacks.join(', ') : p.tech_stacks}
                        </p>
                      </div>
                   </div>
                 </div>
               ))
             )}
          </div>
        </section>

        <section className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-3xl">
          <h3 className="text-lg font-bold mb-4">Admin Activity</h3>
          <div className="space-y-4">
             {users.length === 0 ? (
               <div className="py-8 text-center text-neutral-500 text-sm italic">
                 No other admins yet.
               </div>
             ) : (
               users.slice(0, 5).map((u: any) => (
                 <div key={u.id} className="flex items-center justify-between p-3 bg-neutral-950/50 rounded-xl border border-neutral-800/50">
                   <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                         <Users size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{u.username}</p>
                        <p className="text-xs text-neutral-500">Last login: {u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}</p>
                      </div>
                   </div>
                 </div>
               ))
             )}
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, sub, icon, color, iconColor }: any) => (
  <div className={`p-6 rounded-3xl border ${color} bg-neutral-900/50 backdrop-blur-sm transition-all hover:scale-[1.02] duration-300`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-neutral-950/50 ${iconColor}`}>
        {icon}
      </div>
    </div>
    <div className="space-y-1">
      <h3 className="text-neutral-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <p className="text-4xl font-black text-white">{value}</p>
      <p className="text-xs text-neutral-500">{sub}</p>
    </div>
  </div>
);
