import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceRoleClient } from '@/lib/supabaseServer';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');
  const kind = request.nextUrl.searchParams.get('kind');

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServiceRoleClient();
    let query = supabase.from('assets').select('*').eq('session_key', sessionId).order('created_at', { ascending: false }).limit(200);
    if (kind) {
      query = query.eq('kind', kind);
    }
    const { data, error } = await query;
    if (error) {
      throw error;
    }
    return NextResponse.json({ assets: data });
  } catch (error) {
    console.error('Failed to fetch assets', error);
    return NextResponse.json({ error: 'Unable to fetch assets' }, { status: 500 });
  }
}
