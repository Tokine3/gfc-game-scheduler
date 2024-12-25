import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { logger } from '../../lib/logger';

type DiscordUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

type AuthUser = {
  firebase: FirebaseUser | null;
  discord: DiscordUser | null;
};

type UseAuthReturn = {
  user: DiscordUser | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
};

/**
 * @description 認証状態を管理するカスタムフック
 * @returns {UseAuthReturn} 認証情報とローディング状態
 */
export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState<AuthUser>({
    firebase: null,
    discord: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/login') {
      setIsLoading(false);
      return;
    }

    const auth = getAuth();

    const discordId = localStorage.getItem('discord_id');
    if (discordId) {
      setAuthState((current) => ({
        ...current,
        discord: {
          id: discordId,
          name: localStorage.getItem('discord_name') || '',
          email: localStorage.getItem('discord_email') || '',
          avatar: localStorage.getItem('discord_avatar') || '',
        },
      }));
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          localStorage.setItem('discord_id', firebaseUser.uid);
          localStorage.setItem('discord_name', firebaseUser.displayName || '');
          localStorage.setItem('discord_email', firebaseUser.email || '');
          localStorage.setItem('discord_avatar', firebaseUser.photoURL || '');

          setAuthState({
            firebase: firebaseUser,
            discord: {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              avatar: firebaseUser.photoURL || '',
            },
          });
        } catch (error) {
          logger.error('Failed to fetch Discord user:', error);
          setAuthState({ firebase: firebaseUser, discord: null });
        }
      } else {
        localStorage.removeItem('discord_id');
        localStorage.removeItem('discord_name');
        localStorage.removeItem('discord_email');
        localStorage.removeItem('discord_avatar');
        setAuthState({ firebase: null, discord: null });
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [pathname]);

  return {
    user: authState.discord,
    firebaseUser: authState.firebase,
    isLoading,
  };
};
