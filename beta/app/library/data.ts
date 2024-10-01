/**
 * Data
 */

import { createClient, sql } from '@vercel/postgres';

export async function connectDatabase() {
  const client = createClient();
  await client.connect();

  try {
    if (client) {
      console.debug('Connected To Database');
      return client;
    }
  } catch (error) {
    console.error('Error Connecting To Database:', error);
  }
}

export async function getPost() {
  try {
    const data = await sql`SELECT * FROM post LIMIT 2;`;
    console.debug('Data:', data.rows);
    return data.rows;
  } catch (error) {
    console.error('Error getting post.', error);
  }
}
