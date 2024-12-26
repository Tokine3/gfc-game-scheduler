'use client';

import { useEffect, useState } from 'react';
import { SWRConfig } from 'swr';
import { ReactNode } from 'react';
import { initializeApp } from 'firebase/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Firebaseの初期化
    initializeApp(firebaseConfig);
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <SWRConfig
      value={{
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        shouldRetryOnError: false,
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SWRConfig>
  );
}
