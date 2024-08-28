/**
 * Root Layout
 */

import { Viewport } from 'next';

import reactArrayToTree from 'react-array-to-tree';

// Context

// CSS
import '@/style/global.scss';
import './root.css';

// Font
import { inter } from '@/app/interface/font';

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
