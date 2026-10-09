const { createClient } = require('@supabase/supabase-js');

// আপনার Supabase প্রজেক্টের তথ্য
const supabaseUrl = 'https://lmqezwzzdeqxjonylcrc.supabase.co';
const supabaseKey = 'sb_publishable_z3Atr9l6m7JxwsBroLjzVw_ZFMrA_dw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  const { data, error } = await supabase.from('student').select('*');

  if (error) {
    console.error('Error connecting to Supabase:', error.message);
  } else {
    console.log('Successfully connected to Supabase!', data);
  }
}

testConnection();