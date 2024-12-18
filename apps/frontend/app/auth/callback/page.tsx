'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { logger } from '../../../lib/logger';

export default function AuthCallback() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const redirectPath = sessionStorage.getItem('redirectPath');

  useEffect(() => {
    logger.log('Auth Callback - Loading:', loading, 'User:', user);
    logger.log('Redirect Path:', redirectPath);

    if (!loading) {
      if (user) {
        if (redirectPath) {
          logger.log('Redirecting to saved path:', redirectPath);
          sessionStorage.removeItem('redirectPath');
          router.replace(redirectPath);
        } else {
          logger.log('No redirect path, going to /servers');
          router.replace('/servers');
        }
      } else {
        logger.log('No user, redirecting to /login');
        router.replace('/login');
      }
    }
  }, [loading, user, router, redirectPath]);

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-950'>
      <div className='text-center space-y-4'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-100 mx-auto' />
        <p className='text-gray-400'>読込中...</p>
      </div>
    </div>
  );
}
