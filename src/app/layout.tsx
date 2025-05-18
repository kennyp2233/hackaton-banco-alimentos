import { ReactNode } from 'react';
import { Gabarito } from 'next/font/google';
import Header from '@/shared/layout/Header';
import Footer from '@/shared/layout/Footer';
import EmergencyAlert from '@/shared/components/EmergencyAlert';
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
        {/* Alerta de emergencia en la parte superior */}
        <EmergencyAlert />

        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>


        Sandbox:
        <script src="https://sandbox-paybox.pagoplux.com/paybox/index_angular.js"></script>
        Producción:
        <script src="https://paybox.pagoplux.com/paybox/index_angular.js"></script>



      </body>
    </html>
  );
}