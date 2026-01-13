import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Loader2, Plus, Calendar, X } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import { EmptyState } from './EmptyState';
import { GET_PROJECT_CATEGORIES } from '../graphql/queries';
import { CREATE_PROJECT_CATEGORY } from '../graphql/mutations';

export const ProjectCategories = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [errorText, setErrorText] = useState('');

  const { data, loading, error } = useQuery(GET_PROJECT_CATEGORIES, {
    variables: { limit: 50 },
  });

  const [createCategory, { loading: creating }] = useMutation(CREATE_PROJECT_CATEGORY, {
    refetchQueries: [{ query: GET_PROJECT_CATEGORIES, variables: { limit: 50 } }],
    onCompleted: () => {
      setIsCreateOpen(false);
      setName('');
      setErrorText('');
    },
    onError: (error) => setErrorText(error.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory({
      variables: { name }
    });
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-amber-500" /></div>;
  if (error) return <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">{error.message}</div>;

  return (
    <div className="space-y-6 relative min-h-screen">
      <div className="flex justify-between items-center bg-neutral-900/40 p-4 rounded-2xl border border-neutral-800">
        <h2 className="text-3xl font-bold">Project Categories</h2>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-neutral-900 px-4 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <Plus size={18} />
          <span>New Category</span>
        </button>
      </div>

      {/* Slide-over Form */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsCreateOpen(false)} />
          <div className="relative w-full max-w-sm bg-neutral-900 border-l border-neutral-800 h-full animate-in slide-in-from-right duration-300 shadow-2xl">
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Create Category</h3>
                <button onClick={() => setIsCreateOpen(false)} className="text-neutral-500 hover:text-white p-2">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {errorText && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {errorText}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-500 uppercase">Category Name</label>
                  <div className="relative group">
                    <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-amber-500 transition-colors" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-semibold"
                      placeholder="E.g. Web Apps"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {creating ? <Loader2 className="animate-spin" /> : <span>Create Category</span>}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {!(data as any)?.getProjectCategories?.data?.length ? (
        <EmptyState 
          title="No Categories"
          message="Categories help keep your projects organized. Create your first one to get started!"
          icon={Tag}
          action={
            <button onClick={() => setIsCreateOpen(true)} className="bg-amber-500 hover:bg-amber-400 text-neutral-900 px-6 py-2 rounded-xl font-bold transition-all">
              Initialize First Category
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data as any)?.getProjectCategories?.data?.map((category: any) => (
              <div key={category.id} className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between hover:border-amber-500/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="text-amber-500/50 rotate-45" size={14} />
                </div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                    <Tag size={20} />
                  </div>
                  <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors uppercase tracking-wider">{category.name}</h3>
                </div>
                <div className="flex items-center text-[10px] text-neutral-500 space-x-2 pt-4 border-t border-neutral-800/50">
                  <Calendar size={12} />
                  <span>Created {new Date(category.created_at).toLocaleDateString()}</span>
                </div>
              </div>
          ))}
        </div>
      )}
    </div>
  );
};
