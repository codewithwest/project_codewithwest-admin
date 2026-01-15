import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { NetworkStatus } from '@apollo/client';
import { GET_CONTACT_MESSAGES } from '../graphql/queries';
import { Mail, User, Clock, MessageSquare, AlertCircle, LayoutGrid, List } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { PremiumLoader } from './PremiumLoader';
import { motion, AnimatePresence } from 'framer-motion';

export default function Messages() {
  const [viewType, setViewType] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('messages_view_type') as 'grid' | 'list') || 'list';
  });

  const { loading, error, data, networkStatus } = useQuery(GET_CONTACT_MESSAGES, {
    variables: { limit: 50 },
    pollInterval: 10000, 
    notifyOnNetworkStatusChange: true,
  });

  const isRefetching = networkStatus === NetworkStatus.refetch || networkStatus === NetworkStatus.poll;

  const toggleView = (type: 'grid' | 'list') => {
    setViewType(type);
    localStorage.setItem('messages_view_type', type);
  };

  // Initial loading state (no data yet)
  if (loading && networkStatus === NetworkStatus.loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-neutral-950/20">
        <PremiumLoader size="lg" label="Syncing Inbox" />
      </div>
    );
  }

  if (error && !data) {
    const isUnauthorized = error.message.includes('401') || error.message.toLowerCase().includes('unauthorized');
    return (
      <ErrorState
        title={isUnauthorized ? 'Access Denied' : 'Error Loading Messages'}
        message={error.message}
        variant={isUnauthorized ? 'unauthorized' : 'error'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const messages = (data as any)?.getContactMessages?.data || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700 relative">
      {/* Background Sync Indicator */}
      <AnimatePresence>
        {isRefetching && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 flex justify-center z-50 pointer-events-none"
          >
            <div className="bg-blue-500/10 backdrop-blur-md border border-blue-500/20 px-4 py-1.5 rounded-full flex items-center gap-3 shadow-2xl shadow-blue-500/20">
              <PremiumLoader size="sm" variant="subtle" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                Refreshing Stream
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Messages</h1>
          <p className="text-neutral-400">Inquiries from your portfolio visitors.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 bg-neutral-900/50 px-4 py-2 rounded-xl border border-neutral-800">
            <MessageSquare size={16} className="text-blue-500" />
            <span className="text-sm font-bold text-neutral-300">{messages.length} total</span>
          </div>

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
        </div>
      </div>

      {!messages.length ? (
        <EmptyState 
          title="Inbox Zero"
          message="No messages yet. When visitors contact you, they'll show up here!"
          icon={Mail}
        />
      ) : (
        <div className={viewType === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500" 
          : "space-y-4 animate-in fade-in duration-500"
        }>
          {messages.map((msg: any) => (
            <div 
              key={msg.id} 
              className={`group relative bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/80 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-xl ${viewType === 'list' ? 'flex items-center justify-between p-6' : 'p-8 flex flex-col h-full'}`}
            >
              <div className={viewType === 'list' ? "flex items-center gap-6" : "space-y-6 flex-1"}>
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-500 shrink-0">
                  <User size={28} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                      {msg.name}
                    </h3>
                  </div>
                  <p className="text-blue-500/80 text-xs font-black uppercase tracking-widest mt-1">
                    {msg.email}
                  </p>
                  
                  <div className="mt-4 bg-neutral-950/40 border border-neutral-800/50 p-4 rounded-2xl text-neutral-300 italic text-sm leading-relaxed antialiased line-clamp-3">
                    "{msg.message}"
                  </div>
                </div>
              </div>

              <div className={`${viewType === 'list' ? 'flex items-center gap-4 ml-6' : 'mt-8 flex items-center justify-between border-t border-neutral-800/50 pt-6'}`}>
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-bold bg-neutral-900/50 px-3 py-1.5 rounded-full border border-neutral-800">
                  <Clock size={14} />
                  <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-[10px] text-neutral-600 font-black uppercase tracking-widest">
                  <AlertCircle size={14} />
                  Inquiry
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
   );
}
