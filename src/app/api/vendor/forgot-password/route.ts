import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    // Send password reset OTP using Supabase's built-in functionality
    // Supabase will handle user validation internally and only send OTP to existing users
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/vendor/reset-password`,
      captchaToken: undefined // We'll handle captcha if needed later
    })

    if (resetError) {
      console.error('Password reset error:', resetError)
      return NextResponse.json(
        { error: 'Failed to send password reset OTP' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'If an account with this email exists, a password reset OTP has been sent.'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
