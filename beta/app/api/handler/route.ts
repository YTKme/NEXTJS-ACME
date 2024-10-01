/**
 * API Handler
 */

import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const postList = await sql`SELECT * FROM post ORDER BY date DESC LIMIT 2;`;
    return NextResponse.json({ postList }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const title = searchParams.get('title');
  const content = searchParams.get('content');
  const date = searchParams.get('date');

  try {
    // SQL query to insert a new post
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
