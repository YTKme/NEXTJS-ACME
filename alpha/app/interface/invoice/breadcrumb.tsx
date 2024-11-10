/**
 * Invoice Breadcrumb
 */

import { clsx } from 'clsx';

import { lusitana } from '@/app/interface/font';
import Link from 'next/link';

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Breadcrumb({
  breadcrumbList,
}: {
  breadcrumbList: Breadcrumb[];
}) {
  return (
    <nav className='mb-6 block' aria-label='Breadcrumb'>
      <ol className={clsx(lusitana.className, 'flex text-xl md:text-2xl')}>
        {breadcrumbList.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            className={clsx(breadcrumb.active ? 'text-gray-900' : 'text-gray-500',)}
            aria-current={breadcrumb.active}
          >
            <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
            {index < breadcrumbList.length - 1 ? (
              <span className='mx-3 inline-block'>/</span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
};
