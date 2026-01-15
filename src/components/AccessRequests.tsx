import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { NetworkStatus } from '@apollo/client';
import { GET_ADMIN_USER_ACCESS_REQUESTS } from '../graphql/queries';
import { ShieldCheck, Mail, CheckCircle, XCircle, LayoutGrid, List, Clock } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { PremiumLoader } from './PremiumLoader';
import { motion, AnimatePresence } from 'framer-motion';

export const AccessRequests = () => {
  const [viewType, setViewType] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('access_requests_view_type') as 'grid' | 'list') || 'list';
  });

  const { data, loading, error, networkStatus } = useQuery(GET_ADMIN_USER_ACCESS_REQUESTS, {
    variables: { limit: 50 },
    notifyOnNetworkStatusChange: true,
  });

  const isRefetching = networkStatus === NetworkStatus.refetch || networkStatus === NetworkStatus.poll;

  const toggleView = (type: 'grid' | 'list') => {
    setViewType(type);
    localStorage.setItem('access_requests_view_type', type);
  };

  if (error && !data) {
    const isUnauthorized = error.message.includes('401') || error.message.toLowerCase().includes('unauthorized');
    return (
      <ErrorState
        title={isUnauthorized ? 'Access Denied' : 'Error Loading Requests'}
        message={error.message}
        variant={isUnauthorized ? 'unauthorized' : 'error'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const requests = (data as any)?.getAdminUserAccessRequests?.data || [];

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
            <div className="bg-blue-500/10 backdrop-blur-md border border-blue-500/20 px-4 py-1.5 rounded-full flex items-center gap-3 shadow-2xl shadow-blue-500/20">
              <PremiumLoader size="sm" variant="subtle" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                Gatekeeper Sync
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Access Requests</h1>
          <p className="text-neutral-400">Review and manage pending administrative access requests.</p>
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
        </div>
      </div>

      {loading && networkStatus === NetworkStatus.loading ? (
        <div className="flex items-center justify-center py-20">
          <PremiumLoader size="lg" label="Validating Credentials" />
        </div>
      ) : !requests.length ? (
        <EmptyState 
          title="All Caught Up!"
          message="No pending access requests. Your inbox is clean and happy!"
          icon={ShieldCheck}
        />
      ) : (
        <div className={viewType === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500" 
          : "space-y-4 animate-in fade-in duration-500"
        }>
          {requests.map((request: any) => (
            <div 
              key={request.id} 
              className={`group relative bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/80 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-xl ${viewType === 'list' ? 'flex items-center justify-between p-6' : 'p-8'}`}
            >
              <div className={viewType === 'list' ? "flex items-center gap-6" : "space-y-6"}>
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-500">
                  <Mail size={28} />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {request.email}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                    <Clock size={12} />
                    <span>Requested {new Date(request.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className={`${viewType === 'list' ? 'flex items-center gap-4' : 'mt-8 flex items-center gap-4'}`}>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-2xl transition-all font-bold active:scale-95 group/btn">
                  <CheckCircle size={18} className="group-hover/btn:scale-110 transition-transform" />
                  <span>Approve</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all font-bold active:scale-95 group/btn">
                  <XCircle size={18} className="group-hover/btn:scale-110 transition-transform" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
