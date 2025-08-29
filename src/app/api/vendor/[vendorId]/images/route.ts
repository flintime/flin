import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Fetch vendor's public images (for displaying on public vendor pages)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ vendorId: string }> }
) {
  try {
    const { vendorId } = await params

    if (!vendorId) {
      return NextResponse.json(
        { error: 'Vendor ID is required' },
        { status: 400 }
      )
    }

    // Get vendor basic info
    const { data: vendorData, error: vendorError } = await supabase
      .from('vendors')
      .select('id, name, logo_url, vendor_pin')
      .eq('id', vendorId)
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
      .eq('vendor_id', vendorId)
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
      data: {
        vendor: vendorData,
        coverImages: images || []
      }
    })

  } catch (error) {
    console.error('Public vendor images fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
