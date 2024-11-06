import { supabaseAnonKey, supabaseUrl } from "@/config";
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
