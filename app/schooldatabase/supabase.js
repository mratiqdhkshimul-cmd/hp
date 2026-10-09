import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lmqezwzzdeqxjonylcrc.supabase.co';
const supabaseKey = 'sb_publishable_z3Atr9l6m7JxwsBroLjzVw_ZFMrA_dw';

export const supabase = createClient(supabaseUrl, supabaseKey);