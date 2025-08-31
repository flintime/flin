import { NextRequest, NextResponse } from 'next/server'
import { getAddressAutocomplete, LocationIQError } from '@/lib/googleMaps'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const limitParam = searchParams.get('limit')
  
  if (!query) {
    return NextResponse.json({
      error: 'Missing query parameter',
      usage: 'Add ?q=your_query to search for address suggestions'
    }, { status: 400 })
  }

  if (query.trim().length < 2) {
    return NextResponse.json({
      suggestions: [],
      message: 'Query too short - need at least 2 characters'
    })
  }

  const limit = limitParam ? Math.min(parseInt(limitParam), 10) : 5

  try {
    const suggestions = await getAddressAutocomplete(query, limit)
    
    return NextResponse.json({
      success: true,
      query,
      suggestions,
      count: suggestions.length
    })
  } catch (error) {
    console.error('Autocomplete API error:', error)
    
    if (error instanceof LocationIQError) {
      return NextResponse.json({
        success: false,
        error: error.message,
        error_code: error.code,
        query
      }, { status: error.status || 500 })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Unexpected error during autocomplete',
      query
    }, { status: 500 })
  }
}
