import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { LOGIN_ADMIN_USER } from '../graphql/mutations';
import { useAuthStore } from './store';
import { Lock, User, Mail, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [executeLogin, { loading, data, error }] = useLazyQuery(LOGIN_ADMIN_USER);

  React.useEffect(() => {
    const loginData = data as any;
    if (loginData?.loginAdminUser) {
      login(loginData.loginAdminUser);
      navigate('/');
    }
  }, [data, login, navigate]);

  React.useEffect(() => {
    if (error) {
      setErrorText(error.message || 'Login failed');
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    executeLogin({
      variables: {
        input: {
          username,
          email,
          password
        }
      }
    });
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-neutral-950 p-4 font-sans text-neutral-200">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-2">
          <h1 className="text-sm font-bold tracking-widest text-blue-500 uppercase">Codewithwest Admin</h1>
          <h2 className="text-4xl font-extrabold tracking-tight text-white">Login</h2>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl backdrop-blur-xl space-y-6">
          {errorText && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
              {errorText}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-500 ml-1 uppercase">Username</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="tabloitTinker"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-neutral-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-500 ml-1 uppercase">Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  placeholder="admin@gmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-neutral-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-500 ml-1 uppercase">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  placeholder="**********"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-neutral-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <span>Login</span>}
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-800 text-center">
             <button 
              onClick={() => navigate('/request-access')}
              className="text-neutral-500 hover:text-white text-sm transition-colors"
             >
               Need access? Request it here
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
