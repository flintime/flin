import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, otp, type = 'signup' } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Verify OTP using Supabase
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: type === 'signup' ? 'signup' : 'email'
    })

    if (verifyError) {
      console.error('OTP verification error:', verifyError)
      return NextResponse.json(
        { error: 'Invalid OTP code' },
        { status: 400 }
      )
    }

    if (!verifyData.user) {
      return NextResponse.json(
        { error: 'Verification failed' },
        { status: 400 }
      )
    }

    // For signup verification, check vendor role and return full data
    if (type === 'signup') {
      const userRole = verifyData.user.user_metadata?.role
      if (userRole !== 'vendor') {
        return NextResponse.json(
          { error: 'Access denied. Vendor account required.' },
          { status: 403 }
        )
      }

      // Fetch vendor data for signup flow
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendors')
        .select('id, name, vendor_pin, email, vendor_type')
        .eq('user_id', verifyData.user.id)
        .single()

      if (vendorError) {
        console.error('Vendor fetch error:', vendorError)
        return NextResponse.json(
          { error: 'Vendor profile not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Email verified successfully!',
        data: {
          user: {
            id: verifyData.user.id,
            email: verifyData.user.email,
            email_confirmed_at: verifyData.user.email_confirmed_at
          },
          vendor: vendorData,
          session: verifyData.session ? {
            access_token: verifyData.session.access_token,
            refresh_token: verifyData.session.refresh_token,
            expires_at: verifyData.session.expires_at,
          } : null
        }
      })
    } else {
      // For email verification during login, just confirm verification
      return NextResponse.json({
        success: true,
        message: 'Email verified successfully! You can now sign in.',
        data: {
          user: {
            id: verifyData.user.id,
            email: verifyData.user.email,
            email_confirmed_at: verifyData.user.email_confirmed_at
          }
        }
      })
    }

  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
