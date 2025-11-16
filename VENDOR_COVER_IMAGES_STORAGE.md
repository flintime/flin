# Vendor Cover Images Storage Documentation

## 📊 Database Storage

### Table: `vendor_images`

Vendor cover images are stored in the `vendor_images` table with the following schema:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `vendor_id` | UUID | Foreign key to `vendors.id` |
| `image_url` | TEXT | Public URL of the image in Supabase Storage |
| `is_primary` | BOOLEAN | Whether this is the primary/featured image (default: false) |
| `sort_order` | INTEGER | Order for displaying images (default: 0) |
| `created_at` | TIMESTAMP | Auto-generated timestamp |

### Example Record:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "vendor_id": "123e4567-e89b-12d3-a456-426614174000",
  "image_url": "https://[project].supabase.co/storage/v1/object/public/vendor-images/vendors/123e4567/cover-1234567890-abc123.jpg",
  "is_primary": true,
  "sort_order": 1,
  "created_at": "2024-01-15T10:30:00Z"
}
```

## 📁 File Storage

### Storage Bucket: `vendor-images`

Images are physically stored in Supabase Storage in the `vendor-images` bucket.

**Storage Path Structure:**
```
vendor-images/
  └── vendors/
      └── {vendor_id}/
          ├── logo-{timestamp}.{ext}
          ├── cover-{timestamp}-{random}.{ext}
          ├── cover-{timestamp}-{random}.{ext}
          └── ...
```

**Example Path:**
```
vendors/123e4567-e89b-12d3-a456-426614174000/cover-1705315800000-xyz789.jpg
```

## 🔄 Complete Save Flow

### Step-by-Step Process:

1. **User Uploads Images**
   - User selects multiple cover images in the form
   - Files are stored in `coverFiles` state array
   - Client-side validation occurs (file type, size)

2. **Vendor Record Created**
   ```typescript
   // First, create the vendor record
   const { data: created } = await supabase
     .from('vendors')
     .insert([vendorData])
     .select('id, name')
     .single()
   ```
   - Creates vendor record in `vendors` table
   - Gets the `vendor_id` (UUID)

3. **Images Uploaded to Storage**
   ```typescript
   // For each cover image file:
   const path = `vendors/${created.id}/cover-${Date.now()}-${random}.${ext}`
   await supabase.storage
     .from('vendor-images')
     .upload(path, file, { cacheControl: '3600', upsert: false })
   ```
   - Uploads each file to Supabase Storage
   - Path: `vendors/{vendor_id}/cover-{timestamp}-{random}.{ext}`
   - Storage bucket: `vendor-images`

4. **Get Public URL**
   ```typescript
   const { data: pub } = supabase.storage
     .from('vendor-images')
     .getPublicUrl(path)
   // Returns: https://[project].supabase.co/storage/v1/object/public/vendor-images/vendors/...
   ```

5. **Save Metadata to Database**
   ```typescript
   await supabase.from('vendor_images').insert({
     vendor_id: created.id,           // Links to vendor
     image_url: pub.publicUrl,        // Public URL from storage
     is_primary: sortOrder === 1,     // First image is primary
     sort_order: sortOrder++         // Sequential order
   })
   ```
   - Creates record in `vendor_images` table
   - Stores the public URL (not the file itself)
   - Sets primary flag and sort order

## 📍 Code Location

**File:** `src/app/9165980203/local-offers-builder/page.tsx`

**Function:** `submitVendor()` (lines 296-322)

```typescript
// Upload cover images if provided
if (coverFiles.length > 0) {
  try {
    let sortOrder = 1
    for (const file of coverFiles) {
      // 1. Generate unique path
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const path = `vendors/${created.id}/cover-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
      
      // 2. Upload to storage
      const { error: uploadErr } = await supabase.storage
        .from('vendor-images')
        .upload(path, file, { cacheControl: '3600', upsert: false })
      if (uploadErr) throw uploadErr
      
      // 3. Get public URL
      const { data: pub } = supabase.storage
        .from('vendor-images')
        .getPublicUrl(path)
      
      // 4. Save metadata to database
      if (pub?.publicUrl) {
        await supabase.from('vendor_images').insert({
          vendor_id: created.id,
          image_url: pub.publicUrl,
          is_primary: sortOrder === 1,  // First image = primary
          sort_order: sortOrder++
        })
      }
    }
  } catch (err) {
    // Error handling...
  }
}
```

## 🔍 How to Query Cover Images

### Get all cover images for a vendor:
```sql
SELECT * 
FROM vendor_images 
WHERE vendor_id = 'vendor-uuid-here'
ORDER BY sort_order ASC;
```

### Get primary image only:
```sql
SELECT * 
FROM vendor_images 
WHERE vendor_id = 'vendor-uuid-here' 
  AND is_primary = true
LIMIT 1;
```

### In Code (TypeScript):
```typescript
const { data: images } = await supabase
  .from('vendor_images')
  .select('*')
  .eq('vendor_id', vendorId)
  .order('sort_order', { ascending: true })
```

## 🗂️ Relationship Diagram

```
vendors table
├── id (UUID) ──────────────┐
├── name                     │
├── logo_url                 │
└── ...                      │
                            │
                            │ (foreign key)
                            ▼
                    vendor_images table
                    ├── id (UUID)
                    ├── vendor_id (FK) ────┘
                    ├── image_url (TEXT) ────┐
                    ├── is_primary (BOOL)    │
                    ├── sort_order (INT)      │
                    └── created_at           │
                                             │
                                             │ (references)
                                             ▼
                                    Supabase Storage
                                    vendor-images bucket
                                    vendors/{vendor_id}/
                                    cover-*.jpg
```

## 📝 Key Points

1. **Two-Step Storage:**
   - **Physical files** → Supabase Storage (`vendor-images` bucket)
   - **Metadata** → PostgreSQL database (`vendor_images` table)

2. **Database stores URLs, not files:**
   - The `image_url` column contains the public URL
   - The actual file is in Supabase Storage
   - This allows for CDN delivery and efficient storage

3. **Multiple Images Per Vendor:**
   - Each vendor can have multiple cover images
   - Each image gets its own row in `vendor_images`
   - Ordered by `sort_order`
   - One image marked as `is_primary`

4. **File Organization:**
   - Files organized by vendor: `vendors/{vendor_id}/`
   - Unique filenames prevent conflicts
   - Format: `cover-{timestamp}-{random}.{ext}`

5. **Primary Image:**
   - First uploaded image (`sortOrder === 1`) is marked as primary
   - Can be changed later in the edit drawer

