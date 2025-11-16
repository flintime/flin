import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/server-auth'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { logger } from '@/lib/error-logger'
import { offerSchema } from '@/lib/validation/schemas'

async function getClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    }
  )
}

export async function POST(request: NextRequest) {
  const adminCheck = await requireAdmin(request)
  if (adminCheck.error) return adminCheck.response
  try {
    const body = await request.json()
    const { vendor_id, ...rest } = body || {}

    const validationResult = offerSchema.safeParse({
      vendor_id,
      brand_id: rest.brand_id,
      title: rest.title,
      start_date: rest.start_date,
      end_date: rest.end_date,
      terms_conditions: rest.terms_conditions,
      featured: Boolean(rest.featured),
      discount_type: rest.discount_type,
    })

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]
      const message = firstError?.message || 'Validation failed'
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const validated = validationResult.data

    const supabase = await getClient()
    const { data, error } = await supabase
      .from('offers')
      .insert([{
        vendor_id: validated.vendor_id!,
        title: validated.title,
        start_date: validated.start_date || null,
        end_date: validated.end_date || null,
        terms_conditions: validated.terms_conditions || null,
        featured: validated.featured ?? false,
      }])
      .select('id, title')
      .single()
    if (error) {
      logger.error('Failed to create vendor offer', error, {
        adminId: adminCheck.admin?.userId,
        vendorId: validated.vendor_id,
      })
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ success: true, data })
  } catch (error) {
    logger.error('Unexpected error in vendor offer POST', error, {
      endpoint: '/api/admin/vendor-offers',
      method: 'POST',
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const adminCheck = await requireAdmin(request)
  if (adminCheck.error) return adminCheck.response
  try {
    const body = await request.json()
    const { id, ...fields } = body || {}
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const validationResult = offerSchema.partial().safeParse(fields)
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]
      const message = firstError?.message || 'Validation failed'
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const validated = validationResult.data

    const supabase = await getClient()
    const { data, error } = await supabase
      .from('offers')
      .update({
        title: validated.title,
        start_date: validated.start_date || null,
        end_date: validated.end_date || null,
        terms_conditions: validated.terms_conditions || null,
        featured: validated.featured ?? false,
      })
      .eq('id', id)
      .select('id, vendor_id, title, start_date, end_date, terms_conditions, featured, created_at')
      .single()
    if (error) {
      logger.error('Failed to update vendor offer', error, {
        adminId: adminCheck.admin?.userId,
        offerId: id,
      })
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ success: true, data })
  } catch (error) {
    logger.error('Unexpected error in vendor offer PUT', error, {
      endpoint: '/api/admin/vendor-offers',
      method: 'PUT',
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const adminCheck = await requireAdmin(request)
  if (adminCheck.error) return adminCheck.response
  try {
    const body = await request.json()
    const { id } = body || {}
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
    const supabase = await getClient()
    const { error } = await supabase.from('offers').delete().eq('id', id)
    if (error) {
      logger.error('Failed to delete vendor offer', error, {
        adminId: adminCheck.admin?.userId,
        offerId: id,
      })
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Unexpected error in vendor offer DELETE', error, {
      endpoint: '/api/admin/vendor-offers',
      method: 'DELETE',
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


