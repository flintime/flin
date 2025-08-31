import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export type VendorType = 'restaurant' | 'retail' | 'service' | 'entertainment' | 'health' | 'education' | 'technology' | 'other'

// Centralized business types configuration
export const BUSINESS_TYPES: { value: VendorType; label: string }[] = [
  { value: 'restaurant', label: 'Restaurant/Food Service' },
  { value: 'retail', label: 'Retail Store' },
  { value: 'service', label: 'Professional Service' },
  { value: 'entertainment', label: 'Entertainment/Recreation' },
  { value: 'health', label: 'Health/Fitness' },
  { value: 'education', label: 'Education/Tutoring' },
  { value: 'technology', label: 'Technology' },
  { value: 'other', label: 'Other' },
]

// Helper function to get valid business type values
export const getValidBusinessTypes = (): VendorType[] => {
  return BUSINESS_TYPES.map(type => type.value)
}

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
  vendor_type?: VendorType
  user_id?: string
}

export interface VendorSignupData {
  businessName: string
  email: string
  password: string
  businessType: VendorType
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