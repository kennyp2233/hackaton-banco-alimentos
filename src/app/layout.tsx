import { ReactNode } from 'react';
import { Gabarito } from 'next/font/google';
import Header from '@/shared/layout/Header';
import Footer from '@/shared/layout/Footer';
import './globals.css';

const gabarito = Gabarito({
  subsets: ['latin'],
  variable: '--font-gabarito',
  display: 'swap',
});

export const metadata = {
  title: 'Banco de Alimentos Quito | Donaciones',
  description: 'Ayuda a combatir el hambre y reducir el desperdicio de alimentos en Quito.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${gabarito.variable} font-gabarito min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}