import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

let serverClient: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseServiceRoleClient() {
  if (serverClient) {
    return serverClient;
  }

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Missing Supabase server environment variables.');
  }

  serverClient = createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false },
  });

  return serverClient;
}
