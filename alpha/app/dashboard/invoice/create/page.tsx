/**
 * Invoice Create Page
 */

import type { Metadata } from 'next';

import Breadcrumb from "@/app/interface/invoice/breadcrumb";
import Form from "@/app/interface/invoice/create-form";
import { fetchCustomers } from "@/app/library/data";

export const metadata: Metadata = {
  title: 'Create Invoice',
  description: 'NEXT.JS ACME | Invoice',
}

export default async function InvoiceCreatePage() {
  const customerList = await fetchCustomers();

  return (
    <main>
      <Breadcrumb
        breadcrumbList={[
          { label: 'Invoice', href: '/dashboard/invoice' },
          { label: 'Create', href: '/dashboard/invoice/create', active: true },
        ]}
      />
      <Form customerList={customerList} />
    </main>
  );
};
