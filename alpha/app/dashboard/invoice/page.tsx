/**
 * Invoice Page
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';

// import Pagination from '@/app/ui/invoices/pagination';
import { CreateInvoice } from '@/app/interface/invoice/button';
import Pagination from '@/app/interface/invoice/pagination';
import Table from '@/app/interface/invoice/table';
import Search from '@/app/interface/search';
import { InvoicesTableSkeleton } from '@/app/interface/skeleton';

import { lusitana } from '@/app/interface/font';

import { fetchInvoicesPages } from '@/app/library/data';

export const metadata: Metadata = {
  title: 'NEXT.JS ACME | Invoice',
  description: 'NEXT.JS ACME | Invoice',
}

export default async function InvoicePage({
  // Must be `searchParams`
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoice</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search Invoice..." />
        <CreateInvoice />
      </div>
       <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
