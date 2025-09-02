import { NextRequest, NextResponse } from 'next/server'
import { geocodeAddress, getAddressAutocomplete, LocationIQError } from '@/lib/googleMaps'

// Debug endpoint to test LocationIQ geocoding
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const autocomplete = searchParams.get('autocomplete')

  // Test autocomplete functionality
  if (autocomplete) {
    if (!autocomplete.trim()) {
      return NextResponse.json({
        error: 'Missing autocomplete parameter',
        usage: 'Add ?autocomplete=your_query to test autocomplete'
      }, { status: 400 })
    }

    try {
      const suggestions = await getAddressAutocomplete(autocomplete, 5)
      
      return NextResponse.json({
        success: true,
        type: 'autocomplete',
        query: autocomplete,
        suggestions,
        count: suggestions.length,
        message: 'Autocomplete test successful!'
      })
    } catch (error) {
      console.error('Autocomplete debug error:', error)
      
      if (error instanceof LocationIQError) {
        return NextResponse.json({
          success: false,
          type: 'autocomplete',
          error: error.message,
          error_code: error.code,
          status: error.status,
          query: autocomplete
        }, { status: error.status || 500 })
      }
      
      return NextResponse.json({
        success: false,
        type: 'autocomplete',
        error: 'Unexpected error during autocomplete',
        query: autocomplete
      }, { status: 500 })
    }
  }

  // Test geocoding functionality
  if (!address) {
    return NextResponse.json({
      error: 'Missing parameters',
      usage: {
        geocoding: 'Add ?address=your_address_here to test geocoding',
        autocomplete: 'Add ?autocomplete=your_query to test autocomplete'
      }
    }, { status: 400 })
  }

  try {
    const result = await geocodeAddress(address)
    
    return NextResponse.json({
      success: true,
      input_address: address,
      geocoding_result: result,
      message: 'Geocoding successful!'
    })
  } catch (error) {
    console.error('Geocoding debug error:', error)
    
    if (error instanceof LocationIQError) {
      return NextResponse.json({
        success: false,
        error: error.message,
        error_code: error.code,
        status: error.status,
        input_address: address
      }, { status: error.status || 500 })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Unexpected error during geocoding',
      input_address: address
    }, { status: 500 })
  }
}

// Test specific addresses
export async function POST() {
  const testAddresses = [
    "1600 Amphitheatre Parkway, Mountain View, CA 94043",
    "Times Square, New York, NY",
    "Golden Gate Bridge, San Francisco, CA",
    "Harvard University, Cambridge, MA"
  ]

  const results = []

  for (const address of testAddresses) {
    try {
      const result = await geocodeAddress(address)
      results.push({
        address,
        success: true,
        result
      })
    } catch (error) {
      results.push({
        address,
        success: false,
        error: error instanceof LocationIQError ? error.message : 'Unknown error'
      })
    }
  }

  return NextResponse.json({
    test_results: results,
    summary: {
      total: testAddresses.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    }
  })
}