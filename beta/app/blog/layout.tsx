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
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-white">
      <div className="w-full flex-none md:w-64">
        <SideNavigation />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        {children}
      </div>
    </div>
  )
}
