import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { validateCoverImageDimensions } from '@/lib/image-dimensions'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    // Extract the token
    const token = authHeader.split(' ')[1]
    
    // Verify the user with Supabase
    const { data: userData, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !userData.user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const imageType = formData.get('type') as string // 'logo' or 'cover'
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!['logo', 'cover'].includes(imageType)) {
      return NextResponse.json(
        { error: 'Invalid image type. Must be "logo" or "cover"' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      )
    }

    // Enforce standardized dimensions and aspect ratio for cover images
    if (imageType === 'cover') {
      const dimensionValidation = await validateCoverImageDimensions(file)
      if (!dimensionValidation.valid) {
        return NextResponse.json(
          { error: dimensionValidation.error },
          { status: 400 }
        )
      }
    }

    // Find vendor
    const { data: vendorData, error: vendorError } = await supabase
      .from('vendors')
      .select('id')
      .eq('user_id', userData.user.id)
      .single()

    if (vendorError || !vendorData) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Create authenticated client for both storage and database operations
    const userSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    )

    // Create file path
    const fileExt = file.name.split('.').pop()
    const fileName = `${vendorData.id}/${imageType}/${Date.now()}.${fileExt}`

    // Upload to Supabase Storage using authenticated client
    const { error: uploadError } = await userSupabase.storage
      .from('vendor-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload image: ' + uploadError.message },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = userSupabase.storage
      .from('vendor-images')
      .getPublicUrl(fileName)

    const imageUrl = urlData.publicUrl

    if (imageType === 'logo') {
      // Update vendor logo_url
      const { data: updatedVendor, error: updateError } = await userSupabase
        .from('vendors')
        .update({ logo_url: imageUrl, updated_at: new Date().toISOString() })
        .eq('id', vendorData.id)
        .select()
        .single()

      if (updateError) {
        console.error('Logo update error:', updateError)
        // Clean up uploaded file
        await userSupabase.storage.from('vendor-images').remove([fileName])
        return NextResponse.json(
          { error: 'Failed to update logo' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Logo uploaded successfully',
        data: {
          type: 'logo',
          url: imageUrl,
          vendor: updatedVendor
        }
      })

    } else {
      // Handle cover image - add to vendor_images table
      const { data: existingImages } = await userSupabase
        .from('vendor_images')
        .select('id')
        .eq('vendor_id', vendorData.id)

      const sortOrder = (existingImages?.length || 0) + 1

      const { data: imageRecord, error: imageError } = await userSupabase
        .from('vendor_images')
        .insert({
          vendor_id: vendorData.id,
          image_url: imageUrl,
          is_primary: sortOrder === 1, // First image is primary
          sort_order: sortOrder
        })
        .select()
        .single()

      if (imageError) {
        console.error('Cover image insert error:', imageError)
        // Clean up uploaded file
        await userSupabase.storage.from('vendor-images').remove([fileName])
        return NextResponse.json(
          { error: 'Failed to save cover image' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Cover image uploaded successfully',
        data: {
          type: 'cover',
          url: imageUrl,
          image: imageRecord
        }
      })
    }

  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
