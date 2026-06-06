import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '@/lib/api';

// Checks if the user has a valid session by pinging a protected endpoint.
// If the server returns 401, the axios interceptor redirects to /login.
// This component shows nothing while checking, then renders children if authenticated.
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'checking' | 'ok' | 'unauth'>('checking');

  useEffect(() => {
    api.get('/customer')
      .then(() => setStatus('ok'))
      .catch(() => setStatus('unauth'));
  }, []);

  if (status === 'checking') return null;
  if (status === 'unauth') return <Navigate to="/login" replace />;
  return <>{children}</>;
}
