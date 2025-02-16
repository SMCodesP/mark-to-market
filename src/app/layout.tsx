import { Metadata } from 'next';

import './globals.css';

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `Calculadora - Marcação a Mercado`,
  description: `Calculadora de Marcação a Mercado, inspirado na estratégia da AUVP.`,
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
