import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { geocodeAddress, LocationIQError } from '@/lib/googleMaps'

// GET - Fetch vendor profile
export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    // Extract the token
    const token = authHeader.split(' ')[1]
    
    // Verify the user with Supabase
    const { data: userData, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !userData.user) {
      console.error('Auth error:', userError)
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    console.log('Authenticated user ID:', userData.user.id)

    // Fetch vendor data - first try by user_id, then by email as fallback
    let vendorData, vendorError
    
    // Try to find vendor by user_id
    const vendorQuery = await supabase
      .from('vendors')
      .select('*')
      .eq('user_id', userData.user.id)
      .single()
    
    if (vendorQuery.error) {
      console.log('No vendor found by user_id, trying by email:', userData.user.email)
      // Fallback: try to find by email and update user_id
      const emailQuery = await supabase
        .from('vendors')
        .select('*')
        .eq('email', userData.user.email)
        .single()
      
      if (emailQuery.error) {
        console.error('Vendor not found by user_id or email:', vendorQuery.error, emailQuery.error)
        return NextResponse.json(
          { error: 'Vendor not found' },
          { status: 404 }
        )
      }
      
      // Found by email, update the user_id
      const updateResult = await supabase
        .from('vendors')
        .update({ user_id: userData.user.id })
        .eq('id', emailQuery.data.id)
        .select()
        .single()
      
      if (updateResult.error) {
        console.error('Failed to update user_id:', updateResult.error)
        vendorData = emailQuery.data
        vendorError = null
      } else {
        console.log('Updated vendor user_id successfully')
        vendorData = updateResult.data
        vendorError = null
      }
    } else {
      vendorData = vendorQuery.data
      vendorError = null
    }

    if (vendorError) {
      console.error('Vendor fetch error:', vendorError)
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: vendorData
    })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update vendor profile
export async function PUT(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    // Extract the token
    const token = authHeader.split(' ')[1]
    
    // Verify the user with Supabase
    const { data: userData, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !userData.user) {
      console.error('Auth error:', userError)
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    console.log('Update request for user ID:', userData.user.id)

    // First, find the vendor (using same logic as GET)
    let vendorId
    
    // Try to find vendor by user_id
    const vendorQuery = await supabase
      .from('vendors')
      .select('id, user_id')
      .eq('user_id', userData.user.id)
      .single()
    
    if (vendorQuery.error) {
      console.log('No vendor found by user_id, trying by email:', userData.user.email)
      // Fallback: try to find by email
      const emailQuery = await supabase
        .from('vendors')
        .select('id, user_id')
        .eq('email', userData.user.email)
        .single()
      
      if (emailQuery.error) {
        console.error('Vendor not found by user_id or email:', vendorQuery.error, emailQuery.error)
        return NextResponse.json(
          { error: 'Vendor not found' },
          { status: 404 }
        )
      }
      
      vendorId = emailQuery.data.id
      
      // Update user_id if it's missing
      if (!emailQuery.data.user_id) {
        await supabase
          .from('vendors')
          .update({ user_id: userData.user.id })
          .eq('id', vendorId)
        console.log('Updated vendor user_id during profile update')
      }
    } else {
      vendorId = vendorQuery.data.id
    }

    // Get the update data
    const updateData = await request.json()
    
    // Validate that we don't allow updating certain fields
    const allowedFields = [
      'name', 'phone', 'email', 'address', 'website', 'about', 
      'tags', 'vendor_type', 'logo_url', 'latitude', 'longitude'
    ]
    
    const filteredData: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        // Handle null/undefined values properly
        filteredData[key] = value === null || value === undefined ? null : value
      }
    }

    // Handle address geocoding if address is being updated
    if (filteredData.address && typeof filteredData.address === 'string' && filteredData.address.trim().length > 0) {
      try {
        console.log('Geocoding address:', filteredData.address)
        const geocodingResult = await geocodeAddress(filteredData.address)
        
        // Add coordinates to the update data
        filteredData.latitude = geocodingResult.latitude
        filteredData.longitude = geocodingResult.longitude
        
        console.log('Geocoding successful:', {
          address: filteredData.address,
          latitude: geocodingResult.latitude,
          longitude: geocodingResult.longitude
        })
      } catch (error) {
        console.error('Geocoding error:', error)
        
        // Handle geocoding errors gracefully
        if (error instanceof LocationIQError) {
          // For specific LocationIQ errors, we might want to inform the user
          if (error.code === 'NOT_FOUND' || error.code === 'NO_RESULTS') {
            return NextResponse.json(
              { 
                error: 'Address not found. Please verify the address and try again.',
                details: 'The provided address could not be geocoded. Please check for typos or provide a more complete address.'
              },
              { status: 400 }
            )
          } else if (error.code === 'UNAUTHORIZED') {
            // Log API key issues but don't expose to user
            console.error('LocationIQ API key issue')
            return NextResponse.json(
              { error: 'Address validation temporarily unavailable. Please try again later.' },
              { status: 503 }
            )
          } else if (error.code === 'RATE_LIMIT') {
            return NextResponse.json(
              { error: 'Too many requests. Please try again in a moment.' },
              { status: 429 }
            )
          }
        }
        
        // For other errors, log them but don't block the update
        // We'll save the address without coordinates
        console.warn('Geocoding failed, saving address without coordinates:', error instanceof Error ? error.message : String(error))
        filteredData.latitude = 0
        filteredData.longitude = 0
      }
    }

    // Remove logo_url from updates to avoid conflicts
    // Add updated_at timestamp
    filteredData.updated_at = new Date().toISOString()

    console.log('Original update data keys:', Object.keys(updateData))
    console.log('Filtered data for vendor ID:', vendorId, 'with data:', filteredData)
    
    // Ensure we have at least one field to update besides updated_at
    const updateableFields = Object.keys(filteredData).filter(key => key !== 'updated_at')
    if (updateableFields.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Create a Supabase client with the user's token for RLS
    const userSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    )

    // Update vendor data using the user-authenticated client
    const { data: vendorData, error: vendorError } = await userSupabase
      .from('vendors')
      .update(filteredData)
      .eq('id', vendorId)
      .select()
      .single()

    if (vendorError) {
      console.error('Vendor update error:', vendorError)
      return NextResponse.json(
        { error: 'Failed to update vendor profile: ' + vendorError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: vendorData
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
