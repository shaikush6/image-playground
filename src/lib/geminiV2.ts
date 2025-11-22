/**
 * Gemini V2 Service - Unified Image Generation with Chat API
 *
 * Uses the new @google/genai package with chat-based API
 * Supports model toggle between flash (nano banana) and pro (nano banana 2) versions
 */

import { GoogleGenAI } from '@google/genai';

// Model configurations - nano banana (flash) and nano banana 2 (pro)
export const GEMINI_MODELS: Record<'flash' | 'pro', string> = {
  flash: 'gemini-2.5-flash-image',
  pro: 'gemini-3-pro-image-preview',
};

// Simple union type for model selection
export type GeminiModelType = 'flash' | 'pro';

export interface GeminiV2Options {
  model?: GeminiModelType;
  enableGoogleSearch?: boolean;
}

export interface ImageGenerationResult {
  success: boolean;
  imageData?: string; // base64 data URL
  textResponse?: string;
  error?: string;
  modelUsed?: string;
}

/**
 * Create a Gemini AI client
 */
function getClient(): GoogleGenAI {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable');
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Generate an image using Gemini's chat API
 */
export async function generateImage(
  prompt: string,
  options: GeminiV2Options = {}
): Promise<ImageGenerationResult> {
  const { model = 'flash', enableGoogleSearch = false } = options;
  const modelId = GEMINI_MODELS[model];

  try {
    const ai = getClient();

    // Configure tools based on options
    const tools: Array<{ googleSearch: Record<string, never> }> = [];
    if (enableGoogleSearch) {
      tools.push({ googleSearch: {} });
    }

    const chat = ai.chats.create({
      model: modelId,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        ...(tools.length > 0 && { tools }),
      },
    });

    console.log(`🎨 Generating image with Gemini ${model} (${modelId}):`, prompt.substring(0, 100) + '...');

    const response = await chat.sendMessage({ message: prompt });

    // Process response parts
    let textResponse: string | undefined;
    let imageData: string | undefined;

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if ('text' in part && part.text) {
          textResponse = part.text;
        } else if ('inlineData' in part && part.inlineData) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          imageData = `data:${mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    if (imageData) {
      return {
        success: true,
        imageData,
        textResponse,
        modelUsed: modelId,
      };
    }

    return {
      success: false,
      textResponse,
      error: 'No image data in response',
      modelUsed: modelId,
    };
  } catch (error) {
    console.error(`Gemini ${model} generation error:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      modelUsed: modelId,
    };
  }
}

/**
 * Remove background from an image using Gemini Pro
 * Uses prompt-based approach to extract the subject
 */
