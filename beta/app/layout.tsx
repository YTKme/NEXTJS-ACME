/**
 * Root Layout
 */

import { Metadata, Viewport } from 'next';

import { Inter, Roboto } from "next/font/google";

// CSS
import '@/style/global.scss';
import './root.css';

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NEXT.JS Blog',
  description: 'NEXT.JS Blog',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang='en'>
      <body className={roboto.className}>
        {children}
      </body>
    </html>
  )
}
