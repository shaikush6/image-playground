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
 * Remove background from image with cascading fallbacks
 * 1. WithoutBG API (primary)
 * 2. OpenAI DALL-E (fallback 1)
 * 3. Google Gemini Nano (fallback 2)
 */
export async function removeBackground(
  imageFile: File | string,
  options?: {
    format?: 'png' | 'jpg';
    size?: 'preview' | 'medium' | 'full';
  }
): Promise<BackgroundRemovalResult> {
  // Convert image to base64 or get data URL
  let imageData: string;
  if (imageFile instanceof File) {
    imageData = await fileToBase64(imageFile);
  } else {
    imageData = imageFile;
  }

  // Remove data URL prefix if present to get pure base64
  const base64Image = imageData.includes('base64,')
    ? imageData.split('base64,')[1]
    : imageData;

  // Try WithoutBG first
  const withoutBgResult = await tryWithoutBG(base64Image, options);
  if (withoutBgResult.success) {
    console.log('✓ Background removed using WithoutBG');
    return withoutBgResult;
  }
  console.warn('✗ WithoutBG failed:', withoutBgResult.error);

  // Fallback to OpenAI
  const openAIResult = await tryOpenAI(imageData);
  if (openAIResult.success) {
    console.log('✓ Background removed using OpenAI');
    return openAIResult;
  }
  console.warn('✗ OpenAI failed:', openAIResult.error);

  // Fallback to Google Gemini (Nano Banana)
  const geminiResult = await tryGeminiNano(imageData);
  if (geminiResult.success) {
    console.log('✓ Background removed using Gemini Nano');
    return geminiResult;
  }
  console.warn('✗ Gemini Nano failed:', geminiResult.error);

  // All failed
  return {
    success: false,
    error: 'All background removal services failed. Please try a different image.',
  };
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
 * Try Google Gemini with vision (Nano Banana fallback)
 */
async function tryGeminiNano(imageDataUrl: string): Promise<BackgroundRemovalResult> {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('Google API key not configured');
    }

    // Use Gemini's vision capabilities to identify the object
    // then use image generation to create it without background
    const base64Image = imageDataUrl.split('base64,')[1] || imageDataUrl;

    // Step 1: Analyze image with Gemini Flash
    const analyzeResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: 'Describe the main object/subject in this image in detail for product photography. Focus on what the object is, its appearance, colors, and key features. Be concise but descriptive.' },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64Image
                }
              }
            ]
          }]
        }),
      }
    );

    if (!analyzeResponse.ok) {
      throw new Error(`Gemini analysis error: ${analyzeResponse.status}`);
    }

    const analysisResult = await analyzeResponse.json();
    const objectDescription = analysisResult.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!objectDescription) {
      throw new Error('Could not analyze image');
    }

    // Step 2: Generate image without background using Imagen
    const prompt = `${objectDescription}, isolated on pure white background, product photography, professional lighting, high quality, no background, PNG transparent`;

    const generateResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{
            prompt: prompt,
            reference_image: base64Image,
            reference_image_config: {
              reference_type: 'STYLE_IMAGE_REFERENCE_TYPE_UNSPECIFIED'
            }
          }],
          parameters: {
            sampleCount: 1,
            aspectRatio: '1:1',
            negativePrompt: 'background, scenery, context',
          }
        }),
      }
    );

    if (!generateResponse.ok) {
      throw new Error(`Gemini generation error: ${generateResponse.status}`);
    }

    const generateResult = await generateResponse.json();

    if (generateResult.predictions?.[0]?.bytesBase64Encoded) {
      const imageBase64 = generateResult.predictions[0].bytesBase64Encoded;
      return {
        success: true,
        imageData: `data:image/png;base64,${imageBase64}`,
      };
    }

    throw new Error('No image generated');
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
