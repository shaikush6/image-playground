/**
 * Gemini Image Service - Legacy wrapper for Color Path
 *
 * This service now delegates to GeminiV2 for actual image generation.
 * Maintains backward compatibility with existing API.
 */

import {
  generateImage as generateImageV2,
  generateImageForDomain as generateImageForDomainV2,
  GEMINI_MODELS,
} from './geminiV2';
import type { GeminiModelType } from './geminiV2';

// Re-export for consumers
export { GEMINI_MODELS };
export type { GeminiModelType };

export interface ImageGenerationOptions {
  prompt: string;
  aspectRatio?: '1:1' | '16:9' | '9:16';
  style?: 'photorealistic' | 'artistic' | 'minimal' | 'vibrant';
  model?: GeminiModelType; // 'flash' or 'pro'
}

export class GeminiImageService {
  static async generateImage(options: ImageGenerationOptions): Promise<string | null> {
    try {
      const { prompt, aspectRatio = '1:1', style = 'photorealistic', model = 'flash' } = options;

      // Enhance the prompt with style and quality directives
      const enhancedPrompt = `${prompt}.

Style: ${style}, high quality, detailed, professional composition.
Aspect ratio: ${aspectRatio}.
NO text, watermarks, or logos in the image.
Ensure colors are vibrant and true to the description.`;

      const result = await generateImageV2(enhancedPrompt, { model });

      if (result.success && result.imageData) {
        return result.imageData;
      }

      console.error('Gemini generation failed:', result.error);
      return null;
    } catch (error) {
      console.error('Error generating image with Gemini:', error);
      return null;
    }
  }

  static async generateImageForDomain(
    domain: string,
    prompt: string,
    palette: Array<{ hex: string; name: string; suggested_role: string }>,
    imageAngle: string,
    aspectRatio: '1:1' | '16:9' | '9:16' = '1:1',
    model: GeminiModelType = 'flash'
  ): Promise<string | null> {
    try {
      const result = await generateImageForDomainV2(
        domain,
        prompt,
        palette,
        imageAngle,
        aspectRatio,
        { model }
      );

      if (result.success && result.imageData) {
        return result.imageData;
      }

      console.error('Gemini domain generation failed:', result.error);
      return null;
    } catch (error) {
      console.error('Error generating domain image with Gemini:', error);
      return null;
    }
  }
}