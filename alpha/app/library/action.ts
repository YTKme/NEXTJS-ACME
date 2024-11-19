/**
 * Action
 */

'use server';

import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import pg from 'pg';
import { z } from 'zod';

import { signIn } from '@/auth';

export type State = {
  message: string | null;
  error?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  }
}

const { Pool } = pg;
const configuration = { connectionString: process.env.POSTGRES_URL };
const pool = new Pool(configuration);

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce.number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form field using Zod
  const validateField = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fail, return error early. Otherwise, continue.
  if (!validateField.success) {
    return {
      message: 'Missing Field(s). Failed to Create Invoice.',
      error: validateField.error.flatten().fieldErrors,
    }
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validateField.data;
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

export async function updateInvoice(
  id: string,
  previousState: State, // Order matter, come after `id`
  formData: FormData
) {
  // Validate form field using Zod
  const validateField = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fail, return error early. Otherwise, continue.
  if (!validateField.success) {
    return {
      message: 'Missing Field(s). Failed to Update Invoice.',
      error: validateField.error.flatten().fieldErrors,
    }
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validateField.data;
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
  // throw new Error('Failed to Delete Invoice');

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

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return ' Invalid Credential(s)';
        default:
          return 'Something Went Wrong.';
      }
    }
    throw error;
  }
}
