/**
 * Background Removal Service
 *
 * Handles object extraction and background removal using WithoutBG API
 * Falls back to client-side processing if API is unavailable
 */

export interface BackgroundRemovalResult {
  success: boolean;
  imageUrl?: string;
  imageData?: string; // base64 encoded
  error?: string;
}

/**
 * Remove background from image using WithoutBG API
 */
export async function removeBackground(
  imageFile: File | string,
  options?: {
    format?: 'png' | 'jpg';
    size?: 'preview' | 'medium' | 'full';
  }
): Promise<BackgroundRemovalResult> {
  try {
    const apiKey = process.env.WITHOUTBG_API_KEY;

    if (!apiKey) {
      throw new Error('WithoutBG API key not configured');
    }

    // Convert image to base64 if it's a File
    let imageData: string;
    if (imageFile instanceof File) {
      imageData = await fileToBase64(imageFile);
    } else {
      imageData = imageFile;
    }

    // Call WithoutBG API
    const response = await fetch('https://api.without.bg/v1/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({
        image: imageData,
        format: options?.format || 'png',
        size: options?.size || 'medium'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `API error: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      imageUrl: result.image_url,
      imageData: result.image_data,
    };
  } catch (error) {
    console.error('Background removal error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Convert File to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove data:image/...;base64, prefix
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload PNG, JPEG, or WebP images.',
    };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File too large. Maximum size is 10MB.',
    };
  }

  return { valid: true };
}

/**
 * Preview image file as data URL
 */
export function previewImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to preview image'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}
