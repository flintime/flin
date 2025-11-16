import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/server-auth'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { logger } from '@/lib/error-logger'

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin(request)
  if (adminCheck.error) {
    return adminCheck.response
  }

  try {
    const url = new URL(request.url)
    const vendorIdsParam = url.searchParams.get('vendorIds') || ''
    const vendorIds = vendorIdsParam
      .split(',')
      .map(id => id.trim())
      .filter(Boolean)

    if (!vendorIds.length) {
      return NextResponse.json({ success: true, data: [] })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll() {
            // handled by middleware
          },
        },
      }
    )

    const { data, error } = await supabase
      .from('offers')
      .select(
        'id, vendor_id, title, start_date, end_date, terms_conditions, featured, created_at'
      )
      .in('vendor_id', vendorIds)
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Failed to list vendor offers', error, {
        adminId: adminCheck.admin?.userId,
      })
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    })
  } catch (error) {
    logger.error('Unexpected error in vendor offers list API', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}


