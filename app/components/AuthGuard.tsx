'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardSkeleton } from './Skeleton';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/mn/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <DashboardSkeleton />;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
