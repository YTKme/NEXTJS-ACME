/**
 * Seed
 */

import bcrypt from 'bcrypt';

import pg from 'pg';

import { customers, invoices, revenue, users } from '../library/placeholder-data';

const { Pool, Client } = pg;

const configuration = {
  connectionString: process.env.POSTGRES_URL,
};

const pool = new Pool(configuration);

async function seedUser() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.query(
          'INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING;',
          [user.id, user.name, user.email, hashedPassword],
        );
      }),
    );
    await client.query('COMMIT');

    return insertedUsers;
  } catch (error) {
    await client.query('ROLLBACK')
    throw error;
  } finally {
    client.release();
  }
}

async function seedCustomer() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await client.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `);

    const insertedCustomers = await Promise.all(
      customers.map(
        (customer) =>
          client.query(
            'INSERT INTO customers (id, name, email, image_url) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING;',
            [customer.id, customer.name, customer.email, customer.image_url],
          ),
      ),
    );
    await client.query('COMMIT');

    return insertedCustomers;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function seedInvoice() {
  const client = await pool.connect();
  try {
    await client.query(`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `);

    const insertedInvoices = await Promise.all(
      invoices.map(
        (invoice) =>
          client.query(
            'INSERT INTO invoices (customer_id, amount, status, date) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING;',
            [invoice.customer_id, invoice.amount, invoice.status, invoice.date],
          ),
      ),
    );

    return insertedInvoices;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function seedRevenue() {
  const client = await pool.connect();
  try {
    await client.query(`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `);

    const insertedRevenues = await Promise.all(
      revenue.map(
        (rev) =>
          client.query(
            'INSERT INTO revenue (month, revenue) VALUES ($1, $2) ON CONFLICT (month) DO NOTHING;',
            [rev.month, rev.revenue],
          ),
      ),
    );

    return insertedRevenues;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function GET() {
  // return Response.json({
  //   message:
  //     'Uncomment this file and remove this line. You can delete this file when you are finished.',
  //     output,
  // });
  try {
    await seedUser();
    await seedCustomer();
    await seedInvoice();
    await seedRevenue();

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    // await pool.query('ROLLBACK');
    return Response.json({ error }, { status: 500 });
  }
}
