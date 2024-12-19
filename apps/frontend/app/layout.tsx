import './globals.css';
import { Inter } from 'next/font/google';
import './styles/calendar.css';
import { ThemeProvider } from 'next-themes';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GFC Scheduler',
  description: 'GFC Scheduler',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ja' suppressHydrationWarning>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/40 to-pink-900/30`}
        style={{
          backgroundImage: `
            radial-gradient(circle at top left, rgba(76, 29, 149, 0.3) 0%, transparent 50%),
            radial-gradient(circle at top right, rgba(219, 39, 119, 0.3) 0%, transparent 50%),
            radial-gradient(circle at bottom left, rgba(88, 28, 135, 0.3) 0%, transparent 50%),
            linear-gradient(to bottom right, rgb(3, 7, 18), rgb(10, 10, 10))
          `,
        }}
      >
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
