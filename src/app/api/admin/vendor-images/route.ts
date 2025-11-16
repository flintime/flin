import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/server-auth'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Accepts multipart/form-data with fields:
// - vendor_id: string (required)
// - type: 'logo' | 'cover' (required)
// - file: File (required)
export async function POST(request: NextRequest) {
  // Verify admin
  const adminCheck = await requireAdmin(request)
  if (adminCheck.error) {
    return adminCheck.response
  }

  try {
    const form = await request.formData()
    const vendorId = String(form.get('vendor_id') || '')
    const type = String(form.get('type') || '')
    const file = form.get('file') as File | null

    if (!vendorId || !file || (type !== 'logo' && type !== 'cover')) {
      return NextResponse.json(
        { error: 'vendor_id, type, and file are required' },
        { status: 400 }
      )
    }

    // Basic server-side validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed' },
        { status: 400 }
      )
    }
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      )
    }

    // Create authenticated Supabase client using admin's session cookies
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

    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).slice(2, 8)
    const path =
      type === 'logo'
        ? `${vendorId}/logo/${timestamp}-${randomSuffix}.${ext}`
        : `${vendorId}/cover/${timestamp}-${randomSuffix}.${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('vendor-images')
      .upload(path, file, { cacheControl: '3600', upsert: false })
    if (uploadErr) {
      return NextResponse.json({ error: `Upload failed: ${uploadErr.message}` }, { status: 500 })
    }

    const { data: pub } = supabase.storage.from('vendor-images').getPublicUrl(path)
    const publicUrl = pub?.publicUrl
    if (!publicUrl) {
      return NextResponse.json({ error: 'Failed to obtain public URL' }, { status: 500 })
    }

    if (type === 'logo') {
      const { error: updateErr } = await supabase
        .from('vendors')
        .update({ logo_url: publicUrl })
        .eq('id', vendorId)
      if (updateErr) {
        // best-effort cleanup
        await supabase.storage.from('vendor-images').remove([path])
        return NextResponse.json({ error: `Failed to update vendor logo: ${updateErr.message}` }, { status: 500 })
      }
      return NextResponse.json({ success: true, data: { type, url: publicUrl } })
    } else {
      // cover image -> vendor_images table
      // determine sort_order and is_primary
      const { count } = await supabase
        .from('vendor_images')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendorId)

      const sortOrder = (count || 0) + 1
      const isPrimary = (count || 0) === 0

      const { error: insertErr } = await supabase
        .from('vendor_images')
        .insert({
          vendor_id: vendorId,
          image_url: publicUrl,
          is_primary: isPrimary,
          sort_order: sortOrder,
        })
      if (insertErr) {
        // best-effort cleanup
        await supabase.storage.from('vendor-images').remove([path])
        return NextResponse.json({ error: `Failed to save cover image: ${insertErr.message}` }, { status: 500 })
      }
      return NextResponse.json({ success: true, data: { type, url: publicUrl, sort_order: sortOrder } })
    }
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Remove vendor image (cover by id) or vendor logo by vendor_id
export async function DELETE(request: NextRequest) {
  const adminCheck = await requireAdmin(request)
  if (adminCheck.error) {
    return adminCheck.response
  }
  try {
    const body = await request.json()
    const id: string | undefined = body?.id
    const vendorId: string | undefined = body?.vendor_id
    const type: 'logo' | 'cover' | undefined = body?.type
    const imageUrl: string | undefined = body?.image_url

    const cookieStore = await cookies()
    const supabase = createServerClient(
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

    // Helper to remove from storage by public URL
    async function removeFromStorageByUrl(url: string) {
      try {
        const u = new URL(url)
        const filePath = u.pathname.split('/vendor-images/')[1]
        if (filePath) {
          await supabase.storage.from('vendor-images').remove([filePath])
        }
      } catch {
        // ignore
      }
    }

    if (id) {
      // Delete cover image by vendor_images.id
      const { data: row, error: rowErr } = await supabase
        .from('vendor_images')
        .select('id, image_url')
        .eq('id', id)
        .single()
      if (rowErr || !row) {
        return NextResponse.json({ error: 'Image not found' }, { status: 404 })
      }
      await removeFromStorageByUrl(row.image_url)
      const { error: delErr } = await supabase.from('vendor_images').delete().eq('id', id)
      if (delErr) {
        return NextResponse.json({ error: 'Failed to delete image record' }, { status: 500 })
      }
      return NextResponse.json({ success: true })
    }

    if (vendorId && type === 'logo') {
      // Delete vendor logo (clear DB and remove storage)
      // Fetch current logo_url if not provided
      let url = imageUrl
      if (!url) {
        const { data: vendor } = await supabase
          .from('vendors')
          .select('logo_url')
          .eq('id', vendorId)
          .single()
        url = vendor?.logo_url || undefined
      }
      if (url) {
        await removeFromStorageByUrl(url)
      }
      const { error: updErr } = await supabase
        .from('vendors')
        .update({ logo_url: null })
        .eq('id', vendorId)
      if (updErr) {
        return NextResponse.json({ error: 'Failed to clear vendor logo' }, { status: 500 })
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


