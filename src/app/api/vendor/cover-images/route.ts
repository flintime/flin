import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// GET - Fetch vendor cover images
export async function GET(request: NextRequest) {
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

    // Get cover images
    const { data: images, error: imagesError } = await supabase
      .from('vendor_images')
      .select('*')
      .eq('vendor_id', vendorData.id)
      .order('sort_order', { ascending: true })

    if (imagesError) {
      console.error('Images fetch error:', imagesError)
      return NextResponse.json(
        { error: 'Failed to fetch images' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: images || []
    })

  } catch (error) {
    console.error('Cover images fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a cover image
export async function DELETE(request: NextRequest) {
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

    // Get image ID from request
    const { imageId } = await request.json()
    
    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      )
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

    // Get image details
    const { data: imageData, error: imageError } = await supabase
      .from('vendor_images')
      .select('*')
      .eq('id', imageId)
      .eq('vendor_id', vendorData.id)
      .single()

    if (imageError || !imageData) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Create authenticated client for RLS
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

    // Delete from database
    const { error: deleteError } = await userSupabase
      .from('vendor_images')
      .delete()
      .eq('id', imageId)

    if (deleteError) {
      console.error('Image delete error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete image' },
        { status: 500 }
      )
    }

    // Extract file path from URL and delete from storage
    try {
      const url = new URL(imageData.image_url)
      const filePath = url.pathname.split('/vendor-images/')[1]
      if (filePath) {
        await userSupabase.storage.from('vendor-images').remove([filePath])
      }
    } catch (storageError) {
      console.error('Storage delete error:', storageError)
      // Don't fail the request if storage deletion fails
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    })

  } catch (error) {
    console.error('Delete image error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
