/**
 * Data Library
 */

import pg from 'pg';

import { formatCurrency } from './utility';

const { Pool } = pg;

const configuration = {
  connectionString: process.env.POSTGRES_URL,
};

const pool = new Pool(configuration);

export async function fetchRevenue() {
  const client = await pool.connect();
  try {
    // We artificially delay a response for demo purposes.
    // Don't do this in production :)
    console.debug('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const result = await client.query(`SELECT * FROM revenue`);
    console.debug('Data fetch completed after 5 seconds.');

    return result.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  } finally {
    client.release();
  }
};

export async function fetchLatestInvoices() {
  const client = await pool.connect();
  try {
    console.debug('Fetching latest invoices data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.debug('Data fetch completed after 3 seconds.');

    // Fetch the last 5 invoices, sorted by date
    const result = await client.query(`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5
    `);
    return result.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  } finally {
    client.release();
  }
};

export async function fetchCardData() {
  const client = await pool.connect();
  try {
    console.debug('Fetching card data...');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.debug('Data fetch completed after 1.5 seconds.');

    const invoiceCountPromise = client.query(`SELECT COUNT(*) FROM invoices`);
    const customerCountPromise = client.query(`SELECT COUNT(*) FROM customers`);
    const invoiceStatusPromise = client.query(`
      SELECT
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
      FROM invoices`
    );

    const result = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(result[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(result[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(result[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(result[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  } finally {
    client.release();
  }
};

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  // console.log('Fetching filtered invoices data...');
  // await new Promise((resolve) => setTimeout(resolve, 2500));
  // console.log('Data fetch completed after 2.5 seconds.');

  const client = await pool.connect();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await client.query(`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE $1 OR
        customers.email ILIKE $2 OR
        invoices.amount::text ILIKE $3 OR
        invoices.date::text ILIKE $4 OR
        invoices.status ILIKE $5
      ORDER BY invoices.date DESC
      LIMIT $6 OFFSET $7
      `, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, ITEMS_PER_PAGE, offset]
    );

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  } finally {
    client.release();
  }
};

export async function fetchInvoicesPages(query: string) {
  const client = await pool.connect();

  try {
    const count = await client.query(`
      SELECT COUNT(*)
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE $1 OR
        customers.email ILIKE $2 OR
        invoices.amount::text ILIKE $3 OR
        invoices.date::text ILIKE $4 OR
        invoices.status ILIKE $5
      `, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
    );

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
};

export async function fetchInvoiceById(id: string) {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = $1;
    `, [id]);

    const invoice = result.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    console.debug(`Invoice: ${invoice}`)
    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  } finally {
    client.release();
  }
};

export async function fetchCustomers() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `);

    const customers = result.rows;
    return customers;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all customers.');
  } finally {
    client.release();
  }
};

export async function fetchFilteredCustomers(query: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT
        customers.id,
        customers.name,
        customers.email,
        customers.image_url,
        COUNT(invoices.id) AS total_invoices,
        SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
        SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
      FROM customers
      LEFT JOIN invoices ON customers.id = invoices.customer_id
      WHERE
        customers.name ILIKE $1 OR
          customers.email ILIKE $2
      GROUP BY customers.id, customers.name, customers.email, customers.image_url
      ORDER BY customers.name ASC
    `, [`%${query}%`, `%${query}%`]);

    const customers = result.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer table.');
  } finally {
    client.release();
  }
};
