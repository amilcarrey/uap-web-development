import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { QueryProvider } from '@/components/QueryProvider'; // 👈 nuevo provider
import AuthProvider from '@/components/AuthProvider'; // 👈 nuevo provide
// r
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'To-do list',
  description: 'Lista de tareas',
  icons: {
    icon: '/monoconplatillos.gif',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>
          {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
