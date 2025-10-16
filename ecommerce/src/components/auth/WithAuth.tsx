'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface WithAuthProps {
  children: React.ReactNode;
  requiredType?: 'ADMIN' | 'CLIENT';
}

export function WithAuth({ children, requiredType }: WithAuthProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (!isLoading && user && requiredType && user.type !== requiredType) {
      if (user.type === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/client');
      }
    }
  }, [user, isLoading, router, requiredType]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredType && user.type !== requiredType) {
    return null;
  }

  return <>{children}</>;
}