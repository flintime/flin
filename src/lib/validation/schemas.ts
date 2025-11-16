import { z } from 'zod'

/**
 * Validation schemas for admin forms
 */

// Brand validation schema
export const brandSchema = z.object({
  name: z.string()
    .min(1, 'Brand name is required')
    .max(100, 'Brand name must be less than 100 characters')
    .trim(),
  website: z.string()
    .max(255, 'Website URL must be less than 255 characters')
    .refine((val) => !val || val === '' || z.string().url().safeParse(val).success, 'Invalid website URL')
    .optional()
    .or(z.literal('')),
  about: z.string()
    .max(1000, 'About must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  tags: z.string()
    .max(500, 'Tags must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  category: z.string()
    .max(50, 'Category must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  sort_order: z.string()
    .min(1, 'Sort order is required')
    .refine((val) => /^\d+$/.test(val), 'Sort order must be an integer')
})

// Vendor validation schema
export const vendorSchema = z.object({
  name: z.string()
    .min(1, 'Vendor name is required')
    .max(100, 'Vendor name must be less than 100 characters')
    .trim(),
  website: z.string()
    .max(255, 'Website must be less than 255 characters')
    .optional()
    .or(z.literal('')),
  address: z.string()
    .min(1, 'Address is required')
    .max(500, 'Address must be less than 500 characters')
    .trim(),
  phone: z.string()
    .min(1, 'Phone is required')
    .max(50, 'Phone must be less than 50 characters')
    .trim(),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .optional()
    .or(z.literal('')),
  about: z.string()
    .min(1, 'About is required')
    .max(1000, 'About must be less than 1000 characters')
    .trim(),
  tags: z.string()
    .min(1, 'Tags are required')
    .max(500, 'Tags must be less than 500 characters')
    .trim(),
  category: z.string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters')
    .trim(),
  latitude: z.string()
    .refine((val) => {
      const num = parseFloat(val)
      if (isNaN(num)) return false
      return num >= -90 && num <= 90
    }, 'Latitude must be a valid number between -90 and 90'),
  longitude: z.string()
    .refine((val) => {
      const num = parseFloat(val)
      if (isNaN(num)) return false
      return num >= -180 && num <= 180
    }, 'Longitude must be a valid number between -180 and 180')
})

// Offer validation schema
export const offerSchema = z.object({
  vendor_id: z.string().uuid('Invalid vendor ID').optional(),
  brand_id: z.string().uuid('Invalid brand ID').optional(),
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  start_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .optional()
    .or(z.literal('')),
  end_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .optional()
    .or(z.literal('')),
  terms_conditions: z.string()
    .max(2000, 'Terms & conditions must be less than 2000 characters')
    .optional()
    .or(z.literal('')),
  featured: z.boolean().default(false),
  discount_type: z.enum(['in_store', 'online', 'both']).optional()
}).refine((data) => {
  // At least one of vendor_id or brand_id must be provided
  return data.vendor_id || data.brand_id
}, {
  message: 'Either vendor_id or brand_id must be provided',
  path: ['vendor_id']
})

// File validation helper
export const fileSchema = z.object({
  name: z.string(),
  size: z.number().max(5 * 1024 * 1024, 'File size must be less than 5MB'),
  type: z.string().refine(
    (type) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'].includes(type),
    'Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed'
  )
})

