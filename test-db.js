const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file directly
const envPath = path.join(__dirname, '.env.local');
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.error('Could not read .env.local file:', error.message);
  process.exit(1);
}

// Parse environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  try {
    console.log('Testing Supabase connection...');

    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('vendors')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('Connection error:', testError.message);
      return;
    }

    console.log('✅ Supabase connection successful');

    // Check if offers table exists
    console.log('\nChecking offers table...');
    const { data: offers, error: offersError } = await supabase
      .from('offers')
      .select('*')
      .limit(5);

    if (offersError) {
      console.error('❌ Offers table error:', offersError.message);
      console.error('This might indicate the table doesn\'t exist or RLS policies are blocking access');
    } else {
      console.log('✅ Offers table accessible');
      console.log(`Found ${offers.length} offers in database`);
      if (offers.length > 0) {
        console.log('Sample offer:', JSON.stringify(offers[0], null, 2));
      }
    }

    // Check vendors table
    console.log('\nChecking vendors table...');
    const { data: vendors, error: vendorsError } = await supabase
      .from('vendors')
      .select('id, name, email, vendor_type, user_id')
      .limit(5);

    if (vendorsError) {
      console.error('❌ Vendors table error:', vendorsError.message);
    } else {
      console.log('✅ Vendors table accessible');
      console.log(`Found ${vendors.length} vendors in database`);
      if (vendors.length > 0) {
        console.log('Sample vendor:', JSON.stringify(vendors[0], null, 2));

        // Check if this vendor has offers
        const vendorId = vendors[0].id;
        console.log(`\nChecking offers for vendor ${vendorId}...`);
        const { data: vendorOffers, error: vendorOffersError } = await supabase
          .from('offers')
          .select('*')
          .eq('vendor_id', vendorId);

        if (vendorOffersError) {
          console.error('❌ Error fetching offers for vendor:', vendorOffersError.message);
        } else {
          console.log(`Found ${vendorOffers.length} offers for this vendor`);
          if (vendorOffers.length > 0) {
            console.log('Vendor offers:', vendorOffers.map(o => ({ id: o.id, title: o.title, status: o.status })));
          }
        }

        // Also check the vendor that has offers
        console.log(`\nChecking vendor with offers (vendor_id: 24cc0640-1139-4cb1-bc92-1606533ac698)...`);
        const { data: vendorWithOffers, error: vendorWithOffersError } = await supabase
          .from('vendors')
          .select('id, name, email, user_id')
          .eq('id', '24cc0640-1139-4cb1-bc92-1606533ac698')
          .single();

        if (vendorWithOffersError) {
          console.error('❌ Error fetching vendor with offers:', vendorWithOffersError.message);
        } else {
          console.log('Vendor with offers:', JSON.stringify(vendorWithOffers, null, 2));

          // Check all vendors and their offer counts
          console.log('\n=== VENDOR-OFFER SUMMARY ===');
          const { data: allVendors, error: allVendorsError } = await supabase
            .from('vendors')
            .select('id, name, email, user_id');

          if (!allVendorsError && allVendors) {
            for (const vendor of allVendors) {
              const { data: vendorOffers } = await supabase
                .from('offers')
                .select('id, title')
                .eq('vendor_id', vendor.id);

              console.log(`${vendor.name} (${vendor.id}):`);
              console.log(`  - User ID: ${vendor.user_id || 'NULL'}`);
              console.log(`  - Offers: ${vendorOffers?.length || 0}`);
              if (vendorOffers && vendorOffers.length > 0) {
                console.log(`  - Offer titles: ${vendorOffers.map(o => o.title).join(', ')}`);
              }
              console.log('');
            }
          }
        }
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testDatabase();
