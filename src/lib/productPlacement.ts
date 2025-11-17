/**
 * Product Placement Service
 *
 * Handles product placement in environments using Google Imagen 3
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getVariationById } from '@/config/environments';

export interface ProductPlacementOptions {
  productImage: string; // base64 encoded image with background removed
  categoryId: string;
  variationId?: string;
  customPrompt?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:5' | '2:3' | '3:2' | '21:9' | '4:3';
  productDescription?: string; // Optional description of the product
}

export interface ProductPlacementResult {
  success: boolean;
  imageUrl?: string;
  imageData?: string; // base64 encoded
  promptUsed?: string;
  error?: string;
}

/**
 * Generate product placement image using Google Imagen 3
 */
export async function generateProductPlacement(
  options: ProductPlacementOptions
): Promise<ProductPlacementResult> {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      throw new Error('Google Generative AI API key not configured');
    }

    // Build the prompt
    const prompt = buildPrompt(options);

    // Initialize Google GenAI
    const genAI = new GoogleGenerativeAI(apiKey);

    // Note: As of Nov 2025, we'll use Gemini's vision capabilities
    // to generate prompts and then use Imagen 3 for generation
    // This is a placeholder for the actual Imagen 3 API integration

    // For now, we'll use a hypothetical Imagen 3 API structure
    // In production, this would be the actual Google Imagen 3 API call

    // Simulated API call structure:
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/imagen-3:generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        num_outputs: 1,
        aspect_ratio: options.aspectRatio || '1:1',
        mode: 'product-image',
        product_image: options.productImage,
        negative_prompt: 'low quality, blurry, distorted, deformed, bad composition, poor lighting',
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      imageUrl: result.images?.[0]?.url,
      imageData: result.images?.[0]?.data,
      promptUsed: prompt,
    };
  } catch (error) {
    console.error('Product placement error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Build prompt from options
 */
function buildPrompt(options: ProductPlacementOptions): string {
  const { categoryId, variationId, customPrompt, productDescription } = options;

  // If custom prompt is provided, use it
  if (customPrompt && customPrompt.trim()) {
    return enhanceCustomPrompt(customPrompt, productDescription);
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

  return prompt;
}

/**
 * Enhance custom prompt with quality parameters
 */
function enhanceCustomPrompt(customPrompt: string, productDescription?: string): string {
  let prompt = customPrompt;

  // Add product description context if provided
  if (productDescription) {
    prompt = `${productDescription} ${prompt}`;
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
