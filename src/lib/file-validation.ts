/**
 * Server-side file validation utilities
 */

export interface FileValidationResult {
  valid: boolean
  error?: string
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml'
]

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

/**
 * Validate file type by checking magic bytes (more secure than MIME type)
 */
async function validateFileType(file: File): Promise<boolean> {
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer.slice(0, 12))

  // JPEG: FF D8 FF
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
    return true
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
    return true
  }

  // WebP: RIFF ... WEBP
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return true
  }

  // SVG: Check for XML declaration or <svg tag
  const text = new TextDecoder().decode(buffer.slice(0, 100))
  if (text.trim().startsWith('<?xml') || text.trim().startsWith('<svg')) {
    return true
  }

  return false
}

/**
 * Validate file (server-side)
 */
export async function validateFile(file: File): Promise<FileValidationResult> {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`
    }
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed'
    }
  }

  // Validate actual file content (magic bytes)
  const isValidType = await validateFileType(file)
  if (!isValidType) {
    return {
      valid: false,
      error: 'File content does not match declared type. Possible file corruption or malicious file.'
    }
  }

  // Check filename for dangerous patterns
  const filename = file.name.toLowerCase()
  const dangerousPatterns = [
    /\.\./,           // Path traversal
    /[<>:"|?*]/,      // Invalid filename characters
    /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i, // Windows reserved names
    /\.(exe|bat|cmd|com|pif|scr|vbs|js)$/i    // Executable extensions
  ]

  for (const pattern of dangerousPatterns) {
    if (pattern.test(filename)) {
      return {
        valid: false,
        error: 'Invalid filename'
      }
    }
  }

  return { valid: true }
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace invalid chars with underscore
    .replace(/\.\./g, '')              // Remove path traversal
    .substring(0, 255)                 // Limit length
}

