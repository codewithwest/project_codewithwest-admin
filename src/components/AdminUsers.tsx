import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { NetworkStatus } from '@apollo/client';
import { GET_ADMIN_USERS } from '../graphql/queries';
import { CREATE_ADMIN_USER } from '../graphql/mutations';
import { User, ShieldAlert, UserPlus, X, Mail, Lock, Plus, LayoutGrid, List, Clock } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { PremiumLoader } from './PremiumLoader';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminUsers = () => {
  const [viewType, setViewType] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('admin_users_view_type') as 'grid' | 'list') || 'grid';
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const { data, loading, error, networkStatus } = useQuery(GET_ADMIN_USERS, {
    variables: { limit: 50 },
    notifyOnNetworkStatusChange: true,
  });

  const isRefetching = networkStatus === NetworkStatus.refetch || networkStatus === NetworkStatus.poll;

  const [createAdmin, { loading: creating }] = useMutation(CREATE_ADMIN_USER, {
    refetchQueries: [{ query: GET_ADMIN_USERS, variables: { limit: 50 } }],
    onCompleted: () => {
      setIsCreateOpen(false);
      setUsername('');
      setEmail('');
      setPassword('');
      setErrorText('');
    },
    onError: (error: any) => setErrorText(error.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAdmin({
      variables: {
        input: { username, email, password }
      }
    });
  };

  const toggleView = (type: 'grid' | 'list') => {
    setViewType(type);
    localStorage.setItem('admin_users_view_type', type);
  };

  if (error && !data) {
    const isUnauthorized = error.message.includes('401') || error.message.toLowerCase().includes('unauthorized');
    return (
      <ErrorState
        title={isUnauthorized ? 'Access Denied' : 'Error Loading Users'}
        message={error.message}
        variant={isUnauthorized ? 'unauthorized' : 'error'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const users = (data as any)?.getAdminUsers?.data || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700 relative">
      {/* Background Sync Indicator */}
      <AnimatePresence>
        {isRefetching && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-0 right-0 flex justify-center z-50 pointer-events-none"
          >
            <div className="bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20 px-4 py-1.5 rounded-full flex items-center gap-3 shadow-2xl shadow-indigo-500/20">
              <PremiumLoader size="sm" variant="subtle" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                Syncing Guardians
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Admin Users</h1>
          <p className="text-neutral-400">Manage administrators and their access levels.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-neutral-900/50 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => toggleView('grid')}
              className={`p-2 rounded-lg transition-all ${viewType === 'grid' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-neutral-500 hover:text-white'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => toggleView('list')}
              className={`p-2 rounded-lg transition-all ${viewType === 'list' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-neutral-500 hover:text-white'}`}
            >
              <List size={20} />
            </button>
          </div>
          
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <UserPlus size={20} />
            New Admin
          </button>
        </div>
      </div>

      {loading && networkStatus === NetworkStatus.loading ? (
        <div className="flex items-center justify-center py-20">
          <PremiumLoader size="lg" label="Initializing Directory" />
        </div>
      ) : !users.length ? (
        <EmptyState 
          title="Only You Here"
          message="It's a bit lonely! Invite other admins to help you manage the fleet."
          icon={ShieldAlert}
          action={
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
            >
              Create First Admin
            </button>
          }
        />
      ) : (
        <div className={viewType === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500" 
          : "space-y-4 animate-in fade-in duration-500"
        }>
          {users.map((user: any) => (
            <div 
              key={user.id} 
              className={`group relative bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/80 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-xl ${viewType === 'list' ? 'flex items-center justify-between p-6' : 'p-8'}`}
            >
              <div className={viewType === 'list' ? "flex items-center gap-6" : "space-y-6"}>
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-500">
                  <User size={28} />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {user.username}
                  </h3>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <Mail size={12} />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <Clock size={12} />
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${viewType === 'list' ? 'flex items-center gap-4' : 'mt-8 flex flex-col gap-4'}`}>
                <div className="inline-flex items-center px-3 py-1 bg-neutral-800 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-400 border border-neutral-700 w-fit">
                  {user.role || 'Admin'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over Drawer */}
      {isCreateOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsCreateOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-neutral-900 border-l border-neutral-800 z-50 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold">Create Admin</h3>
                  <p className="text-neutral-400 text-sm">Add a new administrator to the system.</p>
                </div>
                <button 
                  onClick={() => setIsCreateOpen(false)}
                  className="p-2 hover:bg-neutral-800 rounded-xl text-neutral-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {errorText && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {errorText}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-500 ml-1 uppercase">Username</label>
                  <div className="relative group">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                      placeholder="tabloitTinker"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-500 ml-1 uppercase">Email Address</label>
                  <div className="relative group">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                      placeholder="admin@gmail.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-500 ml-1 uppercase">Password</label>
                  <div className="relative group">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {creating ? <PremiumLoader size="sm" variant="subtle" /> : (
                    <>
                      <Plus size={18} />
                      <span>Create User</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
