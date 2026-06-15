import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "https://krtcfagdzrlvvvfrugva.supabase.co";
// Fallback to a dummy key during build time to prevent "supabaseKey is required" crash
const supabaseKey = process.env.SUPABASE_ANON_KEY || "dummy_key_for_build_time";

export const supabase = createClient(supabaseUrl, supabaseKey);
