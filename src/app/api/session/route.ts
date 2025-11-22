import { NextRequest, NextResponse } from 'next/server';
import { fetchSessionState, saveSessionState } from '@/lib/persistence';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
  }

  try {
    const session = await fetchSessionState(sessionId);
    return NextResponse.json({ session });
  } catch (error) {
    console.error('Failed to fetch session state', error);
    return NextResponse.json({ error: 'Unable to fetch session' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, mode, state } = body || {};

    if (!sessionId || !mode) {
      return NextResponse.json({ error: 'sessionId and mode are required' }, { status: 400 });
    }

    await saveSessionState(sessionId, { mode, state: state || {} });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save session state', error);
    return NextResponse.json({ error: 'Unable to persist session' }, { status: 500 });
  }
}
