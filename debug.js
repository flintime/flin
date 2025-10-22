const { createClient } = require('@supabase/supabase-js');

// Test script to check database connection and schema
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://muvggoaidldvdinypami.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');

  try {
    // Test basic connection
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('❌ Auth session error:', sessionError.message);
      return;
    }
    console.log('✅ Supabase connection OK');

    // Test profiles table
    console.log('🔍 Checking profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, is_admin')
      .limit(1);

    if (profilesError) {
      console.error('❌ Profiles table error:', profilesError.message);
      console.log('💡 This likely means the profiles table doesn\'t exist or has RLS issues');
      return;
    }

    console.log('✅ Profiles table exists');
    console.log('📊 Sample profile:', profiles?.[0] || 'No profiles found');

    // Check if is_admin column exists
    if (profiles && profiles.length > 0) {
      const hasIsAdmin = profiles[0].hasOwnProperty('is_admin');
      console.log(hasIsAdmin ? '✅ is_admin column exists' : '❌ is_admin column missing');
    }

    // Test auth
    console.log('🔍 Testing authentication...');
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    if (authError) {
      console.error('❌ Auth test failed:', authError.message);
    } else {
      console.log('✅ Auth system working');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testConnection();
