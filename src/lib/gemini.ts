import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ImageGenerationOptions {
  prompt: string;
  aspectRatio?: '1:1' | '16:9' | '9:16';
  style?: 'photorealistic' | 'artistic' | 'minimal' | 'vibrant';
}

export class GeminiImageService {
  static async generateImage(options: ImageGenerationOptions): Promise<string | null> {
    try {
      if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        throw new Error('Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable');
      }

      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

      // Using Gemini 2.5 Flash Image model (Nano Banana)
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash-image-preview'
      });

      const { prompt, aspectRatio = '1:1', style = 'photorealistic' } = options;

      // Enhance the prompt with style and quality directives
      const enhancedPrompt = `${prompt}. 
      
Style: ${style}, high quality, detailed, professional composition.
Aspect ratio: ${aspectRatio}.
NO text, watermarks, or logos in the image.
Ensure colors are vibrant and true to the description.`;

      console.log('🎨 Generating image with Gemini (Nano Banana):', enhancedPrompt.substring(0, 100) + '...');

      const result = await model.generateContent([enhancedPrompt]);
      const response = await result.response;
      
      // Check if the response contains image data
      if (response.candidates && response.candidates[0]?.content?.parts) {
        const imagePart = response.candidates[0].content.parts.find(
          part => 'inlineData' in part && part.inlineData?.mimeType?.startsWith('image/')
        );
        
        if (imagePart && 'inlineData' in imagePart && imagePart.inlineData?.data) {
          // Convert base64 data to a data URL
          const mimeType = imagePart.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${imagePart.inlineData.data}`;
        }
      }

      console.error('No image data found in Gemini response');
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
    aspectRatio: '1:1' | '16:9' | '9:16' = '1:1'
  ): Promise<string | null> {
    const paletteColors = palette.map(p => p.name).join(', ');
    const dominantColor = palette.find(p => p.suggested_role.includes('Dominant'))?.name || palette[0]?.name;
    const accentColor = palette.find(p => p.suggested_role.includes('Accent') || p.suggested_role.includes('Highlight'))?.name || palette[palette.length - 1]?.name;

    let domainSpecificPrompt = '';
    let style: 'photorealistic' | 'artistic' | 'minimal' | 'vibrant' = 'photorealistic';

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
        }
        break;

      default:
        domainSpecificPrompt = `Creative visualization of ${prompt} using color palette: ${paletteColors}. Professional, high-quality composition.`;
    }

    return await this.generateImage({
      prompt: domainSpecificPrompt,
      aspectRatio,
      style
    });
  }
}