import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import { client } from '../lib/api';
import { logger } from '../lib/logger';
import { useAuth } from '../app/hooks/useAuth';

type UseLogoutReturn = {
  logout: () => Promise<void>;
};

/**
 * @description ログアウト処理を管理するカスタムフック
 */
export function useLogout(): UseLogoutReturn {
  const router = useRouter();
  const { user } = useAuth();

  const logout = useCallback(async () => {
    try {
      logger.info('Starting logout process');
      const auth = getAuth();

      // Firebase認証のログアウト
      await signOut(auth);
      logger.info('Firebase signOut completed');

      // 認証関連のストレージをクリア
      const storageKeys = [
        'discord_id',
        'discord_token',
        'discord_state',
        'discord_name',
        'discord_email',
        'discord_avatar',
      ];
      storageKeys.forEach((key) => localStorage.removeItem(key));
      sessionStorage.clear();
      logger.info('Auth storage cleared');

      // ログインページへリダイレクト
      router.replace('/login');
      logger.info('Logout completed successfully');
    } catch (error) {
      logger.error('Logout failed:', error);
      throw error;
    }
  }, [router]);

  return { logout };
}
