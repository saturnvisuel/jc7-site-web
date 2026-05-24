import { createClient } from "@supabase/supabase-js";

// Client admin Supabase pour contourner les problèmes SSL en développement
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: (...args) => {
        // Désactiver la vérification SSL en développement
        if (process.env.NODE_ENV === 'development') {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        }
        return fetch(...args);
      },
    },
  }
);
