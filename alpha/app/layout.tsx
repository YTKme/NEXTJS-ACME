/**
 * Root Layout
 */

import { Metadata, Viewport } from 'next';

import reactArrayToTree from 'react-array-to-tree';

// Context

// CSS
import '@/style/global.scss';
import './root.css';

// Font
import { inter } from '@/app/interface/font';

export const metadata: Metadata = {
  title: {
    template: '%s | ACME Dashboard',
    default: 'ACME Dashboard',
  },
  description: 'The official NEXT.JS Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

const ProviderTree = reactArrayToTree([

]);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className} antialiased`}>
        <ProviderTree>
          {children}
        </ProviderTree>
      </body>
    </html>
  )
}
