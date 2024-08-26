/**
 * Root Page
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onigiri',
  description: 'Onigiri',
}

export default function Page() {
  return (
    <div className='d-flex w-100 h-100'>
      <div className='w-100'>
        <header>
          <h1>Onigiri</h1>
        </header>
        <main className='text-center'>
          <p>Onigiri</p>
        </main>
      </div>
    </div>
  );
}
