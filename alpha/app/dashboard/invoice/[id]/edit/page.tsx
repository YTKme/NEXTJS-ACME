/**
 * Invoice Edit Page
 */

import { notFound } from "next/navigation";

import Breadcrumb from "@/app/interface/invoice/breadcrumb";
import Form from '@/app/interface/invoice/edit-form';
import { fetchCustomers, fetchInvoiceById } from "@/app/library/data";

export default async function InvoiceEditPage(props: { params: Promise<{ id: string }> }) {
  const parameter = await props.params;
  const id = parameter.id;
  const [invoice, customerList] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <main>
      <Breadcrumb
        breadcrumbList={[
          { label: 'Invoice', href: '/dashboard/invoice' },
          { label: 'Edit', href: `/dashboard/invoice/${id}/edit`, active: true },
        ]}
      />
      <Form invoice={invoice} customerList={customerList} />
    </main>
  );
};
