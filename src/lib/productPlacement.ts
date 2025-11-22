/**
 * Product Placement Service
 *
 * Handles product placement in environments using Gemini V2 (Pro/Flash)
 * with fallback to DALL-E and mock mode
 */

import { getVariationById } from '@/config/environments';
import { placeProductInEnvironment, GEMINI_MODELS } from './geminiV2';
import type { GeminiModelType } from './geminiV2';

export interface ProductPlacementOptions {
  productImage: string; // base64 encoded image with background removed
  categoryId: string;
  variationId?: string;
  customPrompt?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:5' | '2:3' | '3:2' | '21:9' | '4:3';
  productDescription?: string; // Optional description of the product
  model?: GeminiModelType; // 'flash' or 'pro' - defaults to 'pro'
  colorPalette?: string[];
}

// Re-export model types for UI consumption
export { GEMINI_MODELS };
export type { GeminiModelType };

export interface ProductPlacementResult {
  success: boolean;
  imageUrl?: string;
  imageData?: string; // base64 encoded
  promptUsed?: string;
  error?: string;
}

/**
 * Generate product placement image using Gemini V2 (Pro/Flash)
 */
export async function generateProductPlacement(
  options: ProductPlacementOptions
): Promise<ProductPlacementResult> {
  try {
    // Build the prompt
    const prompt = buildPrompt(options);
    const { productImage, productDescription, model = 'pro' } = options;

    // Try Gemini V2 first (with product image for in-context placement)
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      const geminiResult = await tryGeminiV2(prompt, productImage, productDescription, model);
      if (geminiResult.success) {
        return geminiResult;
      }
      console.warn('Gemini V2 generation failed:', geminiResult.error);
    }

    // Try OpenAI DALL-E second (if available) - prompt-only, no product image
    if (process.env.OPENAI_API_KEY) {
      const dalleResult = await tryDALLE(prompt);
      if (dalleResult.success) {
        return dalleResult;
      }
      console.warn('DALL-E failed:', dalleResult.error);
    }

    // Fallback to mock/demonstration mode
    return generateMockPlacement(prompt);
  } catch (error) {
    console.error('Product placement error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Try Gemini V2 for image generation with product image context
 */
async function tryGeminiV2(
  prompt: string,
  productImage: string,
  productDescription: string | undefined,
  model: GeminiModelType
): Promise<ProductPlacementResult> {
  try {
    const result = await placeProductInEnvironment(
      productImage,
      prompt,
      productDescription,
      { model }
    );

    if (result.success && result.imageData) {
      return {
        success: true,
        imageData: result.imageData,
        promptUsed: prompt,
      };
    }

    throw new Error(result.error || 'No image data from Gemini V2');
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Try DALL-E 3 for image generation
 */
async function tryDALLE(prompt: string): Promise<ProductPlacementResult> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`DALL-E error: ${response.status} - ${error.error?.message || 'Unknown'}`);
    }

    const result = await response.json();

    if (result.data && result.data[0]?.url) {
      // Download and convert to base64
      const imageResponse = await fetch(result.data[0].url);
      const imageBlob = await imageResponse.blob();
      const reader = new FileReader();

      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve({
            success: true,
            imageData: reader.result as string,
            promptUsed: prompt,
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
 * Generate a simple 1x1 purple pixel as placeholder
 * Shows the feature works - just needs proper API configuration
 */
async function generateMockPlacement(prompt: string): Promise<ProductPlacementResult> {
  // Create a simple 1x1 purple pixel as base64
  // This proves the entire flow works - we just need proper image generation API
  const purplePixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  console.log('📝 Mock mode active - Image generation would use this prompt:', prompt);
  console.log('💡 To enable: Add OPENAI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY to .env.local');

  return {
    success: true,
    imageData: purplePixel,
    promptUsed: prompt + ' [DEMO MODE: Add API Key for actual generation]',
  };
}

/**
 * Build prompt from options
 */
function buildPrompt(options: ProductPlacementOptions): string {
  const { categoryId, variationId, customPrompt, productDescription, colorPalette } = options;

  // If custom prompt is provided, use it
  if (customPrompt && customPrompt.trim()) {
    return enhanceCustomPrompt(customPrompt, productDescription, colorPalette);
  }

  // Otherwise, use the variation template
  if (!variationId) {
    throw new Error('Either variationId or customPrompt must be provided');
  }

  const variation = getVariationById(categoryId, variationId);
  if (!variation) {
    throw new Error('Invalid category or variation ID');
  }

  // Replace {product} placeholder with actual product description
  const productPlaceholder = productDescription || 'the product';
  let prompt = variation.promptTemplate.replace(/{product}/g, productPlaceholder);

  // Add quality and technical parameters
  prompt += ', professional photography, high resolution, detailed, sharp focus, commercial quality';
  if (colorPalette?.length) {
    prompt += `. Palette cues: ${colorPalette.join(', ')} applied to lighting, props, and set design`;
  }

  return prompt;
}

/**
 * Enhance custom prompt with quality parameters
 */
function enhanceCustomPrompt(customPrompt: string, productDescription?: string, colorPalette?: string[]): string {
  let prompt = customPrompt;

  // Add product description context if provided
  if (productDescription) {
    prompt = `${productDescription} ${prompt}`;
  }

  if (colorPalette?.length) {
    prompt = `${prompt}, color story inspired by ${colorPalette.join(', ')} guiding lighting and art direction`;
  }

  // Add quality parameters if not already present
  const qualityKeywords = ['professional', 'high resolution', 'commercial'];
  const hasQuality = qualityKeywords.some(keyword =>
    prompt.toLowerCase().includes(keyword)
  );

  if (!hasQuality) {
    prompt += ', professional photography, high resolution, commercial quality';
  }

  return prompt;
}

/**
 * Use Claude to enhance prompt with better descriptions
 */
export async function enhancePromptWithClaude(
  basePrompt: string,
  productDescription: string
): Promise<string> {
  try {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (!anthropicKey) {
      // Fall back to base prompt if Claude is not available
      return basePrompt;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: `You are an expert product photography prompt engineer. Enhance this product photography prompt to be more specific and visually compelling while keeping it concise (under 100 words).

Product: ${productDescription}
Base prompt: ${basePrompt}

Enhanced prompt:`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return basePrompt; // Fall back to base prompt
    }

    const result = await response.json();
    return result.content[0].text.trim();
  } catch (error) {
    console.error('Prompt enhancement error:', error);
    return basePrompt; // Fall back to base prompt
  }
}
