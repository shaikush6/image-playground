import { getSupabaseServiceRoleClient } from './supabaseServer';

type AppMode = 'color' | 'product' | 'invitation';

interface PersistedAsset {
  sessionKey?: string | null;
  appMode: AppMode;
  kind: string;
  source: string;
  url?: string | null;
  dataUrl?: string | null;
  prompt?: string | null;
  metadata?: Record<string, unknown> | null;
  palette?: unknown;
}

interface SessionStatePayload {
  mode: AppMode;
  state: Record<string, unknown>;
}

export async function saveSessionState(sessionKey: string, payload: SessionStatePayload) {
  if (!sessionKey) return;

  const supabase = getSupabaseServiceRoleClient();
  await supabase
    .from('sessions')
    .upsert({
      session_key: sessionKey,
      mode: payload.mode,
      state: payload.state,
    });
}

export async function fetchSessionState(sessionKey: string) {
  if (!sessionKey) return null;

  const supabase = getSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('session_key', sessionKey)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function recordGeneratedAsset(asset: PersistedAsset) {
  const { sessionKey = null, metadata = null, palette = null, ...rest } = asset;
  const supabase = getSupabaseServiceRoleClient();

  await supabase.from('assets').insert({
    session_key: sessionKey,
    metadata,
    palette,
    ...rest,
  });
}
