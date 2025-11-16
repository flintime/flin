import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, otp, password } = await request.json()

    // Validate required fields
    if (!email || !otp || !password) {
      return NextResponse.json(
        { error: 'Email, OTP, and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Verify the OTP code
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'recovery' // Use 'recovery' for password reset OTP
    })

    if (verifyError) {
      console.error('OTP verification error:', verifyError)
      return NextResponse.json(
        { error: 'Invalid or expired OTP code' },
        { status: 400 }
      )
    }

    if (!verifyData.user) {
      return NextResponse.json(
        { error: 'OTP verification failed' },
        { status: 400 }
      )
    }

    // Verify user has vendor role
    const userRole = verifyData.user.user_metadata?.role
    if (userRole !== 'vendor') {
      return NextResponse.json(
        { error: 'Access denied. Vendor account required.' },
        { status: 403 }
      )
    }

    // Update the password using the verified session
    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    })

    if (updateError) {
      console.error('Password update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      )
    }

    // Sign out the user to force re-login with new password
    await supabase.auth.signOut()

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully! Please sign in with your new password.'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
