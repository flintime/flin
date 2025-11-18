import imageSize from 'image-size'
import { Buffer } from 'buffer'

export interface ImageDimensionValidationResult {
  valid: boolean
  error?: string
}

interface ImageDimensionValidationOptions {
  minWidth: number
  minHeight: number
  /**
   * Target aspect ratio (width / height).
   * For 7:4 this is 1.75; for 16:9 this is ~1.78.
   */
  targetAspectRatio: number
  /**
   * Allowed absolute difference between actual aspect ratio and target.
   * This lets us support both 7:4 and 16:9 as “close enough”.
   */
  aspectRatioTolerance: number
}

const DEFAULT_COVER_IMAGE_OPTIONS: ImageDimensionValidationOptions = {
  minWidth: 1120,
  minHeight: 640,
  // 7:4 ≈ 1.75, 16:9 ≈ 1.78 – we’ll target 7:4 but allow a small tolerance so 16:9 passes.
  targetAspectRatio: 7 / 4,
  aspectRatioTolerance: 0.05,
}

export async function validateCoverImageDimensions(
  file: File,
  options: ImageDimensionValidationOptions = DEFAULT_COVER_IMAGE_OPTIONS
): Promise<ImageDimensionValidationResult> {
  // Only enforce dimensions for raster images where we can reliably read size.
  // SVGs don’t have fixed pixel dimensions, so we skip strict checks for them.
  if (file.type === 'image/svg+xml') {
    return {
      valid: false,
      error:
        'SVG cover images are not supported. Please upload a JPEG, PNG, or WebP image at least 1120×640px in a 7:4 (≈16:9) landscape ratio.',
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const { width, height } = imageSize(buffer)

  if (!width || !height) {
    return {
      valid: false,
      error: 'Unable to read image dimensions. Please upload a standard JPEG, PNG, or WebP file.',
    }
  }

  if (width < options.minWidth || height < options.minHeight) {
    return {
      valid: false,
      error: `Image is too small. Minimum size is ${options.minWidth}×${options.minHeight}px.`,
    }
  }

  const aspectRatio = width / height
  const diff = Math.abs(aspectRatio - options.targetAspectRatio)

  if (diff > options.aspectRatioTolerance) {
    return {
      valid: false,
      error:
        'Image must be a landscape cover in approximately 7:4 (≈16:9) aspect ratio and at least 1120×640px.',
    }
  }

  return { valid: true }
}


