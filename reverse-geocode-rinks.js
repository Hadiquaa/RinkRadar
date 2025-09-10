
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const fs = require('fs');

// Load environment variables
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables: SUPABASE_URL and SUPABASE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Rate limiting: 1 request per second for OpenStreetMap Nominatim
const RATE_LIMIT_DELAY = 1000; // 1 second

// Sleep function for rate limiting
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Reverse geocoding function using OpenStreetMap Nominatim API
async function reverseGeocode(latitude, longitude) {
  return new Promise((resolve, reject) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
    
    const options = {
      headers: {
        'User-Agent': 'RinkWatch-Geocoder/1.0 (your-email@example.com)' // Replace with your email
      }
    };

    https.get(url, options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          if (result.error) {
            reject(new Error(`Geocoding error: ${result.error}`));
            return;
          }

          const address = result.address || {};
          
          // Extract city from various possible fields
          const city = address.city || 
                      address.town || 
                      address.village || 
                      address.municipality || 
                      address.county ||
                      address.hamlet ||
                      null;

          // Extract province/state
          const province = address.state || 
                          address.province || 
                          address.region ||
                          null;

          resolve({
            city: city,
            province: province,
            country: address.country || null,
            full_address: result.display_name || null
          });

        } catch (parseError) {
          reject(new Error(`Failed to parse geocoding response: ${parseError.message}`));
        }
      });

    }).on('error', (error) => {
      reject(new Error(`HTTP request failed: ${error.message}`));
    });
  });
}

// Function to fetch rinks with null city/province
async function fetchRinksToUpdate() {
  try {
    console.log('🔍 Fetching rinks with missing city/province data...');
    
    const { data, error } = await supabase
      .from('rinks')
      .select('id, name, latitude, longitude, city, province')
      .or('city.is.null,province.is.null');

    if (error) {
      throw new Error(`Supabase query error: ${error.message}`);
    }

    console.log(`📊 Found ${data.length} rinks that need geocoding`);
    return data;

  } catch (error) {
    console.error('❌ Error fetching rinks:', error.message);
    throw error;
  }
}

// Function to update a single rink
async function updateRink(rinkId, city, province) {
  try {
    const { error } = await supabase
      .from('rinks')
      .update({ 
        city: city, 
        province: province,
        updated_at: new Date().toISOString()
      })
      .eq('id', rinkId);

    if (error) {
      throw new Error(`Failed to update rink ${rinkId}: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error(`❌ Error updating rink ${rinkId}:`, error.message);
    return false;
  }
}

// Function to log progress to file
function logProgress(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  console.log(message);
  fs.appendFileSync('geocoding-progress.log', logMessage);
}

// Main processing function
async function processRinks() {
  const startTime = Date.now();
  let processedCount = 0;
  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  try {
    // Fetch rinks that need updating
    const rinks = await fetchRinksToUpdate();
    
    if (rinks.length === 0) {
      logProgress('✅ No rinks need geocoding. All rinks already have city and province data.');
      return;
    }

    logProgress(`🚀 Starting geocoding process for ${rinks.length} rinks...`);
    
    // Process each rink
    for (let i = 0; i < rinks.length; i++) {
      const rink = rinks[i];
      processedCount++;
      
      try {
        logProgress(`📍 Processing rink ${processedCount}/${rinks.length}: "${rink.name}" (${rink.latitude}, ${rink.longitude})`);
        
        // Perform reverse geocoding
        const geocodeResult = await reverseGeocode(rink.latitude, rink.longitude);
        
        // Only update if we got useful data
        if (geocodeResult.city || geocodeResult.province) {
          const updateSuccess = await updateRink(
            rink.id, 
            geocodeResult.city || rink.city, 
            geocodeResult.province || rink.province
          );
          
          if (updateSuccess) {
            successCount++;
            logProgress(`✅ Updated "${rink.name}": City="${geocodeResult.city || 'unchanged'}", Province="${geocodeResult.province || 'unchanged'}"`);
          } else {
            errorCount++;
          }
        } else {
          logProgress(`⚠️  No city/province data found for "${rink.name}"`);
        }
        
        // Rate limiting: wait 1 second before next request
        if (i < rinks.length - 1) {
          await sleep(RATE_LIMIT_DELAY);
        }
        
      } catch (geocodeError) {
        errorCount++;
        const errorMsg = `❌ Failed to geocode "${rink.name}": ${geocodeError.message}`;
        logProgress(errorMsg);
        errors.push({ rink: rink.name, error: geocodeError.message });
        
        // Continue processing other rinks even if one fails
        continue;
      }
    }

  } catch (error) {
    logProgress(`💥 Fatal error: ${error.message}`);
    throw error;
  }

  // Final summary
  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);
  
  logProgress('\n📊 GEOCODING SUMMARY:');
  logProgress(`⏱️  Total time: ${duration} seconds`);
  logProgress(`📋 Total processed: ${processedCount}`);
  logProgress(`✅ Successfully updated: ${successCount}`);
  logProgress(`❌ Errors: ${errorCount}`);
  
  if (errors.length > 0) {
    logProgress('\n❌ ERROR DETAILS:');
    errors.forEach(error => {
      logProgress(`   • ${error.rink}: ${error.error}`);
    });
  }
  
  logProgress('\n🎉 Geocoding process completed!');
}

// Main execution
async function main() {
  try {
    // Create log file
    fs.writeFileSync('geocoding-progress.log', `Geocoding started at ${new Date().toISOString()}\n`);
    
    logProgress('🌍 RinkWatch Reverse Geocoding Script');
    logProgress('=====================================');
    
    // Test Supabase connection
    logProgress('🔌 Testing Supabase connection...');
    const { data, error } = await supabase.from('rinks').select('count').single();
    if (error) {
      throw new Error(`Supabase connection failed: ${error.message}`);
    }
    logProgress('✅ Supabase connection successful');
    
    // Start processing
    await processRinks();
    
  } catch (error) {
    logProgress(`💥 Script failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  logProgress('\n⏹️  Process interrupted by user');
  process.exit(0);
});

// Run the script
main();
