import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { client } from '../../lib/api';
import { User } from '../../api/@types';
import { logger } from '../../lib/logger';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const verifyResponse = await client.auth.verify.get();
        if (!verifyResponse.body.userId) {
          setUser(null);
          return;
        }

        const response = await client.user.login.get();
        setUser(response.body);
      } catch (error) {
        logger.error('Auth check failed:', error);
        logger.error('Authentication failed');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, loading };
};
