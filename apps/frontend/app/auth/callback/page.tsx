'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { LoadingSpinner } from '../../components/ui/loading-spinner';

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

        if (
          status === 'success' &&
          firebaseToken &&
          discordId &&
          discordToken
        ) {
          // Firebaseの認証のみ実行（トークンは保存しない）
          const auth = getAuth();
          await signInWithCustomToken(auth, firebaseToken);

          // Discordの認証情報のみを保存
          localStorage.setItem('discord_id', discordId);
          localStorage.setItem('discord_token', discordToken);

          router.push('/servers');
          return;
        }

        console.error('Missing required parameters');
        router.push('/login?error=missing_params');
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/login?error=auth_failed');
      }
    };

    handleAuth();
  }, [router, searchParams]);

  return <LoadingSpinner message='認証中...' />;
}
