import './globals.css';
import { Inter } from 'next/font/google';
import './styles/calendar.css';
import { ThemeProvider } from 'next-themes';

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
          <div className='contents'>{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
