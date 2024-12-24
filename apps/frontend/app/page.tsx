'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from './components/LoadingScreen';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/servers');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return <LoadingScreen message='リダイレクト中...' />;
}
