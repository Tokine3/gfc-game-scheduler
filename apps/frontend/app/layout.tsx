import './globals.css';
import { Inter } from 'next/font/google';
import './styles/calendar.css';
import { ThemeProvider } from '@/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'FPS Gamer Discord Scheduler',
  description: 'Schedule your gaming sessions with style',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.className} bg-[#0f0f0f]`}>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
