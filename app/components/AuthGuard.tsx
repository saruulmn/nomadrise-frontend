'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardSkeleton } from './Skeleton';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname?.startsWith('/en') ? 'en' : 'mn';

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push(`/${lang}/login`);
    }
  }, [session, status, router, lang]);

  if (status === 'loading') {
    return <DashboardSkeleton />;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
