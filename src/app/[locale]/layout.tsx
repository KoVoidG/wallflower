import { ReactNode } from 'react';
import { Geist, Geist_Mono, Noto_Sans_Thai } from 'next/font/google';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const notoTh = Noto_Sans_Thai({
  variable: '--font-noto-thai',
  subsets: ['thai'],
  weight: ['400', '500', '700'],
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} ${notoTh.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
