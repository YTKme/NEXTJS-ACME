/**
 * Dashboard Page
 */

import { Suspense } from 'react';

import type { Metadata } from 'next';

import { Card } from '@/app/dashboard/card';
import LatestInvoices from '@/app/dashboard/latestinvoice';
import RevenueChart from '@/app/dashboard/revenuechart';
import {
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
} from '@/app/interface/skeleton';

import {
  fetchCardData
} from '@/app/library/data';

import { lusitana } from '@/app/interface/font';

export const metadata: Metadata = {
  title: 'NEXT.JS ACME | Dashboard',
  description: 'NEXT.JS ACME | Dashboard',
}

export default async function DashboardPage() {
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData(); // wait for fetchLatestInvoices() to finish

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card title="Total Customers" value={numberOfCustomers} type="customers" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}
