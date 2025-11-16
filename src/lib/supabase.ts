import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Legacy client for API routes that use Bearer tokens
// For client-side components, use '@/lib/supabase/client' instead
// For server components, use '@/lib/supabase/server' instead
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
 

export interface Vendor {
  id?: string
  name: string
  logo_url: string
  phone: string
  email?: string
  address: string
  latitude: number
  longitude: number
  vendor_pin?: string  // 6-digit unique PIN for each vendor
  created_at?: string
  updated_at?: string
  about?: string
  website?: string
  tags?: string[]
  vendor_type?: string
  user_id?: string
}

export interface VendorSignupData {
  businessName: string
  email: string
  password: string
  businessType: string
}

// Interest/lead submission from vendors (no auth creation)
export interface VendorInterestData {
  businessName: string
  email: string
  contactName?: string
  phone?: string
  city?: string
  state?: string
  
}

// Offer related types
export type OfferStatus = 'active' | 'expired' | 'paused'

export interface Offer {
  id?: string
  vendor_id: string
  title: string
  start_date: string
  end_date: string
  discount_value?: number
  terms_conditions?: string
  status?: OfferStatus
  created_at?: string
  updated_at?: string
  featured?: boolean
}

export interface OfferFormData {
  title: string
  start_date: string
  end_date: string
  terms_conditions: string
}