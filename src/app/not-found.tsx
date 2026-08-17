'use client';

import NotFound from './[locale]/not-found';
import './globals.css';

export default function RootNotFound() {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background text-text-primary">
        <NotFound />
      </body>
    </html>
  );
}
