import { NextRequest, NextResponse } from 'next/server'
import type { VendorInterestData } from '@/lib/supabase'
import { createServiceClient } from '@/lib/supabase/service'

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

    const serverSupabase = createServiceClient()

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
