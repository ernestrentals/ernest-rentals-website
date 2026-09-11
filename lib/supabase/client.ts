import {
  createClient,
  SupabaseClient,
} from "@supabase/supabase-js";

let browserClient:
  SupabaseClient | null = null;

export function createBrowserClient() {
  if (browserClient) {
    return browserClient;
  }

  browserClient = createClient(
    process.env
      .NEXT_PUBLIC_SUPABASE_URL!,
    process.env
      .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  return browserClient;
}