import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { VendorInterestData } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body: VendorInterestData = await request.json()

    const {
      businessName,
      email,
      contactName,
      phone,
      city,
      state,
    } = body

    if (!businessName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const serverSupabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await serverSupabase
      .from('vendor_interests')
      .insert({
        business_name: businessName,
        contact_name: contactName ?? null,
        email,
        phone: phone ?? null,
        city: city ?? null,
        state: state ?? null,
        source: 'website',
      })
      .select('id, created_at')
      .single()

    if (error) {
      console.error('Vendor interest insert error:', error)
      return NextResponse.json(
        { error: 'Failed to submit interest: ' + error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Thanks! We received your interest and will reach out shortly.',
      data: {
        id: data.id,
        created_at: data.created_at,
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Vendor interest error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
