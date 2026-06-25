import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || 'https://jktaknkhyequdlcuihji.supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_SYvmZ39EQ7CVEAyRQTDSng_3lgjhCRk';

export const supabase = createClient(url, key);
