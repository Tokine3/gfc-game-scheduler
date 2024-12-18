'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const status = searchParams.get('status');
    const redirect = searchParams.get('redirect');

    if (status === 'success') {
      const redirectPath = sessionStorage.getItem('redirectPath') || '/servers';
      sessionStorage.removeItem('redirectPath');
      router.replace(redirect || redirectPath);
    }
  }, [router, searchParams]);

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-100' />
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center min-h-screen'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-100' />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
