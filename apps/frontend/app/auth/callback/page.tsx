'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth, signInWithCustomToken } from 'firebase/auth';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const status = searchParams.get('status');
        const firebaseToken = searchParams.get('firebaseToken');
        const discordId = searchParams.get('discordId');
        const discordToken = searchParams.get('discordToken');

        if (!status || !firebaseToken || !discordId || !discordToken) {
          throw new Error('Missing required parameters');
        }

        if (status === 'success') {
          const auth = getAuth();
          await signInWithCustomToken(auth, firebaseToken);

          // LocalStorageに認証情報を保存
          localStorage.setItem('discord_id', discordId);
          localStorage.setItem('discord_token', discordToken);

          router.replace('/servers');
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.replace('/login?error=auth_failed');
      }
    };

    handleAuth();
  }, [router, searchParams]);

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center'>
        <div className='w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto' />
        <p className='mt-4 text-gray-500'>認証中...</p>
      </div>
    </div>
  );
}
