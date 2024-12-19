import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

export const useAuth = (skipInitialCheck: boolean = false) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (skipInitialCheck || pathname === '/login') {
      setLoading(false);
      return;
    }

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [skipInitialCheck, pathname]);

  return { user, loading };
};
