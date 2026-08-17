import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/providers/theme-provider';
import '../globals.css';
import '../print.css';

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/wallflower-logo 1.png', sizes: 'any', type: 'image/png' },
      { url: '/wallflower-logo 1.png', sizes: '192x192', type: 'image/png' },
      { url: '/wallflower-logo 1.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/wallflower-logo 1.png',
    apple: '/wallflower-logo 1.png',
  },
};

const inter = { variable: 'font-inter' };
const spaceGrotesk = { variable: 'font-space-grotesk' };
const jetbrainsMono = { variable: 'font-jetbrains-mono' };
const notoTh = { variable: 'font-noto-thai' };

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${notoTh.variable} antialiased bg-background text-text-primary`} suppressHydrationWarning>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
