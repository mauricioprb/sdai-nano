import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'SDAI - Scientific Data Authenticity Identification',
  description:
    'Proveniência verificável de microscopias de microscopia eletrônica com julgamento baseado em metadados e assinaturas digitais.',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
