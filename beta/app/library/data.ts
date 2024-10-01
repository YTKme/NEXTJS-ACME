/**
 * Data
 */

import { createClient } from '@vercel/postgres';

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
