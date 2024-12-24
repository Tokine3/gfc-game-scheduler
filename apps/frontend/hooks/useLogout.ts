import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import { client } from '../lib/api';
import { logger } from '../lib/logger';
import { useAuth } from '../app/hooks/useAuth';

export function useLogout() {
  const router = useRouter();
  const { user } = useAuth();

  const logout = useCallback(async () => {
    try {
      logger.info('Starting logout process...');
      const auth = getAuth();

      // Firebase認証のログアウト
      await signOut(auth);
      logger.info('Firebase signOut completed');

      // APIトークンの無効化
      // if (user) {
      //   await client.user._id(user.id).$delete();
      //   logger.info('API token invalidated');
      // }

      // 認証関連のストレージをクリア
      localStorage.removeItem('discord_id');
      localStorage.removeItem('discord_token');
      localStorage.removeItem('discord_state');
      sessionStorage.clear();
      logger.info('Auth storage cleared');

      // ログインページへリダイレクト
      router.push('/login');
      logger.info('Logout completed successfully');
    } catch (error) {
      logger.error('Logout failed:', error);
      throw error;
    }
  }, [router, user]);

  return { logout };
}
