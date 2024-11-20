/**
 * Authentication
 */

import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import pg from 'pg';
import { z } from 'zod';

import { User } from '@/app/library/definition';
import { authConfig } from "./auth.config";

const { Pool } = pg;
const configuration = { connectionString: process.env.POSTGRES_URL };
const pool = new Pool(configuration);

async function getUser(email: string): Promise<User | undefined> {
  const client = await pool.connect();

  try {
    console.debug('Fetching user...');
    const user = await client.query(`
      SELECT * FROM users WHERE email = '${email}'
    `);
    console.debug('Fetching user completed.');
    return user.rows[0];
  } catch (error) {
    console.error('Failed To Fetch User:', error);
    throw new Error('Failed To Fetch User.');
  } finally {
    client.release();
  }
}

export const { auth, signIn, signOut }: { auth: any, signIn: any, signOut: any } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) return user;
        }

        console.warn('Invalid Credential(s)')
        return null;
      },
    }),
  ],
});
