import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!authData.user || !authData.session) {
      return NextResponse.json(
        { error: 'Login failed' },
        { status: 401 }
      )
    }

    // Check if user has vendor role
    const userRole = authData.user.user_metadata?.role
    if (userRole !== 'vendor') {
      return NextResponse.json(
        { error: 'Access denied. Vendor account required.' },
        { status: 403 }
      )
    }

    // Fetch vendor data - first try by user_id, then by email as fallback
    let vendorData, vendorError
    
    // Try to find vendor by user_id
    const vendorQuery = await supabase
      .from('vendors')
      .select('id, name, vendor_pin, email, vendor_type')
      .eq('user_id', authData.user.id)
      .single()
    
    if (vendorQuery.error) {
      console.log('No vendor found by user_id, trying by email:', authData.user.email)
      // Fallback: try to find by email and update user_id
      const emailQuery = await supabase
        .from('vendors')
        .select('id, name, vendor_pin, email, vendor_type')
        .eq('email', authData.user.email)
        .single()
      
      if (emailQuery.error) {
        console.error('Vendor not found by user_id or email:', vendorQuery.error, emailQuery.error)
        return NextResponse.json(
          { error: 'Vendor profile not found' },
          { status: 404 }
        )
      }
      
      // Found by email, update the user_id
      await supabase
        .from('vendors')
        .update({ user_id: authData.user.id })
        .eq('id', emailQuery.data.id)
      
      console.log('Updated vendor user_id during login')
      vendorData = emailQuery.data
      vendorError = null
    } else {
      vendorData = vendorQuery.data
      vendorError = null
    }

    if (vendorError) {
      console.error('Vendor fetch error:', vendorError)
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
        vendor: vendorData,
        session: {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          expires_at: authData.session.expires_at,
        }
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
