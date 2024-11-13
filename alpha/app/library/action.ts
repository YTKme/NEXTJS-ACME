/**
 * Action
 */

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import pg from 'pg';
import { z } from 'zod';

const { Pool } = pg;
const configuration = { connectionString: process.env.POSTGRES_URL };
const pool = new Pool(configuration);

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCent = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // Debug
  console.debug(`Customer ID: ${customerId}`);
  console.debug(`Amount: ${amount}`);
  console.debug(`Status: ${status}`);
  console.debug(`Amount in Cent: ${amountInCent}`);
  console.debug(`Date: ${date}`);

  // Insert Data
  const client = await pool.connect();
  try {
    console.debug('Creating invoice...');
    await client.query(`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES ('${customerId}', ${amountInCent}, '${status}', '${date}')
    `);
    console.debug('Creating invoice completed.');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create invoice.');
  } finally {
    client.release();
  }

  // Revalidate Path
  revalidatePath('/dashboard/invoice');
  // Redirect
  redirect('/dashboard/invoice');
};

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCent = amount * 100;

  const client = await pool.connect();
  // Update Data
  try {
    console.debug('Updating invoice...');
    await client.query(`
      UPDATE invoices
      SET customer_id = '${customerId}', amount = ${amountInCent}, status = '${status}'
      WHERE id = '${id}'
    `);
    console.debug('Updating invoice completed.');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update invoice.');
  } finally {
    client.release();
  }

  // Revalidate Path
  revalidatePath('/dashboard/invoice');
  // Redirect
  redirect('/dashboard/invoice');
};

export async function deleteInvoice(id: string) {
  // Test
  throw new Error('Failed to Delete Invoice');

  const client = await pool.connect();
  // Delete Data
  try {
    console.debug('Deleting invoice...');
    await client.query(`
      DELETE FROM invoices
      WHERE id = '${id}'
    `);
    console.debug('Deleting invoice completed.');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete invoice.');
  } finally {
    client.release();
  }

  // Revalidate Path
  revalidatePath('/dashboard/invoice');
};
