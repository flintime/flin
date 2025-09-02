import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { VendorSignupData } from '@/lib/supabase'
import { getValidBusinessTypes } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body: VendorSignupData = await request.json()
    
    // Validate required fields
    const { businessName, email, password, businessType } = body
    
    if (!businessName || !email || !password || !businessType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate business type using centralized function
    const validBusinessTypes = getValidBusinessTypes()
    
    if (!validBusinessTypes.includes(businessType)) {
      return NextResponse.json(
        { error: 'Invalid business type' },
        { status: 400 }
      )
    }

    // Step 1: Create user account in Supabase Auth with OTP verification
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          business_name: businessName,
          business_type: businessType,
          role: 'vendor'
        }
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: 'Failed to create user account: ' + authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 400 }
      )
    }

    // Step 2: Create vendor record in vendors table
    // Note: phone, address, website will be added later in the dashboard
    const { data: vendorData, error: vendorError } = await supabase
      .from('vendors')
      .insert({
        name: businessName,
        email: email,
        phone: '', // Will be added in dashboard
        address: '', // Will be added in dashboard
        latitude: 0, // Will be set when address is added
        longitude: 0, // Will be set when address is added
        logo_url: '/placeholder-logo.png', // TODO: Implement logo upload
        vendor_type: businessType,
        user_id: authData.user.id,
        website: null, // Will be added in dashboard
      })
      .select()

    if (vendorError) {
      console.error('Vendor creation error:', vendorError)
      
      // Note: User account was created but vendor record failed
      // The user will need to complete their profile in the dashboard
      // or contact support for assistance
      
      return NextResponse.json(
        { error: 'Failed to create vendor record: ' + vendorError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Vendor account created successfully!',
      data: {
        user_id: authData.user.id,
        vendor_id: vendorData?.[0]?.id,
        vendor_pin: vendorData?.[0]?.vendor_pin, // Include the auto-generated PIN
        email: email,
        business_name: businessName
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
