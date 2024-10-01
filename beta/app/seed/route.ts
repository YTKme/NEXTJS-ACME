/**
 * Seed
 */

// import bcrypt from 'bcrypt';
import pg from 'pg';

import { postList } from '@/app/library/placeholder-data';

const { Pool, Client } = pg;

// const pool = new Pool({
//   host: process.env.POSTGRES_HOST,
//   user: process.env.POSTGRES_USERNAME,
//   password: process.env.POSTGRES_PASSWORD,
//   database: process.env.POSTGRES_DATABASE,
//   ssl: false,
// });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

async function seedPost() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS post (
        id UUID DEFAULT uuid_generate_v1mc() PRIMARY KEY,
        author VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL UNIQUE,
        content TEXT NOT NULL,
        date TEXT NOT NULL
      );
    `);

    const insertedPost = await Promise.all(
      postList.map(async (post) => {
        return client.query(
          'INSERT INTO post (id, author, title, content, date) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING;',
          [post.id, post.user, post.title, post.content, post.date],
        );
      }),
    );

    await client.query('COMMIT');

    return insertedPost;
  } catch (error) {
    await client.query('ROLLBACK')
    throw error;
  } finally {
    client.release();
  }
}

export async function GET() {
  try {
    await seedPost();

    return Response.json({ message: 'Database seeded successfully.' });
  } catch (error) {
    // await pool.query('ROLLBACK');
    return Response.json({ error }, { status: 500 });
  }
};
