import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ADMIN_USER_ACCESS_REQUESTS } from '../graphql/queries';
import { Loader2, ShieldCheck, Mail, Calendar, CheckCircle, XCircle, Heart } from 'lucide-react';
import { EmptyState } from './EmptyState';

export const AccessRequests = () => {
  const { data, loading, error } = useQuery(GET_ADMIN_USER_ACCESS_REQUESTS, {
    variables: { limit: 50 },
  });

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-500" /></div>;
  if (error) return <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">{error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Access Requests</h2>
      </div>

      <div className="space-y-4">
        {!(data as any)?.getAdminUserAccessRequests?.data?.length ? (
          <EmptyState 
            title="All Caught Up!"
            message="No pending access requests. Your inbox is clean and happy!"
            icon={Heart}
          />
        ) : (
          (data as any).getAdminUserAccessRequests.data.map((request: any) => (
            <div key={request.id} className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl flex items-center justify-between hover:bg-neutral-900 transition-colors group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{request.email}</h3>
                  <div className="flex items-center space-x-2 text-xs text-neutral-500">
                    <Calendar size={12} />
                    <span>Requested on {new Date(request.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg transition-colors border border-emerald-500/20">
                   <CheckCircle size={20} />
                 </button>
                 <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20">
                   <XCircle size={20} />
                 </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
