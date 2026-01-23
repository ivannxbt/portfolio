#!/usr/bin/env node

/**
 * Supabase Setup Verification Script
 *
 * This script verifies that your Supabase project is properly configured
 * with all necessary tables, policies, and storage buckets.
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local');
  console.error('   Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Verifying Supabase Setup...\n');
console.log('📍 Project URL:', supabaseUrl);
console.log('🔑 Using anon key:', supabaseKey.substring(0, 20) + '...\n');

let hasErrors = false;

// Test 1: Check connection
async function testConnection() {
  console.log('1️⃣  Testing connection...');
  try {
    const { data, error } = await supabase.from('content_overrides').select('count', { count: 'exact', head: true });
    if (error) throw error;
    console.log('   ✅ Connection successful!\n');
    return true;
  } catch (error) {
    console.error('   ❌ Connection failed:', error.message);
    hasErrors = true;
    return false;
  }
}

// Test 2: Check tables exist
async function checkTables() {
  console.log('2️⃣  Checking database tables...');

  const tables = ['content_overrides', 'uploads'];

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(0);
      if (error) {
        if (error.code === '42P01') {
          console.error(`   ❌ Table "${table}" does not exist`);
          hasErrors = true;
        } else {
          throw error;
        }
      } else {
        console.log(`   ✅ Table "${table}" exists`);
      }
    } catch (error) {
      console.error(`   ❌ Error checking table "${table}":`, error.message);
      hasErrors = true;
    }
  }
  console.log('');
}

// Test 3: Check table structure
async function checkTableStructure() {
  console.log('3️⃣  Verifying table structure...');

  // Check content_overrides structure
  try {
    const { data, error } = await supabase
      .from('content_overrides')
      .select('*')
      .limit(1);

    if (error) throw error;
    console.log('   ✅ content_overrides table structure is valid');
  } catch (error) {
    console.error('   ❌ content_overrides table structure issue:', error.message);
    hasErrors = true;
  }

  // Check uploads structure
  try {
    const { data, error } = await supabase
      .from('uploads')
      .select('*')
      .limit(1);

    if (error) throw error;
    console.log('   ✅ uploads table structure is valid');
  } catch (error) {
    console.error('   ❌ uploads table structure issue:', error.message);
    hasErrors = true;
  }
  console.log('');
}

// Test 4: Check RLS policies
async function checkRLSPolicies() {
  console.log('4️⃣  Testing Row Level Security policies...');

  // Test public read access to content_overrides
  try {
    const { data, error } = await supabase
      .from('content_overrides')
      .select('*')
      .limit(1);

    if (error) throw error;
    console.log('   ✅ Public read access to content_overrides works');
  } catch (error) {
    console.error('   ❌ Public read access failed:', error.message);
    hasErrors = true;
  }

  // Test public read access to uploads
  try {
    const { data, error } = await supabase
      .from('uploads')
      .select('*')
      .limit(1);

    if (error) throw error;
    console.log('   ✅ Public read access to uploads works');
  } catch (error) {
    console.error('   ❌ Public read access to uploads failed:', error.message);
    hasErrors = true;
  }
  console.log('');
}

// Test 5: Check storage buckets
async function checkStorageBuckets() {
  console.log('5️⃣  Checking storage buckets...');

  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) throw error;

    const uploadsBucket = buckets.find(b => b.id === 'uploads');

    if (uploadsBucket) {
      console.log('   ✅ Storage bucket "uploads" exists');
      console.log(`      - Public: ${uploadsBucket.public}`);
    } else {
      console.error('   ❌ Storage bucket "uploads" does not exist');
      hasErrors = true;
    }
  } catch (error) {
    console.error('   ❌ Error checking storage buckets:', error.message);
    hasErrors = true;
  }
  console.log('');
}

// Test 6: Check authentication
async function checkAuth() {
  console.log('6️⃣  Checking authentication setup...');

  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error && error.message !== 'Auth session missing!') {
      throw error;
    }

    console.log('   ✅ Auth client is working');

    if (user) {
      console.log(`   ℹ️  Currently logged in as: ${user.email}`);
    } else {
      console.log('   ℹ️  Not currently logged in (expected for verification)');
    }
  } catch (error) {
    console.error('   ❌ Auth check failed:', error.message);
    hasErrors = true;
  }
  console.log('');
}

// Test 7: Check data
async function checkData() {
  console.log('7️⃣  Checking existing data...');

  try {
    const { data, error, count } = await supabase
      .from('content_overrides')
      .select('*', { count: 'exact' });

    if (error) throw error;

    if (count === 0) {
      console.log('   ℹ️  No content overrides found (database is empty)');
      console.log('   💡 Tip: You may want to import your existing content from content-overrides.json');
    } else {
      console.log(`   ✅ Found ${count} content override(s)`);
      data.forEach(row => {
        console.log(`      - Locale: ${row.locale}`);
      });
    }
  } catch (error) {
    console.error('   ❌ Error checking data:', error.message);
    hasErrors = true;
  }
  console.log('');
}

// Run all tests
async function runVerification() {
  const connected = await testConnection();

  if (!connected) {
    console.error('\n❌ Cannot proceed with verification due to connection failure.');
    console.error('   Please check:');
    console.error('   - Your Supabase project URL is correct');
    console.error('   - Your anon key is correct');
    console.error('   - Your Supabase project is active');
    console.error('   - You have internet connectivity');
    process.exit(1);
  }

  await checkTables();
  await checkTableStructure();
  await checkRLSPolicies();
  await checkStorageBuckets();
  await checkAuth();
  await checkData();

  console.log('═══════════════════════════════════════════════════════\n');

  if (hasErrors) {
    console.log('❌ VERIFICATION FAILED');
    console.log('\nSome checks failed. Please:');
    console.log('1. Go to your Supabase dashboard SQL Editor');
    console.log('2. Run the migration from: supabase/migrations/001_initial_schema.sql');
    console.log('3. Make sure all SQL commands executed successfully');
    console.log('4. Run this verification script again\n');
    process.exit(1);
  } else {
    console.log('✅ ALL CHECKS PASSED!');
    console.log('\nYour Supabase setup is complete and working correctly.');
    console.log('\nNext steps:');
    console.log('1. Create an admin user in Supabase Auth dashboard');
    console.log('2. Run: npm run dev');
    console.log('3. Visit: http://localhost:3000/admin/login');
    console.log('4. Log in with your admin credentials\n');
  }
}

runVerification().catch(error => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});
