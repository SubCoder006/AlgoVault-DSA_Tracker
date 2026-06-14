import type { Metadata, Viewport } from 'next';
import { Inter }                   from 'next/font/google';
import AuthSessionProvider         from '@/components/providers/SessionProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'AlgoVault — DSA Tracker',
  description: 'Track problems, identify weak areas, revise smarter.',
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#070B14] text-[#F1F5F9] antialiased min-h-screen">
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}