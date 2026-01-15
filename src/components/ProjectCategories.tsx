import React, { useState } from 'react';
import { Tag, Plus, Calendar, X, LayoutGrid, List, Sparkles } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import { NetworkStatus } from '@apollo/client';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { PremiumLoader } from './PremiumLoader';
import { GET_PROJECT_CATEGORIES } from '../graphql/queries';
import { CREATE_PROJECT_CATEGORY } from '../graphql/mutations';
import { motion, AnimatePresence } from 'framer-motion';

export const ProjectCategories = () => {
  const [viewType, setViewType] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('categories_view_type') as 'grid' | 'list') || 'grid';
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [errorText, setErrorText] = useState('');

  const { data, loading, error, networkStatus } = useQuery(GET_PROJECT_CATEGORIES, {
    variables: { limit: 50 },
    notifyOnNetworkStatusChange: true,
  });

  const isRefetching = networkStatus === NetworkStatus.refetch || networkStatus === NetworkStatus.poll;

  const [createCategory, { loading: creating }] = useMutation(CREATE_PROJECT_CATEGORY, {
    refetchQueries: [{ query: GET_PROJECT_CATEGORIES, variables: { limit: 50 } }],
    onCompleted: () => {
      setIsCreateOpen(false);
      setName('');
      setErrorText('');
    },
    onError: (error: any) => setErrorText(error.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory({
      variables: { name }
    });
  };

  const toggleView = (type: 'grid' | 'list') => {
    setViewType(type);
    localStorage.setItem('categories_view_type', type);
  };

  if (error && !data) {
    const isUnauthorized = error.message.includes('401') || error.message.toLowerCase().includes('unauthorized');
    return (
      <ErrorState
        title={isUnauthorized ? 'Access Denied' : 'Error Loading Categories'}
        message={error.message}
        variant={isUnauthorized ? 'unauthorized' : 'error'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const categories = (data as any)?.getProjectCategories?.data || [];

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
            <div className="bg-amber-500/10 backdrop-blur-md border border-amber-500/20 px-4 py-1.5 rounded-full flex items-center gap-3 shadow-2xl shadow-amber-500/20">
              <PremiumLoader size="sm" variant="subtle" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">
                Updating Taxonomies
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Project Categories</h1>
          <p className="text-neutral-400">Organize your projects into logical groups.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-neutral-900/50 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => toggleView('grid')}
              className={`p-2 rounded-lg transition-all ${viewType === 'grid' ? 'bg-amber-500 text-neutral-900 shadow-lg shadow-amber-500/20' : 'text-neutral-500 hover:text-white'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => toggleView('list')}
              className={`p-2 rounded-lg transition-all ${viewType === 'list' ? 'bg-amber-500 text-neutral-900 shadow-lg shadow-amber-500/20' : 'text-neutral-500 hover:text-white'}`}
            >
              <List size={20} />
            </button>
          </div>
          
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-900 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-amber-600/20 active:scale-95"
          >
            <Plus size={20} />
            New Category
          </button>
        </div>
      </div>

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
                  {creating ? <PremiumLoader size="sm" variant="subtle" /> : <span>Create Category</span>}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {loading && networkStatus === NetworkStatus.loading ? (
        <div className="flex items-center justify-center py-20">
          <PremiumLoader size="lg" label="Loading Categories" />
        </div>
      ) : !categories.length ? (
        <EmptyState 
          title="No Categories"
          message="Categories help keep your projects organized. Create your first one to get started!"
          icon={Tag}
          action={
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="px-6 py-3 bg-amber-500 text-neutral-900 rounded-2xl font-bold hover:bg-amber-400 transition-all shadow-xl shadow-amber-600/20"
            >
              Initialize First Category
            </button>
          }
        />
      ) : (
        <div className={viewType === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500" 
          : "space-y-4 animate-in fade-in duration-500"
        }>
          {categories.map((category: any) => (
            <div 
              key={category.id} 
              className={`group relative bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/80 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all duration-500 shadow-xl ${viewType === 'list' ? 'flex items-center justify-between p-6' : 'p-8'}`}
            >
              <div className={viewType === 'list' ? "flex items-center gap-6" : "space-y-6"}>
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-neutral-900 group-hover:shadow-lg group-hover:shadow-amber-500/30 transition-all duration-500">
                  <Tag size={28} />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors uppercase tracking-widest antialiased">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                    <Calendar size={12} />
                    <span>Created {new Date(category.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className={`${viewType === 'list' ? 'flex items-center gap-4' : 'mt-8 flex items-center gap-4'}`}>
                 <div className="p-2 text-amber-500/20 group-hover:text-amber-500/50 transition-colors">
                    <Sparkles size={20} />
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
