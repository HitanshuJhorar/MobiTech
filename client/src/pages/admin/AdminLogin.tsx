import { useState, FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const { isAuthenticated, isLoading, login, isLoggingIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // If we're already authenticated, or still loading the session, handle it
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-ivory">
        <Loader2 className="w-10 h-10 animate-spin text-primary-dark-teal" />
      </div>
    );
  }

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/admin/dashboard';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      await login({ email, password });
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      if (isAxiosError(err)) {
        if (!err.response) {
          setErrorMsg('Network Error: Cannot connect to the server.');
        } else {
          setErrorMsg(err.response.data?.message || 'Invalid email or password.');
        }
      } else {
        setErrorMsg('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-soft-ivory p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-light-neutral overflow-hidden">
        
        <div className="p-8 pb-6 border-b border-light-neutral bg-soft-ivory/30 text-center">
          <h1 className="text-2xl font-bold tracking-wider text-primary-dark uppercase">
            Mobitech <span className="text-primary-dark-teal">Admin</span>
          </h1>
          <p className="text-sm text-primary-dark/60 mt-2">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-dark" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-light-neutral focus:border-primary-dark-teal focus:ring-1 focus:ring-primary-dark-teal outline-none transition-all"
              placeholder="admin@mobitech.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-dark" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-light-neutral focus:border-primary-dark-teal focus:ring-1 focus:ring-primary-dark-teal outline-none transition-all"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full py-3 mt-4 flex items-center justify-center gap-2"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

      </div>
      
      <div className="mt-8 text-sm text-primary-dark/40">
        &copy; {new Date().getFullYear()} Mobitech Admin System
      </div>
    </div>
  );
}
