import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/server-auth'
import { logger } from '@/lib/error-logger'
import { vendorSchema } from '@/lib/validation/schemas'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { verifyCsrfToken } from '@/lib/csrf'

// GET - List vendors with filters, sorting, and pagination (admin UI)
export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin(request)
  if (adminCheck.error) {
    return adminCheck.response
  }

  try {
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

    const url = new URL(request.url)
    const search = (url.searchParams.get('search') || '').trim()
    const filterCategory = url.searchParams.get('filterCategory') || ''
    const sortKeyParam = url.searchParams.get('sortKey') || 'created_at'
    const sortDirParam = url.searchParams.get('sortDir') || 'desc'
    const page = Number.parseInt(url.searchParams.get('page') || '0', 10) || 0
    const pageSize = Number.parseInt(url.searchParams.get('pageSize') || '20', 10) || 20

    const sortKey = sortKeyParam === 'name' ? 'name' : 'created_at'
    const ascending = sortDirParam === 'asc'

    let query = supabase
      .from('vendors')
      .select(
        'id, name, website, vendor_category_key, tags, about, logo_url, address, phone, email, latitude, longitude, created_at',
        { count: 'exact' }
      )

    if (search) {
      const like = `%${search}%`
      query = query.or(`name.ilike.${like},address.ilike.${like},phone.ilike.${like}`)
    }
    if (filterCategory) {
      query = query.eq('vendor_category_key', filterCategory)
    }

    query = query.order(sortKey, { ascending })

    const from = page * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query
    if (error) {
      logger.error('Failed to list vendors', error, {
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
      total: count || 0,
    })
  } catch (error) {
    logger.error('Unexpected error in vendor list API', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new vendor
export async function POST(request: NextRequest) {
  // Verify admin access
  const adminCheck = await requireAdmin(request)
  if (adminCheck.error) {
    return adminCheck.response
  }

  try {
    // CSRF protection: if a CSRF cookie exists, require a matching header.
    // This avoids blocking first-time admin requests before the cookie has been issued.
    const csrfCookie = request.cookies.get('csrf-token')?.value
    if (csrfCookie) {
      const csrfOk = await verifyCsrfToken(request)
      if (!csrfOk) {
        return NextResponse.json(
          { error: 'Invalid or missing CSRF token' },
          { status: 403 }
        )
      }
    }

    const body = await request.json()
    
    // Validate input
    const validationResult = vendorSchema.safeParse(body.formData)
    
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]
      const fieldName = firstError?.path?.[0] 
        ? String(firstError.path[0]).replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        : 'Field'
      const errorMessage = firstError?.message 
        ? `${fieldName}: ${firstError.message}`
        : 'Validation failed'
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    const validated = validationResult.data
    
    // Create authenticated Supabase client using the admin's session
    // This respects RLS policies that allow admins to insert
    const cookieStore = await cookies()
    const adminSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll() {
            // Cookies are handled by middleware
          },
        },
      }
    )

    // Create vendor payload
    // Fields are now nullable in the database, so we can include them as null if empty
    const basePayload: {
      name: string
      website: string | null
      address: string | null
      phone: string | null
      email: string | null
      about: string | null
      tags: string[] | null
      vendor_category_key: string | null
      latitude: number | null
      longitude: number | null
    } = {
      name: validated.name,
      website: validated.website && validated.website.trim() ? validated.website.trim() : null,
      address: validated.address && validated.address.trim() ? validated.address.trim() : null,
      phone: validated.phone && validated.phone.trim() ? validated.phone.trim() : null,
      email: validated.email && validated.email.trim() ? validated.email.trim() : null,
      about: validated.about && validated.about.trim() ? validated.about.trim() : null,
      tags: validated.tags && validated.tags.trim() 
        ? validated.tags.split(',').map(s => s.trim()).filter(Boolean) 
        : null,
      vendor_category_key: validated.category && validated.category.trim() ? validated.category.trim() : null,
      latitude: validated.latitude && validated.latitude.trim() 
        ? (isNaN(parseFloat(validated.latitude)) ? null : parseFloat(validated.latitude))
        : null,
      longitude: validated.longitude && validated.longitude.trim() 
        ? (isNaN(parseFloat(validated.longitude)) ? null : parseFloat(validated.longitude))
        : null,
    }

    // Create vendor row using authenticated admin session
    // RLS policy should allow admins (users with is_admin=true in profiles) to insert
    const { data: created, error: createErr } = await adminSupabase
      .from('vendors')
      .insert([basePayload])
      .select('id, name')
      .single()

    if (createErr || !created?.id) {
      const errorMsg = createErr?.message || 'Failed to create vendor'
      logger.error('Failed to create vendor', createErr, { 
        payload: basePayload,
        adminId: adminCheck.admin?.userId 
      })
      return NextResponse.json(
        { error: errorMsg },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: created.id,
        name: created.name
      }
    })

  } catch (error) {
    logger.error('Unexpected error in vendor creation API', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove a vendor and related data (offers, images)
export async function DELETE(request: NextRequest) {
  const adminCheck = await requireAdmin(request)
  if (adminCheck.error) {
    return adminCheck.response
  }

  try {
    const body = await request.json().catch(() => ({}))
    const vendorId: string | undefined = body?.id

    if (!vendorId) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
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

    // Helper to remove from storage by public URL
    async function removeFromStorageByUrl(url: string) {
      try {
        const u = new URL(url)
        const filePath = u.pathname.split('/vendor-images/')[1]
        if (filePath) {
          await supabase.storage.from('vendor-images').remove([filePath])
        }
      } catch {
        // ignore storage errors here; DB cleanup will still occur
      }
    }

    // Fetch vendor (for logo_url)
    const { data: vendor, error: vendorErr } = await supabase
      .from('vendors')
      .select('id, logo_url')
      .eq('id', vendorId)
      .single()

    if (vendorErr || !vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    // Delete vendor cover images (storage + rows)
    const { data: images } = await supabase
      .from('vendor_images')
      .select('id, image_url')
      .eq('vendor_id', vendorId)

    if (images && images.length > 0) {
      for (const img of images) {
        if (img.image_url) {
          await removeFromStorageByUrl(img.image_url)
        }
      }
      await supabase.from('vendor_images').delete().eq('vendor_id', vendorId)
    }

    // Delete logo file from storage (if any)
    if (vendor.logo_url) {
      await removeFromStorageByUrl(vendor.logo_url)
    }

    // Delete offers for this vendor
    const { error: offersErr } = await supabase
      .from('offers')
      .delete()
      .eq('vendor_id', vendorId)
    if (offersErr) {
      logger.error('Failed to delete offers for vendor', offersErr, { vendorId })
      return NextResponse.json(
        { error: 'Failed to delete vendor offers' },
        { status: 500 }
      )
    }

    // Finally delete vendor
    const { error: delErr } = await supabase
      .from('vendors')
      .delete()
      .eq('id', vendorId)

    if (delErr) {
      logger.error('Failed to delete vendor', delErr, { vendorId })
      return NextResponse.json(
        { error: 'Failed to delete vendor' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Unexpected error in vendor delete API', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

