import { NextResponse } from 'next/server';
import callOnChatAgent from '../../../lib/chatAgent';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ message: 'Invalid query provided' }, { status: 400 });
    }

    // Get the response from the chat agent based on the user query
    const response = await callOnChatAgent(query);

    return NextResponse.json({ response: response });
  } catch (error) {
    console.error('Error processing the query:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
