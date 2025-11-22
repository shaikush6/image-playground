/**
 * Background Removal Service
 *
 * Primary: Gemini Pro for AI-powered background removal
 * Fallbacks: WithoutBG API, OpenAI DALL-E, original image
 */

import { removeBackgroundWithGemini } from './geminiV2';
import type { GeminiModelType } from './geminiV2';

export interface BackgroundRemovalResult {
  success: boolean;
  imageUrl?: string;
  imageData?: string; // base64 encoded
  error?: string;
}

export interface BackgroundRemovalOptions {
  format?: 'png' | 'jpg';
  size?: 'preview' | 'medium' | 'full';
  model?: GeminiModelType; // 'flash' or 'pro' - defaults to 'pro'
  productDescription?: string;
}

/**
 * Remove background from image with cascading fallbacks
 * 1. Gemini Pro (primary - AI-powered background removal)
 * 2. WithoutBG API (fallback 1)
 * 3. OpenAI DALL-E (fallback 2)
 * 4. Original image (last resort)
 */
export async function removeBackground(
  imageFile: File | string,
  options?: BackgroundRemovalOptions
): Promise<BackgroundRemovalResult> {
  // Convert image to base64 or get data URL
  let imageData: string;
  if (imageFile instanceof File) {
    imageData = await fileToBase64(imageFile);
  } else {
    imageData = imageFile;
  }

  // Ensure we have a data URL format for Gemini
  const imageDataUrl = imageData.includes('data:')
    ? imageData
    : `data:image/png;base64,${imageData}`;

  // Remove data URL prefix if present to get pure base64 (for WithoutBG)
  const base64Image = imageData.includes('base64,')
    ? imageData.split('base64,')[1]
    : imageData;

  // Try Gemini Pro first (primary - AI-powered background removal)
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    const geminiResult = await tryGeminiPro(imageDataUrl, options);
    if (geminiResult.success) {
      console.log('✓ Background removed using Gemini Pro');
      return geminiResult;
    }
    console.warn('✗ Gemini Pro failed:', geminiResult.error);
  }

  // Fallback to WithoutBG (if configured)
  if (process.env.WITHOUTBG_API_KEY) {
    const withoutBgResult = await tryWithoutBG(base64Image, options);
    if (withoutBgResult.success) {
      console.log('✓ Background removed using WithoutBG');
      return withoutBgResult;
    }
    console.warn('✗ WithoutBG failed:', withoutBgResult.error);
  }

  // Fallback to OpenAI (if configured)
  if (process.env.OPENAI_API_KEY) {
    const openAIResult = await tryOpenAI(imageDataUrl);
    if (openAIResult.success) {
      console.log('✓ Background removed using OpenAI');
      return openAIResult;
    }
    console.warn('✗ OpenAI failed:', openAIResult.error);
  }

  // Last resort: Return original image with instructions to manually remove background
  console.warn('⚠️ No background removal service available - using original image');
  return {
    success: true,
    imageData: imageDataUrl,
    error: 'Background removal services unavailable. Please use an image with transparent background or configure API keys.',
  };
}

/**
 * Try Gemini Pro for AI-powered background removal
 */
async function tryGeminiPro(
  imageDataUrl: string,
  options?: BackgroundRemovalOptions
): Promise<BackgroundRemovalResult> {
  try {
    const result = await removeBackgroundWithGemini(
      imageDataUrl,
      options?.productDescription,
      { model: options?.model || 'pro' }
    );

    if (result.success && result.imageData) {
      return {
        success: true,
        imageData: result.imageData,
      };
    }

    throw new Error(result.error || 'No image returned from Gemini');
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Try WithoutBG API
 */
async function tryWithoutBG(
  base64Image: string,
  options?: { format?: 'png' | 'jpg'; size?: 'preview' | 'medium' | 'full' }
): Promise<BackgroundRemovalResult> {
  try {
    const apiKey = process.env.WITHOUTBG_API_KEY;
    if (!apiKey) {
      throw new Error('WithoutBG API key not configured');
    }

    const response = await fetch('https://api.withoutbg.com/v1/remove-bg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        image: base64Image,
        output_format: options?.format || 'png',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WithoutBG API error response:', errorText);
      throw new Error(`WithoutBG API error: ${response.status}`);
    }

    const result = await response.json();

    if (result.image || result.output_image || result.data) {
      const imageBase64 = result.image || result.output_image || result.data;
      const dataUrl = imageBase64.startsWith('data:')
        ? imageBase64
        : `data:image/png;base64,${imageBase64}`;

      return { success: true, imageData: dataUrl };
    }

    throw new Error('No image data in response');
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Try OpenAI image editing (DALL-E has background removal capabilities)
 */
async function tryOpenAI(imageDataUrl: string): Promise<BackgroundRemovalResult> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Convert data URL to blob for OpenAI
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();

    // Create form data
    const formData = new FormData();
    formData.append('image', blob, 'image.png');
    formData.append('prompt', 'Remove the background, keep only the main subject isolated on transparent background');
    formData.append('n', '1');
    formData.append('size', '1024x1024');

    // Call OpenAI image edit endpoint
    const editResponse = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!editResponse.ok) {
      throw new Error(`OpenAI API error: ${editResponse.status}`);
    }

    const result = await editResponse.json();

    if (result.data && result.data[0]?.url) {
      // Download the generated image and convert to base64
      const imageResponse = await fetch(result.data[0].url);
      const imageBlob = await imageResponse.blob();
      const reader = new FileReader();

      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve({
            success: true,
            imageData: reader.result as string,
          });
        };
        reader.readAsDataURL(imageBlob);
      });
    }

    throw new Error('No image URL in response');
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
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