export async function removeBackgroundWithGemini(
  imageData: string,
  productDescription?: string,
  options: GeminiV2Options = {}
): Promise<ImageGenerationResult> {
  const { model = 'pro' } = options; // Default to pro for better quality
  const modelId = GEMINI_MODELS[model];

  try {
    const ai = getClient();

    const chat = ai.chats.create({
      model: modelId,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    // Extract base64 data from data URL if needed
    const base64Data = imageData.includes('base64,')
      ? imageData.split('base64,')[1]
      : imageData;

    // Detect mime type
    let mimeType = 'image/jpeg';
    if (imageData.startsWith('data:')) {
      const match = imageData.match(/data:([^;]+);/);
      if (match) mimeType = match[1];
    }

    const productContext = productDescription
      ? `The product is: ${productDescription}. `
      : '';

    const prompt = `${productContext}Please isolate the main product/subject from this image and place it on a pure transparent background. Remove all background elements completely. Keep only the product with clean edges suitable for e-commerce use. Output the isolated product image.`;

    console.log(`🔧 Removing background with Gemini ${model}...`);

    // Send message with image
    const response = await chat.sendMessage({
      message: [
        { text: prompt },
        {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        },
      ],
    });

    // Process response
    let resultImage: string | undefined;
    let textResponse: string | undefined;

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if ('text' in part && part.text) {
          textResponse = part.text;
        } else if ('inlineData' in part && part.inlineData) {
          const outputMimeType = part.inlineData.mimeType || 'image/png';
          resultImage = `data:${outputMimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    if (resultImage) {
      return {
        success: true,
        imageData: resultImage,
        textResponse,
        modelUsed: modelId,
      };
    }

    return {
      success: false,
      textResponse,
      error: 'No image returned from background removal',
      modelUsed: modelId,
    };
  } catch (error) {
    console.error(`Gemini background removal error:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      modelUsed: modelId,
    };
  }
}

/**
 * Place a product in an environment using Gemini
 */
export async function placeProductInEnvironment(
  productImage: string,
  environmentPrompt: string,
  productDescription?: string,
  options: GeminiV2Options = {}
): Promise<ImageGenerationResult> {
  const { model = 'pro' } = options;
  const modelId = GEMINI_MODELS[model];

  try {
    const ai = getClient();

    const chat = ai.chats.create({
      model: modelId,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    // Extract base64 data
    const base64Data = productImage.includes('base64,')
      ? productImage.split('base64,')[1]
      : productImage;

    let mimeType = 'image/png';
    if (productImage.startsWith('data:')) {
      const match = productImage.match(/data:([^;]+);/);
      if (match) mimeType = match[1];
    }

    const productContext = productDescription
      ? `Product: ${productDescription}. `
      : 'Product shown in the image. ';

    const prompt = `${productContext}Take this product and place it naturally in the following environment/scene: ${environmentPrompt}.

Create a professional product photography shot where the product is seamlessly integrated into the scene with realistic lighting, shadows, and reflections that match the environment. The product should be the hero of the image while the environment provides context and appeal.

Generate a high-quality, commercial-grade product placement image.`;

    console.log(`🎯 Placing product in environment with Gemini ${model}...`);

    const response = await chat.sendMessage({
      message: [
        { text: prompt },
        {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        },
      ],
    });

    // Process response
    let resultImage: string | undefined;
    let textResponse: string | undefined;

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if ('text' in part && part.text) {
          textResponse = part.text;
        } else if ('inlineData' in part && part.inlineData) {
          const outputMimeType = part.inlineData.mimeType || 'image/png';
          resultImage = `data:${outputMimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    if (resultImage) {
      return {
        success: true,
        imageData: resultImage,
        textResponse,
        modelUsed: modelId,
      };
    }

    return {
      success: false,
      textResponse,
      error: 'No image returned from product placement',
      modelUsed: modelId,
    };
  } catch (error) {
    console.error(`Gemini product placement error:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      modelUsed: modelId,
    };
  }
}

/**
 * Generate image for a specific domain with palette integration
 */
export async function generateImageForDomain(
  domain: string,
  prompt: string,
  palette: Array<{ hex: string; name: string; suggested_role: string }>,
  imageAngle: string,
  aspectRatio: '1:1' | '16:9' | '9:16' = '1:1',
  options: GeminiV2Options = {}
): Promise<ImageGenerationResult> {
  const paletteColors = palette.map(p => p.name).join(', ');
  const dominantColor = palette.find(p => p.suggested_role.includes('Dominant'))?.name || palette[0]?.name;
  const accentColor = palette.find(p => p.suggested_role.includes('Accent') || p.suggested_role.includes('Highlight'))?.name || palette[palette.length - 1]?.name;

  let domainSpecificPrompt = '';
  let style: 'photorealistic' | 'artistic' | 'minimal' | 'vibrant' = 'photorealistic';

  // Domain-specific prompt building (same logic as original gemini.ts)
  switch (domain) {
    case '🍽️ Cooking':
      style = 'photorealistic';
      switch (imageAngle) {
        case 'Dish Plated':
          domainSpecificPrompt = `Professional food photography of ${prompt}. Beautiful plating on elegant dishware. Colors emphasizing ${dominantColor} tones with ${accentColor} accents. Cinematic lighting, shallow depth of field, appetizing presentation.`;
          break;
        case 'Artistic Ingredients':
          domainSpecificPrompt = `Artistic flat lay arrangement of ingredients for ${prompt}. Clean background, beautiful composition using colors from palette: ${paletteColors}. High-end food styling.`;
          break;
        case 'Cooking Process':
          domainSpecificPrompt = `Dynamic cooking action shot preparing ${prompt}. Professional kitchen setting, steam and movement, colors inspired by ${paletteColors}. Realistic cooking photography.`;
          break;
        case 'Concept Sketch':
          style = 'artistic';
          domainSpecificPrompt = `Beautiful culinary illustration concept sketch of ${prompt}. Watercolor and ink style, showing plating and presentation. Color palette: ${paletteColors}.`;
          break;
        default:
          domainSpecificPrompt = `Professional food photography of ${prompt} using colors: ${paletteColors}.`;
      }
      break;

    case '👗 Fashion':
      style = 'photorealistic';
      switch (imageAngle) {
        case 'Full Outfit Look':
          domainSpecificPrompt = `High fashion photography of complete outfit inspired by ${prompt}. Model wearing coordinated pieces in colors: ${paletteColors}. Professional fashion photography, clean background.`;
          break;
        case 'Flat Lay Styling':
          domainSpecificPrompt = `Luxury fashion flat lay styling of ${prompt}. Arranged on marble surface, using color palette: ${paletteColors}. High-end fashion photography style.`;
          break;
        case 'Fabric/Detail Focus':
          domainSpecificPrompt = `Close-up detailed shot of fabric textures and details from ${prompt}. Emphasizing ${dominantColor} with ${accentColor} details. Macro fashion photography.`;
          break;
        case 'Fashion Illustration':
          style = 'artistic';
          domainSpecificPrompt = `Elegant fashion illustration of ${prompt}. Watercolor and ink style, featuring colors: ${paletteColors}. Modern fashion sketch aesthetic.`;
          break;
        default:
          domainSpecificPrompt = `High fashion photography of ${prompt} using colors: ${paletteColors}.`;
      }
      break;

    case '🛋️ Interior Design':
      style = 'photorealistic';
      switch (imageAngle) {
        case 'Room Perspective View':
          domainSpecificPrompt = `Stunning interior design photography of ${prompt}. Wide angle room view showcasing color scheme: ${paletteColors}. Professional architectural photography, natural lighting.`;
          break;
        case 'Mood Board / Style Tile':
          style = 'artistic';
          domainSpecificPrompt = `Interior design mood board for ${prompt}. Collage style showing materials, textures, and colors: ${paletteColors}. Design presentation style.`;
          break;
        case 'Color Vignette':
          domainSpecificPrompt = `Detailed interior vignette showcasing ${prompt}. Focus on color harmony using ${paletteColors}. Cozy corner or styled surface, lifestyle photography.`;
          break;
        case 'Blueprint/Sketch with Color':
          style = 'artistic';
          domainSpecificPrompt = `Architectural sketch with color wash of ${prompt}. Technical drawing style with watercolor accents in ${paletteColors}. Design presentation aesthetic.`;
          break;
        default:
          domainSpecificPrompt = `Interior design photography of ${prompt} using colors: ${paletteColors}.`;
      }
      break;

    case '🎨 Art/Craft':
      style = 'artistic';
      switch (imageAngle) {
        case 'Finished Artwork':
          domainSpecificPrompt = `Completed artwork inspired by ${prompt}. Fine art piece featuring color palette: ${paletteColors}. Gallery lighting, artistic composition.`;
          break;
        case 'Studio Context':
          style = 'photorealistic';
          domainSpecificPrompt = `Artist studio scene with ${prompt} in progress. Creative workspace with art supplies, natural lighting, colors: ${paletteColors}.`;
          break;
        case 'Material/Texture Focus':
          style = 'photorealistic';
          domainSpecificPrompt = `Close-up macro shot of art materials and textures for ${prompt}. Paint, brushes, canvas textures in colors: ${paletteColors}.`;
          break;
        case 'Concept Sketchbook':
          domainSpecificPrompt = `Open sketchbook showing concept drawings for ${prompt}. Hand-drawn sketches with color notes, featuring palette: ${paletteColors}.`;
          break;
        default:
          domainSpecificPrompt = `Artistic creation of ${prompt} using colors: ${paletteColors}.`;
      }
      break;

    case '💄 Makeup':
      style = 'photorealistic';
      switch (imageAngle) {
        case 'Close-up Beauty Shot':
          domainSpecificPrompt = `Professional beauty photography close-up of ${prompt}. Flawless makeup featuring colors: ${paletteColors}. Studio lighting, high detail.`;
          break;
        case 'Full Face Look':
          domainSpecificPrompt = `Full face beauty portrait showcasing ${prompt}. Complete makeup look using color palette: ${paletteColors}. Professional beauty photography.`;
          break;
        case 'Product Swatch Art':
          style = 'artistic';
          domainSpecificPrompt = `Artistic makeup product swatches and color story for ${prompt}. Beautiful arrangement on marble surface, colors: ${paletteColors}.`;
          break;
        case 'Makeup Chart/Illustration':
          style = 'artistic';
          domainSpecificPrompt = `Professional makeup chart illustration for ${prompt}. Beauty diagram style showing color placement, palette: ${paletteColors}.`;
          break;
        default:
          domainSpecificPrompt = `Beauty photography of ${prompt} using colors: ${paletteColors}.`;
      }
      break;

    case '🎉 Event Theme':
      style = 'photorealistic';
      switch (imageAngle) {
        case 'Table Setting Detail':
          domainSpecificPrompt = `Elegant table setting detail for ${prompt}. Luxury event styling using color scheme: ${paletteColors}. Professional event photography.`;
          break;
        case 'Overall Venue Atmosphere':
          domainSpecificPrompt = `Wide shot of event venue decorated for ${prompt}. Atmospheric lighting, full decoration scheme in colors: ${paletteColors}. Event photography.`;
          break;
        case 'Decor Vignette':
          domainSpecificPrompt = `Beautiful decorative vignette for ${prompt}. Styled detail shot featuring color palette: ${paletteColors}. Event styling photography.`;
          break;
        case 'Invitation Suite Mockup':
          domainSpecificPrompt = `Luxury invitation suite mockup for ${prompt}. Flat lay of stationery and decor elements, colors: ${paletteColors}. High-end design photography.`;
          break;
        default:
          domainSpecificPrompt = `Event styling photography of ${prompt} using colors: ${paletteColors}.`;
      }
      break;

    case '🌐 Graphic/Web Design':
      style = 'minimal';
      switch (imageAngle) {
        case 'UI Mockup (Website/App)':
          domainSpecificPrompt = `Modern website/app UI mockup for ${prompt}. Clean interface design using color palette: ${paletteColors}. Contemporary web design, minimal aesthetic.`;
          break;
        case 'Brand Application Mockup':
          domainSpecificPrompt = `Brand identity mockup showing ${prompt}. Logo applications on various materials, color scheme: ${paletteColors}. Professional branding presentation.`;
          break;
        case 'Abstract Color Background':
          style = 'artistic';
          domainSpecificPrompt = `Abstract geometric background design for ${prompt}. Modern gradient and shape composition using colors: ${paletteColors}. Digital art style.`;
          break;
        case 'Style Guide Snippet':
          domainSpecificPrompt = `Brand style guide page showing ${prompt}. Typography, colors, and design elements featuring palette: ${paletteColors}. Design documentation style.`;
          break;
        default:
          domainSpecificPrompt = `Graphic design mockup of ${prompt} using colors: ${paletteColors}.`;
      }
      break;

    default:
      domainSpecificPrompt = `Creative visualization of ${prompt} using color palette: ${paletteColors}. Professional, high-quality composition.`;
  }

  // Add style and quality directives
  const enhancedPrompt = `${domainSpecificPrompt}

Style: ${style}, high quality, detailed, professional composition.
Aspect ratio: ${aspectRatio}.
NO text, watermarks, or logos in the image.
Ensure colors are vibrant and true to the description.`;

  return generateImage(enhancedPrompt, options);
}
