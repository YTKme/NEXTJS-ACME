/**
 * Blog Layout
 */

import { Viewport } from 'next';

import SideNavigation from '@/app/interface/component/sidenavigation';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '10%' }}>
        <SideNavigation />
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}
