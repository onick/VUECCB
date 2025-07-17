'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
        return;
      }

      if (requireAdmin && !user?.is_admin) {
        router.push('/');
        return;
      }

      setChecking(false);
    }
  }, [isAuthenticated, user, loading, requireAdmin, router]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-ccb-blue rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">CCB</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ccb-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect is happening
  }

  if (requireAdmin && !user?.is_admin) {
    return null; // Redirect is happening
  }

  return <>{children}</>;
}
