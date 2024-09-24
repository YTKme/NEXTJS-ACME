/**
 * Navigation Link Component
 */

'use client';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  DocumentDuplicateIcon,
  EnvelopeIcon,
  HomeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const links = [
  { name: 'Home', href: '/', icon: HomeIcon },
  {
    name: 'Post',
    href: '/blog/post',
    icon: DocumentDuplicateIcon,
  },
  { name: 'About', href: '/blog/about', icon: UserGroupIcon },
  { name: 'Contact', href: '/blog/contact', icon: EnvelopeIcon },
];

export default async function NavigationLink() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className="'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-purple-100 md:flex-none md:justify-start md:p-2 md:px-3'"
          >
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
};
