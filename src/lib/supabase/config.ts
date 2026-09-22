const DEFAULT_SUPABASE_URL = "https://bpeeabwursdnibbfvabh.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_lMJNV7HgD_W2f1XzXQBqQA_lyi5xqeW";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? DEFAULT_SUPABASE_URL;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  DEFAULT_SUPABASE_PUBLISHABLE_KEY;

export function getSupabaseConfig() {
  if (!supabaseUrl.startsWith("https://") || !supabasePublishableKey) {
    throw new Error(
      "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY no arquivo .env.local."
    );
  }

  return { supabaseUrl, supabasePublishableKey };
}
