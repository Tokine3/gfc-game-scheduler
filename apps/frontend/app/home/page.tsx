'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Calendar from '../components/Calendar';
import Header from '../components/Header';
import { client } from '../../lib/api';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await client.user.login.get();
        console.log('User data:', response.body);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        // APIサーバーに接続できない場合はログインページへ
        router.push('/');
      }
    };

    fetchUser();
  }, [router]);

  return (
    <div className='min-h-screen text-gray-100'>
      <Header />
      <main className='container mx-auto p-4'>
        <Calendar />
      </main>
    </div>
  );
}
