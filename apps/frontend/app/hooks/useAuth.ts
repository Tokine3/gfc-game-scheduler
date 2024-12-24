import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
  signOut,
} from 'firebase/auth';

export type DiscordUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

type AuthUser = {
  firebase: FirebaseUser | null;
  discord: DiscordUser | null;
};

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser>({ firebase: null, discord: null });
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/login') {
      setLoading(false);
      return;
    }

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // LocalStorageに認証情報を保存
          localStorage.setItem('discord_id', firebaseUser.uid);
          // Discordトークンはコールバック時に保存済みなので、ここでは設定しない
          // localStorage.setItem('discord_token', token); // この行を削除

          setUser({
            firebase: firebaseUser,
            discord: {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              avatar: firebaseUser.photoURL || '',
            },
          });
        } catch (error) {
          console.error('Failed to fetch Discord user:', error);
          setUser({ firebase: firebaseUser, discord: null });
        }
      } else {
        setUser({ firebase: null, discord: null });
        // LocalStorageから認証情報を削除
        localStorage.removeItem('discord_id');
        localStorage.removeItem('discord_token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname]);

  const logout = useCallback(async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setUser({ firebase: null, discord: null });
      // LocalStorageから認証情報を削除
      localStorage.removeItem('discord_id');
      localStorage.removeItem('discord_token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, []);

  return {
    user: user.discord,
    firebaseUser: user.firebase,
    logout,
    loading,
  };
};
