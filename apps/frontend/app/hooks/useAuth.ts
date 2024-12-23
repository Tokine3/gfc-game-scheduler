import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { getAuth, onAuthStateChanged, User, signOut } from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/login') {
      setLoading(false);
      return;
    }

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname]);

  const logout = useCallback(async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Firebase logout error:', error);
      throw error;
    }
  }, []);

  return {
    user,
    logout,
    loading,
  };
};
