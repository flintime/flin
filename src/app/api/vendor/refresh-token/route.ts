import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { refresh_token } = await request.json()
    
    if (!refresh_token) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      )
    }

    // Use Supabase to refresh the token
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token
    })

    if (error || !data.session) {
      console.error('Token refresh error:', error)
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
      user: data.user
    })

  } catch (error) {
    console.error('Refresh token error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
