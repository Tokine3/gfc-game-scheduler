'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { logger } from '../../../lib/logger';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const status = searchParams.get('status');
        const firebaseToken = searchParams.get('firebaseToken');
        const discordId = searchParams.get('discordId');
        const discordToken = searchParams.get('discordToken');

        logger.info('Auth callback received:', {
          status,
          hasFirebaseToken: !!firebaseToken,
          hasDiscordId: !!discordId,
          hasDiscordToken: !!discordToken,
        });

        if (!status || !firebaseToken || !discordId || !discordToken) {
          logger.error('Missing required parameters');
          throw new Error('Missing required parameters');
        }

        if (status !== 'success') {
          throw new Error('Authentication failed');
        }

        const auth = getAuth();
        logger.info('Signing in with custom token...');
        await signInWithCustomToken(auth, firebaseToken);
        logger.info('Successfully signed in with Firebase');

        // LocalStorageに認証情報を保存
        localStorage.setItem('discord_id', discordId);
        localStorage.setItem('discord_token', discordToken);
        localStorage.setItem(
          'discord_name',
          auth.currentUser?.displayName || ''
        );
        localStorage.setItem('discord_email', auth.currentUser?.email || '');
        localStorage.setItem(
          'discord_avatar',
          auth.currentUser?.photoURL || ''
        );

        logger.info('Stored auth data in localStorage');

        // 認証情報が確実に設定されるのを待つ
        await new Promise((resolve) => setTimeout(resolve, 1500));

        logger.info('Redirecting to servers page...');
        router.replace('/servers'); // pushではなくreplaceを使用
      } catch (error) {
        logger.error('Auth callback error:', error);
        router.replace('/login?error=auth_failed');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return null;
}
