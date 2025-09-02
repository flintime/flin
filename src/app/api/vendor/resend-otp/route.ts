import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, type = 'signup' } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Resend OTP using Supabase
    const { error: resendError } = await supabase.auth.resend({
      type: type === 'signup' ? 'signup' : 'email_change',
      email: email,
    })

    if (resendError) {
      console.error('OTP resend error:', resendError)
      return NextResponse.json(
        { error: 'Failed to resend OTP: ' + resendError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'OTP code sent successfully! Please check your email.'
    })

  } catch (error) {
    console.error('OTP resend error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
