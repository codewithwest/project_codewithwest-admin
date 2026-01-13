import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ADMIN_USERS } from '../graphql/queries';
import { CREATE_ADMIN_USER } from '../graphql/mutations';
import { Loader2, User, ShieldAlert, UserPlus, X, Mail, Lock, Plus } from 'lucide-react';
import { EmptyState } from './EmptyState';

export const AdminUsers = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const { data, loading, error } = useQuery(GET_ADMIN_USERS, {
    variables: { limit: 50 },
  });

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

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-500" /></div>;
  if (error) return <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">{error.message}</div>;

  const users = (data as any)?.getAdminUsers?.data || [];

  return (
    <div className="relative min-h-[calc(100vh-8rem)]">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Admin Users</h2>
            <p className="text-neutral-500 text-sm mt-1">Manage administrators and their access levels.</p>
          </div>
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-blue-500/20"
          >
            <UserPlus size={18} />
            <span>New Admin</span>
          </button>
        </div>

        {!users.length ? (
          <EmptyState 
            title="Only You Here"
            message="It's a bit lonely! Invite other admins to help you manage the fleet."
            icon={ShieldAlert}
            action={
              <button 
                onClick={() => setIsCreateOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
              >
                Create First Admin
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user: any) => (
              <div key={user.id} className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl hover:border-neutral-700 transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{user.username}</h3>
                    <p className="text-sm text-neutral-500">{user.email}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-800 flex justify-between items-center text-xs">
                  <span className="px-2 py-1 bg-neutral-800 rounded text-neutral-400">{user.role || 'Admin'}</span>
                  <span className="text-neutral-600">Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
                  {creating ? <Loader2 className="animate-spin" /> : (
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
