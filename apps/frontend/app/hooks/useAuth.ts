import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { logger } from '../../lib/logger';

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
          localStorage.setItem('discord_id', firebaseUser.uid);
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
          logger.error('Failed to fetch Discord user:', error);
          setUser({ firebase: firebaseUser, discord: null });
        }
      } else {
        setUser({ firebase: null, discord: null });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname]);

  return {
    user: user.discord,
    firebaseUser: user.firebase,
    loading,
  };
};
