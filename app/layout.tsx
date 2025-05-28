import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';
import './globals.css';

// Metadatos reales
export const metadata: Metadata = {
  title: 'Tundata',
  description:
    'Accede a información pública verificada y participa en la transformación de Duitama.',
};

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${ibmPlexSans.className} antialiased`}>{children}</body>
    </html>
  );
}
