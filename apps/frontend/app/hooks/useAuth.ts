import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { client } from '../../lib/api';
import { User } from '../../apis/@types';

export const useAuth = (skipInitialCheck: boolean = false) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('checkAuth');
        console.log('設定されているCookieの確認', document.cookie);
        const response = await client.user.login.$get();
        console.log('response', response);
        setUser(response);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (skipInitialCheck || pathname === '/login') {
      setLoading(false);
      return;
    }

    checkAuth();
  }, [skipInitialCheck, pathname]);

  return { user, loading };
};
