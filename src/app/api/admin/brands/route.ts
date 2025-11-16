import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/server-auth'
import { logger } from '@/lib/error-logger'
import { brandSchema } from '@/lib/validation/schemas'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { verifyCsrfToken } from '@/lib/csrf'

// GET - List brands with filters, sorting, and pagination (admin UI)
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
      .from('brands')
      .select(
        'id, name, website, category, tags, about, logo_url, cover_url, sort_order, created_at',
        { count: 'exact' }
      )

    if (search) {
      const like = `%${search}%`
      query = query.or(`name.ilike.${like},website.ilike.${like}`)
    }
    if (filterCategory) {
      query = query.eq('category', filterCategory)
    }

    query = query.order(sortKey, { ascending })

    const from = page * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query
    if (error) {
      logger.error('Failed to list brands', error, {
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
    logger.error('Unexpected error in brand list API', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new brand
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
    const validationResult = brandSchema.safeParse(body.formData)
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]
      const message = firstError?.message || 'Validation failed'
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const validated = validationResult.data

    // Create authenticated Supabase client using the admin's session (respects RLS)
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

    // Normalize payload; convert empty strings to null and CSV tags to array
    const payload: {
      name: string
      website: string | null
      about: string | null
      tags: string[] | null
      category: string | null
      sort_order?: number
    } = {
      name: validated.name,
      website: validated.website && validated.website.trim() ? validated.website.trim() : null,
      about: validated.about && validated.about.trim() ? validated.about.trim() : null,
      tags: validated.tags && validated.tags.trim()
        ? validated.tags.split(',').map(s => s.trim()).filter(Boolean)
        : null,
      category: validated.category && validated.category.trim() ? validated.category.trim() : null,
    }

    if (validated.sort_order && validated.sort_order.trim() !== '') {
      payload.sort_order = parseInt(validated.sort_order, 10)
    }

    const { data: created, error: createErr } = await adminSupabase
      .from('brands')
      .insert([payload])
      .select('id, name')
      .single()

    if (createErr || !created?.id) {
      const errorMsg = createErr?.message || 'Failed to create brand'
      logger.error('Failed to create brand', createErr, {
        payload,
        adminId: adminCheck.admin?.userId,
      })
      return NextResponse.json({ error: errorMsg }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: created.id,
        name: created.name,
      },
    })
  } catch (error) {
    logger.error('Unexpected error in brand creation API', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update an existing brand
export async function PUT(request: NextRequest) {
  const adminCheck = await requireAdmin(request)
  if (adminCheck.error) {
    return adminCheck.response
  }

  try {
    const body = await request.json().catch(() => ({}))
    const { id, name, website, about, tags, category, sort_order, logo_url, cover_url } = body || {}

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    // Build a validation view using the same brandSchema (string-based)
    const validationInput: Record<string, unknown> = {}
    if (name !== undefined) validationInput.name = String(name)
    if (website !== undefined) validationInput.website = (website ?? '') as string
    if (about !== undefined) validationInput.about = (about ?? '') as string
    if (category !== undefined) validationInput.category = (category ?? '') as string
    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        validationInput.tags = (tags as string[]).join(', ')
      } else if (typeof tags === 'string') {
        validationInput.tags = tags
      } else {
        validationInput.tags = ''
      }
    }
    if (sort_order !== undefined) {
      validationInput.sort_order =
        sort_order === null || sort_order === '' ? '' : String(sort_order)
    }

    if (Object.keys(validationInput).length > 0) {
      const validationResult = brandSchema.partial().safeParse(validationInput)
      if (!validationResult.success) {
        const firstError = validationResult.error.issues[0]
        const message = firstError?.message || 'Validation failed'
        return NextResponse.json({ error: message }, { status: 400 })
      }
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

    const payload: Record<string, unknown> = {}
    if (name !== undefined) {
      payload.name = String(name).trim()
    }
    if (website !== undefined) {
      const w = (website ?? '') as string
      payload.website = w.trim() ? w.trim() : null
    }
    if (about !== undefined) {
      const a = (about ?? '') as string
      payload.about = a.trim() ? a.trim() : null
    }
    if (category !== undefined) {
      const c = (category ?? '') as string
      payload.category = c.trim() ? c.trim() : null
    }
    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        payload.tags = (tags as string[]).map(t => t.trim()).filter(Boolean)
      } else if (typeof tags === 'string') {
        payload.tags = tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean)
      } else {
        payload.tags = null
      }
    }
    if (sort_order !== undefined) {
      if (sort_order === null || sort_order === '') {
        payload.sort_order = null
      } else {
        const parsed = Number.parseInt(String(sort_order), 10)
        payload.sort_order = Number.isNaN(parsed) ? null : parsed
      }
    }
    if (logo_url !== undefined) {
      payload.logo_url = logo_url
    }
    if (cover_url !== undefined) {
      payload.cover_url = cover_url
    }

    if (Object.keys(payload).length === 0) {
      return NextResponse.json(
        { error: 'No fields provided to update' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('brands')
      .update(payload)
      .eq('id', id)
      .select('id, name, website, category, tags, about, logo_url, cover_url, sort_order, created_at')
      .single()

    if (error) {
      logger.error('Failed to update brand', error, {
        adminId: adminCheck.admin?.userId,
        brandId: id,
        payload,
      })
      return NextResponse.json(
        { error: error.message || 'Failed to update brand' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    logger.error('Unexpected error in brand update API', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove a brand and associated images/offers
export async function DELETE(request: NextRequest) {
  const adminCheck = await requireAdmin(request)
  if (adminCheck.error) {
    return adminCheck.response
  }

  try {
    const body = await request.json().catch(() => ({}))
    const brandId: string | undefined = body?.id

    if (!brandId) {
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
        const filePath = u.pathname.split('/brand_images/')[1]
        if (filePath) {
          await supabase.storage.from('brand_images').remove([filePath])
        }
      } catch {
        // ignore storage errors here; DB cleanup will still occur
      }
    }

    // Fetch brand (for logo_url and cover_url)
    const { data: brand, error: brandErr } = await supabase
      .from('brands')
      .select('id, logo_url, cover_url')
      .eq('id', brandId)
      .single()

    if (brandErr || !brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    // Delete logo / cover files from storage (if any)
    if (brand.logo_url) {
      await removeFromStorageByUrl(brand.logo_url)
    }
    if (brand.cover_url) {
      await removeFromStorageByUrl(brand.cover_url)
    }

    // Delete offers for this brand
    const { error: offersErr } = await supabase
      .from('brand_offers')
      .delete()
      .eq('brand_id', brandId)
    if (offersErr) {
      logger.error('Failed to delete brand offers', offersErr, { brandId })
      return NextResponse.json(
        { error: 'Failed to delete brand offers' },
        { status: 500 }
      )
    }

    // Finally delete brand
    const { error: delErr } = await supabase
      .from('brands')
      .delete()
      .eq('id', brandId)

    if (delErr) {
      logger.error('Failed to delete brand', delErr, { brandId })
      return NextResponse.json(
        { error: 'Failed to delete brand' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Unexpected error in brand delete API', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

