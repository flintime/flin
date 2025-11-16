import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/server-auth'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// POST - Upload brand logo/cover
// multipart/form-data: brand_id, type('logo'|'cover'), file, optional old_url
export async function POST(request: NextRequest) {
  const adminCheck = await requireAdmin(request)
  if (adminCheck.error) {
    return adminCheck.response
  }
  try {
    const form = await request.formData()
    const brandId = String(form.get('brand_id') || '')
    const type = String(form.get('type') || '')
    const file = form.get('file') as File | null
    const oldUrl = (form.get('old_url') as string) || ''

    if (!brandId || !file || (type !== 'logo' && type !== 'cover')) {
      return NextResponse.json({ error: 'brand_id, type, and file are required' }, { status: 400 })
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
          setAll() {},
        },
      }
    )

    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).slice(2, 8)
    const path =
      type === 'logo'
        ? `${brandId}/logo/${timestamp}-${randomSuffix}.${ext}`
        : `${brandId}/cover/${timestamp}-${randomSuffix}.${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('brand_images')
      .upload(path, file, { cacheControl: '3600', upsert: false })
    if (uploadErr) {
      return NextResponse.json({ error: `Upload failed: ${uploadErr.message}` }, { status: 500 })
    }

    const { data: pub } = supabase.storage.from('brand_images').getPublicUrl(path)
    const publicUrl = pub?.publicUrl
    if (!publicUrl) {
      return NextResponse.json({ error: 'Failed to obtain public URL' }, { status: 500 })
    }

    const update = type === 'logo' ? { logo_url: publicUrl } : { cover_url: publicUrl }
    const { error: updErr } = await supabase.from('brands').update(update).eq('id', brandId)
    if (updErr) {
      // best-effort cleanup
      await supabase.storage.from('brand_images').remove([path])
      return NextResponse.json({ error: `Failed to update brand: ${updErr.message}` }, { status: 500 })
    }

    // Remove old file if provided
    if (oldUrl) {
      try {
        const u = new URL(oldUrl)
        const filePath = u.pathname.split('/brand_images/')[1]
        if (filePath) {
          await supabase.storage.from('brand_images').remove([filePath])
        }
      } catch {
        // ignore
      }
    }

    return NextResponse.json({ success: true, data: { type, url: publicUrl } })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Remove brand logo/cover and clear DB field
// JSON: { brand_id: string, type: 'logo'|'cover', image_url?: string }
export async function DELETE(request: NextRequest) {
  const adminCheck = await requireAdmin(request)
  if (adminCheck.error) {
    return adminCheck.response
  }
  try {
    const body = await request.json()
    const brandId: string | undefined = body?.brand_id
    const type: 'logo' | 'cover' | undefined = body?.type
    let imageUrl: string | undefined = body?.image_url

    if (!brandId || (type !== 'logo' && type !== 'cover')) {
      return NextResponse.json({ error: 'brand_id and valid type are required' }, { status: 400 })
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
          setAll() {},
        },
      }
    )

    if (!imageUrl) {
      const { data: brand } = await supabase
        .from('brands')
        .select('logo_url, cover_url')
        .eq('id', brandId)
        .single()

      imageUrl = type === 'logo' ? brand?.logo_url : brand?.cover_url
    }

    if (imageUrl) {
      try {
        const u = new URL(imageUrl)
        const filePath = u.pathname.split('/brand_images/')[1]
        if (filePath) {
          await supabase.storage.from('brand_images').remove([filePath])
        }
      } catch {
        // ignore
      }
    }

    const update = type === 'logo' ? { logo_url: null } : { cover_url: null }
    const { error: updErr } = await supabase.from('brands').update(update).eq('id', brandId)
    if (updErr) {
      return NextResponse.json({ error: 'Failed to clear brand image field' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


