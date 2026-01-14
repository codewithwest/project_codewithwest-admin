import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { LayoutGrid, List, Plus, Key, Trash2, Clock, CheckCircle2, XCircle, ShieldCheck, Copy, Check, Ban } from 'lucide-react';
import { EmptyState } from './EmptyState';

const GET_INTEGRATIONS = gql`
  query GetIntegrations {
    getIntegrations {
      data {
        id
        name
        token
        is_revoked
        created_at
        last_used_at
      }
      pagination {
        totalItems
      }
    }
  }
`;

const CREATE_INTEGRATION = gql`
  mutation CreateIntegration($name: String!) {
    createIntegration(name: $name) {
      id
      name
      token
      created_at
    }
  }
`;

const REVOKE_INTEGRATION = gql`
  mutation RevokeIntegration($id: String!) {
    revokeIntegration(id: $id) {
      id
      is_revoked
    }
  }
`;

export function Integrations() {
  const [viewType, setViewType] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('integrations_view_type') as 'grid' | 'list') || 'grid';
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [createError, setCreateError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [revokeError, setRevokeError] = useState('');

  const { data, loading, error, refetch } = useQuery(GET_INTEGRATIONS);
  const [createIntegration, { loading: creating }] = useMutation(CREATE_INTEGRATION);
  const [revokeIntegration] = useMutation(REVOKE_INTEGRATION);

  const toggleView = (type: 'grid' | 'list') => {
    setViewType(type);
    localStorage.setItem('integrations_view_type', type);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    try {
      const result = await createIntegration({ variables: { name: newName } });
      setNewName('');
      setIsModalOpen(false);
      setSuccessMessage(`Integration "${result.data.createIntegration.name}" created successfully!`);
      setTimeout(() => setSuccessMessage(''), 5000);
      refetch();
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create integration');
    }
  };

  const handleRevoke = async (id: string) => {
    if (confirm('Are you sure you want to revoke this integration? This action cannot be undone.')) {
      setRevokeError('');
      try {
        await revokeIntegration({ variables: { id } });
        setSuccessMessage('Integration revoked successfully');
        setTimeout(() => setSuccessMessage(''), 5000);
        refetch();
      } catch (err: any) {
        setRevokeError(err.message || 'Failed to revoke integration');
        setTimeout(() => setRevokeError(''), 5000);
      }
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  const integrations = (data as any)?.getIntegrations?.data || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700">
      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-8 right-8 z-50 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/50 rounded-2xl p-4 shadow-2xl shadow-emerald-500/20 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-400">Success!</p>
              <p className="text-xs text-neutral-300">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {revokeError && (
        <div className="fixed top-8 right-8 z-50 bg-red-500/10 backdrop-blur-xl border border-red-500/50 rounded-2xl p-4 shadow-2xl shadow-red-500/20 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-red-400">Error</p>
              <p className="text-xs text-neutral-300">{revokeError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Integrations</h1>
          <p className="text-neutral-400">Manage API client tokens and external integrations.</p>
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
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus size={20} />
            New Client
          </button>
        </div>
      </div>

      {integrations.length === 0 ? (
        <EmptyState
          title="No Integrations"
          message="Create your first integration token to start accessing the API externally."
          icon={Key}
          action={
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
            >
              Create Integration
            </button>
          }
        />
      ) : (
        <div className={viewType === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {integrations.map((item: any) => (
            <div 
              key={item.id} 
              className={`group relative bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/80 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-xl ${viewType === 'list' ? 'flex items-center justify-between p-6' : 'p-8'}`}
            >
              <div className={viewType === 'list' ? "flex items-center gap-6" : "space-y-6"}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${item.is_revoked ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/30'}`}>
                  <ShieldCheck size={28} />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
                    {item.name}
                    {item.is_revoked && <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Revoked</span>}
                  </h3>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <Clock size={12} />
                      Created: {item.created_at}
                    </div>
                    {item.last_used_at && (
                      <div className="flex items-center gap-2 text-xs text-blue-500/70 font-medium">
                        <CheckCircle2 size={12} />
                        Last active: {item.last_used_at}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={`${viewType === 'list' ? 'flex items-center gap-4' : 'mt-8 flex flex-col gap-4'}`}>
                <div className="relative flex-1">
                  <div className="flex items-center gap-2 bg-neutral-950/50 border border-neutral-800 rounded-2xl p-3 pr-12 font-mono text-xs text-neutral-400 overflow-hidden">
                    <span className="truncate">{item.token}</span>
                    <button 
                      onClick={() => copyToClipboard(item.token, item.id)}
                      className="absolute right-2 p-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-neutral-400 transition-all"
                      title="Copy Token"
                    >
                      {copiedId === item.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                {!item.is_revoked && (
                  <button 
                    onClick={() => handleRevoke(item.id)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all font-bold active:scale-95 group/btn"
                  >
                    <Trash2 size={18} className="group-hover/btn:rotate-12 transition-transform" />
                    <span>Revoke</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Integration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-[2.5rem] p-10 shadow-3xl animate-in zoom-in-95 duration-300">
            <h2 className="text-3xl font-black text-white mb-2">New Integration</h2>
            <p className="text-neutral-400 mb-8">Give your API client a name to identify it easily.</p>
            
            <form onSubmit={handleCreate} className="space-y-6">
              {createError && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <XCircle size={20} className="text-red-500" />
                    <div>
                      <p className="text-sm font-bold text-red-400">Error</p>
                      <p className="text-xs text-neutral-300">{createError}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-500 uppercase tracking-widest ml-1">Client Name</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Mobile App, GitHub Action"
                  className="w-full bg-neutral-950/50 border border-neutral-800 rounded-2xl px-6 py-4 text-white placeholder-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  autoFocus
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-2xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Generate Token'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
