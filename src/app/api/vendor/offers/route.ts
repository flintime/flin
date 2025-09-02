import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// GET - Fetch vendor's offers
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

    // Create authenticated Supabase client with user token for RLS
    const userSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: { autoRefreshToken: false },
        global: { headers: { Authorization: `Bearer ${token}` } }
      }
    )

    // Verify the user with the authenticated client
    const { data: userData, error: userError } = await userSupabase.auth.getUser()

    if (userError || !userData.user) {
      console.error('Auth error:', userError)
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Find vendor by user_id (RLS-safe)
    const { data: vendorData, error: vendorError } = await userSupabase
      .from('vendors')
      .select('id')
      .eq('user_id', userData.user.id)
      .single()

    if (vendorError || !vendorData) {
      console.error('Vendor not found:', vendorError)
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Fetch offers for this vendor using authenticated client
    const { data: offers, error: offersError } = await userSupabase
      .from('offers')
      .select('*')
      .eq('vendor_id', vendorData.id)
      .order('created_at', { ascending: false })

    if (offersError) {
      console.error('Offers fetch error:', offersError)
      return NextResponse.json(
        { error: 'Failed to fetch offers' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: offers || []
    })

  } catch (error) {
    console.error('Offers fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new offer
export async function POST(request: NextRequest) {
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

    // Create authenticated Supabase client with user token for RLS
    const userSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: { autoRefreshToken: false },
        global: { headers: { Authorization: `Bearer ${token}` } }
      }
    )

    // Find vendor by user_id using authenticated client
    const { data: vendorData, error: vendorError } = await userSupabase
      .from('vendors')
      .select('id')
      .eq('user_id', userData.user.id)
      .single()

    if (vendorError || !vendorData) {
      console.error('Vendor not found:', vendorError)
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Get the offer data
    const offerData = await request.json()
    
    // Validate required fields (discount fields removed)
    const requiredFields = ['title', 'start_date', 'end_date']
    for (const field of requiredFields) {
      if (!offerData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Deprecated discount fields are ignored server-side

    // Validate dates
    const startDate = new Date(offerData.start_date)
    const endDate = new Date(offerData.end_date)
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // Create the offer
    const insertPayload = {
      vendor_id: vendorData.id,
      title: offerData.title,
      start_date: offerData.start_date,
      end_date: offerData.end_date,
      // discount_type removed
      terms_conditions: offerData.terms_conditions || null,
      status: 'active'
    }

    const { data: newOffer, error: createError } = await userSupabase
      .from('offers')
      .insert(insertPayload)
      .select()
      .single()

    if (createError) {
      console.error('Offer creation error:', createError)
      return NextResponse.json(
        { error: 'Failed to create offer: ' + createError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Offer created successfully',
      data: newOffer
    })

  } catch (error) {
    console.error('Offer creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an offer
export async function DELETE(request: NextRequest) {
  try {
    console.log('DELETE /api/vendor/offers called')
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    console.log('Auth header present:', !!authHeader)
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid authorization header')
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    // Extract the token
    const token = authHeader.split(' ')[1]
    console.log('Token extracted, length:', token.length)
    
    // Verify the user with Supabase
    const { data: userData, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !userData.user) {
      console.error('Auth error:', userError)
      return NextResponse.json(
        { error: 'Unauthorized: ' + (userError?.message || 'No user found') },
        { status: 401 }
      )
    }
    
    console.log('User authenticated:', userData.user.id)

    // Get the offer ID from request body
    const { offerId } = await request.json()
    
    if (!offerId) {
      return NextResponse.json(
        { error: 'Offer ID is required' },
        { status: 400 }
      )
    }

    // Get the vendor record for this user
    const { data: vendorData, error: vendorError } = await supabase
      .from('vendors')
      .select('id')
      .eq('user_id', userData.user.id)
      .single()

    if (vendorError || !vendorData) {
      console.error('Vendor lookup error:', vendorError)
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Create authenticated Supabase client with user token for RLS
    const userSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
        },
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    )

    // Delete the offer (RLS policy will ensure they can only delete their own offers)
    console.log('Attempting to delete offer:', offerId, 'for vendor:', vendorData.id)
    const { error: deleteError, count } = await userSupabase
      .from('offers')
      .delete()
      .eq('id', offerId)
      .eq('vendor_id', vendorData.id)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete offer: ' + deleteError.message },
        { status: 500 }
      )
    }

    console.log('Delete operation completed, rows affected:', count)

    return NextResponse.json(
      { message: 'Offer deleted successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error deleting offer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Toggle featured status on an offer
export async function PATCH(request: NextRequest) {
  try {
    // Auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]

    // Verify user
    const { data: userData, error: userError } = await supabase.auth.getUser(token)
    if (userError || !userData.user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Parse body
    const { offerId, featured } = await request.json() as { offerId?: string, featured?: boolean }
    if (!offerId || typeof featured !== 'boolean') {
      return NextResponse.json(
        { error: 'offerId and featured (boolean) are required' },
        { status: 400 }
      )
    }

    // Find vendor for this user
    const { data: vendorData, error: vendorError } = await supabase
      .from('vendors')
      .select('id')
      .eq('user_id', userData.user.id)
      .single()

    if (vendorError || !vendorData) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Authenticated client for RLS
    const userSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: { autoRefreshToken: false },
        global: { headers: { Authorization: `Bearer ${token}` } }
      }
    )

    // If setting to featured=true, first clear any existing featured offers for this vendor
    if (featured) {
      const { error: clearError } = await userSupabase
        .from('offers')
        .update({ featured: false })
        .eq('vendor_id', vendorData.id)
        .eq('featured', true)
      if (clearError) {
        return NextResponse.json(
          { error: 'Failed to clear previous featured offer: ' + clearError.message },
          { status: 400 }
        )
      }
    }

    // Update featured flag (RLS ensures ownership)
    const { data: updated, error: updateError } = await userSupabase
      .from('offers')
      .update({ featured })
      .eq('id', offerId)
      .eq('vendor_id', vendorData.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update offer: ' + updateError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Error updating featured status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
