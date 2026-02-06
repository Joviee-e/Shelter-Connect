import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const missingSupabaseEnv = !SUPABASE_URL || !SUPABASE_ANON_KEY;

export const authDisabled = missingSupabaseEnv || import.meta.env.VITE_AUTH_DISABLED === 'true';

const createMockSupabaseClient = (): SupabaseClient<Database> => {
  const error = new Error('Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in a .env file.');

  const mockQuery = () => ({
    select: () => mockQuery(),
    eq: () => mockQuery(),
    single: async () => ({ data: null, error }),
    insert: async () => ({ data: null, error }),
    update: async () => ({ data: null, error }),
    delete: async () => ({ data: null, error }),
  });

  return {
    auth: {
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => undefined } },
      }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signUp: async () => ({ data: { user: null, session: null }, error }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error }),
      signOut: async () => ({ error: null }),
    },
    from: () => mockQuery(),
  } as unknown as SupabaseClient<Database>;
};

if (missingSupabaseEnv) {
  console.warn(
    'Supabase env vars missing. The app will run with auth disabled until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  );
}

if (!missingSupabaseEnv && authDisabled) {
  console.warn('Auth disabled via VITE_AUTH_DISABLED. Enable auth by setting VITE_AUTH_DISABLED=false.');
}

export const supabase = authDisabled
  ? createMockSupabaseClient()
  : createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    });
