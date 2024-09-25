/**
 * Root Layout
 */

import { Metadata, Viewport } from 'next';

import { Inter } from "next/font/google";

// CSS
import '@/style/global.scss';
import './root.css';

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
