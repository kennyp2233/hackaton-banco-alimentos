import { ReactNode } from 'react';
import { Gabarito } from 'next/font/google';
import Script from 'next/script';
import Header from '@/shared/layout/Header';
import Footer from '@/shared/layout/Footer';
import EmergencyAlert from '@/shared/components/EmergencyAlert';
import './globals.css';
import './PayboxOverride.css'

import PagoPluxScripts from '@/shared/components/PagoPluxScripts';

const gabarito = Gabarito({
  subsets: ['latin'],
  variable: '--font-gabarito',
  display: 'swap',
});

export const metadata = {
  title: 'Banco de Alimentos Quito | Donaciones',
  description: 'Ayuda a combatir el hambre y reducir el desperdicio de alimentos en Quito.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <Script id="jquery"
          src="https://code.jquery.com/jquery-3.4.1.min.js"
          strategy="beforeInteractive" />

        <Script id="pagoplux-sdk"
          src="https://sandbox-paybox.pagoplux.com/paybox/index_angular.js"
          strategy="afterInteractive"
        />
      </head>

      <body
        className={`${gabarito.variable} font-gabarito min-h-screen flex flex-col`}
      >
        <EmergencyAlert />

        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
