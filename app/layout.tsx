import './globals.css';
import { Libre_Baskerville } from 'next/font/google';

import '@/devlink/global.css';
import { DevLinkProvider } from '@/devlink';

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: '400',
});

export const metadata = {
  title: 'The Future of FATCA/CRS Compliance',
  description: 'The Future of FATCA/CRS Compliance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={libreBaskerville.className}>
        <DevLinkProvider>
          {children}
        </DevLinkProvider>
      </body>
    </html>
  );
}
