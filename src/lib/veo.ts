import type {
  GenerateVideosConfig,
  GenerateVideosOperation,
  GenerateVideosParameters,
  Video,
} from '@google/genai';
import type { PaletteEntry } from './anthropic';
import type { CreativeCustomizations } from './agents';

type VideoGenerationOptions = {
  aspectRatio?: '9:16' | '16:9' | '1:1';
  resolution?: '720p' | '1080p';
  duration?: 'short' | 'medium' | 'long';
  style?: 'cinematic' | 'artistic' | 'social' | 'professional';
};

type VeoClient = {
  models: {
    generateVideos: (params: GenerateVideosParameters) => Promise<GenerateVideosOperation>;
  };
  operations: {
    getVideosOperation: (params: { operation: GenerateVideosOperation }) => Promise<GenerateVideosOperation>;
  };
};

// Veo 3 Video Generation Service
export class VeoVideoService {
  private static client: VeoClient | null = null;

  static async initializeClient(): Promise<VeoClient> {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error('Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable');
    }

    if (!this.client) {
      // Dynamic import to avoid issues with server-side rendering
      const { GoogleGenAI } = await import('@google/genai');
      this.client = new GoogleGenAI({
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
      }) as VeoClient;
    }
    
    return this.client;
  }

  static async generateVideo(
    prompt: string,
    options: VideoGenerationOptions = {}
  ): Promise<string | null> {
    try {
      const client = await this.initializeClient();
      // Build enhanced prompt with technical specifications
      const enhancedPrompt = this.buildEnhancedPrompt(prompt, options);
      const negativePrompt = this.buildNegativePrompt(options.style || 'cinematic');
      const modelName = process.env.GOOGLE_VEO_VIDEO_MODEL || 'veo-2.0-generate-001';
      const config = this.buildVideoConfig(options, negativePrompt);
      
      console.log('🎬 Generating video with Veo:', enhancedPrompt.substring(0, 100) + '...');

      const operation = await client.models.generateVideos({
        model: modelName,
        source: {
          prompt: enhancedPrompt
        },
        config
      });
      const completedOperation = await this.pollForVideo(client, operation);
      const videoData = completedOperation.response?.generatedVideos?.[0]?.video;

      if (!videoData) {
        console.warn('No video returned from Veo generation');
        return null;
      }

      return this.normalizeVideoUrl(videoData);
    } catch (error) {
      console.error('Error generating video:', error);
      throw error;
    }
  }

  private static buildVideoConfig(options: VideoGenerationOptions, negativePrompt: string): GenerateVideosConfig {
    const aspectRatio = options.aspectRatio || '9:16';
    const durationSeconds = this.mapDurationToSeconds(options.duration || 'short');

    return {
      numberOfVideos: 1,
      aspectRatio,
      durationSeconds,
      negativePrompt
    };
  }

  private static async pollForVideo(
    client: VeoClient,
    operation: GenerateVideosOperation,
    timeoutMs = 240000,
    pollIntervalMs = 5000
  ): Promise<GenerateVideosOperation> {
    let currentOperation = operation;
    const start = Date.now();

    while (!currentOperation.done) {
      if (Date.now() - start > timeoutMs) {
        throw new Error('Video generation timed out');
      }

      await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
      currentOperation = await client.operations.getVideosOperation({ operation: currentOperation });
    }

    if (currentOperation.error) {
      throw new Error(`Video generation failed: ${JSON.stringify(currentOperation.error)}`);
    }

    return currentOperation;
  }

  private static mapDurationToSeconds(duration: VideoGenerationOptions['duration']): number {
    switch (duration) {
      case 'medium':
        return 6;
      case 'long':
        return 8;
      case 'short':
      default:
        return 5;
    }
  }

  static buildEnhancedPrompt(basePrompt: string, options: VideoGenerationOptions): string {
    const aspectRatio = options.aspectRatio || '9:16';
    const style = options.style || 'cinematic';
    
    let prefix = `VERTICAL ${aspectRatio} aspect ratio, portrait composition. `;
    
    switch (style) {
      case 'cinematic':
        prefix += 'Professional cinematic photography style, dramatic lighting, shallow depth of field. ';
        break;
      case 'artistic':
        prefix += 'Artistic visual style, creative composition, enhanced colors and textures. ';
        break;
      case 'social':
        prefix += 'Social media optimized, engaging visual style, trending aesthetics. ';
        break;
      case 'professional':
        prefix += 'Professional commercial style, clean composition, product photography quality. ';
        break;
    }

    // Duration specifications
    const duration = options.duration || 'short';
    let durationText = '';
    switch (duration) {
      case 'short':
        durationText = 'EXACTLY 5 SECONDS LONG. BRIEF DURATION. SHORT VIDEO CLIP. ';
        break;
      case 'medium':
        durationText = 'EXACTLY 6 SECONDS LONG. MEDIUM DURATION. ';
        break;
      case 'long':
        durationText = 'EXACTLY 8 SECONDS LONG. LONGER DURATION. ';
        break;
    }

    const suffix = 'No text overlay, no subtitles, no watermarks. High quality, smooth motion.';

    return `${prefix}${basePrompt} ${durationText}${suffix}`;
  }

  private static normalizeVideoUrl(video: Video): string | null {
    if (video.videoBytes) {
      const mimeType = video.mimeType || 'video/mp4';
      return `data:${mimeType};base64,${video.videoBytes}`;
    }

    if (video.uri) {
      const fileIdMatch = video.uri.match(/files\/([^:]+):/);
      if (fileIdMatch?.[1]) {
        return `/api/video/${fileIdMatch[1]}`;
      }
      return video.uri;
    }

    console.warn('Video response did not include uri or bytes');
    return null;
  }

  static buildNegativePrompt(style: string): string {
    const baseNegative = 'low quality, blurry, distorted, pixelated, artifacts, glitches, flickering, unstable motion, poor lighting, overexposed, underexposed, noisy, grainy, compressed, watermarks, logos, text overlay, subtitles';
    
    switch (style) {
      case 'cinematic':
        return `${baseNegative}, amateur, handheld camera shake, poor framing, bad composition`;
      case 'artistic':
        return `${baseNegative}, generic, boring, lifeless, flat colors, mundane`;
      case 'social':
        return `${baseNegative}, outdated trends, poor engagement, unprofessional`;
      case 'professional':
        return `${baseNegative}, casual, informal, inconsistent branding, poor production value`;
      default:
        return baseNegative;
    }
  }

  static async generateCreativeVideo(
    domain: string,
    palette: PaletteEntry[],
    customizations: CreativeCustomizations,
    format: 'single' | 'series',
    imageAngle: string,
    aspectRatio: '9:16' | '16:9' | '1:1' = '9:16'
  ): Promise<{ video_url?: string; series_urls?: string[]; ideas: string }> {
    try {
      // Build domain-specific video prompt
      const videoPrompt = this.buildDomainVideoPrompt(domain, palette, customizations, imageAngle);

      if (format === 'single') {
        // Generate single video
        const videoUrl = await this.generateVideo(videoPrompt, {
          aspectRatio,
          resolution: '720p',
          duration: 'short',
          style: 'cinematic'
        });

        return {
          video_url: videoUrl || undefined,
          ideas: videoPrompt
        };
      } else {
        // Generate video series (5-part sequence like culinary system)
        const seriesPrompts = this.buildSeriesPrompts(domain, palette, customizations);
        const seriesUrls: string[] = [];

        for (let i = 0; i < seriesPrompts.length; i++) {
          console.log(`🎬 Generating series part ${i + 1}/${seriesPrompts.length}`);
          const videoUrl = await this.generateVideo(seriesPrompts[i], {
            aspectRatio,
            resolution: '720p',
            duration: 'short',
            style: 'cinematic'
          });

          if (videoUrl) {
            seriesUrls.push(videoUrl);
          }
        }

        return {
          series_urls: seriesUrls,
          ideas: seriesPrompts.join('\n\n---\n\n')
        };
      }
    } catch (error) {
      console.error('Error generating creative video:', error);
      return {
        ideas: 'Error generating video content.'
      };
    }
  }

  static buildDomainVideoPrompt(
    domain: string,
    palette: PaletteEntry[],
    customizations: CreativeCustomizations,
    imageAngle: string
  ): string {
    const paletteColors = palette.map(p => p.name).join(', ');
    const dominantColor = palette.find(p => p.suggested_role.includes('Dominant'))?.name || palette[0]?.name;
    const accentColor = palette.find(p => p.suggested_role.includes('Accent'))?.name || palette[palette.length - 1]?.name;

    // Build customizations context
    const customizationsText = this.buildCustomizationsContext(domain, customizations);

    switch (domain) {
      case '🍽️ Cooking':
        return this.buildCookingVideoPrompt(paletteColors, dominantColor, accentColor, customizationsText, imageAngle);
      case '👗 Fashion':
        return this.buildFashionVideoPrompt(paletteColors, dominantColor, accentColor, customizationsText, imageAngle);
      case '🛋️ Interior Design':
        return this.buildInteriorVideoPrompt(paletteColors, dominantColor, accentColor, customizationsText, imageAngle);
      case '🎨 Art/Craft':
        return this.buildArtVideoPrompt(paletteColors, dominantColor, accentColor, customizationsText, imageAngle);
      case '💄 Makeup':
        return this.buildMakeupVideoPrompt(paletteColors, dominantColor, accentColor, customizationsText, imageAngle);
      case '🎉 Event Theme':
        return this.buildEventVideoPrompt(paletteColors, dominantColor, accentColor, customizationsText, imageAngle);
      case '🌐 Graphic/Web Design':
        return this.buildDesignVideoPrompt(paletteColors, dominantColor, accentColor, customizationsText, imageAngle);
      default:
        return `Creative concept video featuring colors ${paletteColors}. Professional cinematic style showcasing the beauty and harmony of these colors in a creative context.`;
    }
  }

  static buildCustomizationsContext(domain: string, customizations: CreativeCustomizations): string {
    const parts: string[] = [];

    switch (domain) {
      case '🍽️ Cooking':
        if (customizations.dish_type && customizations.dish_type !== "Chef's choice") {
          parts.push(`Dish: ${customizations.dish_type}`);
        }
        if (customizations.cuisine_style) {
          parts.push(`Style: ${customizations.cuisine_style}`);
        }
        if (customizations.primary_cooking_method && customizations.primary_cooking_method !== "Any") {
          parts.push(`Method: ${customizations.primary_cooking_method}`);
        }
        break;

      case '👗 Fashion':
        if (customizations.style_preference && customizations.style_preference !== "Any") {
          parts.push(`Style: ${customizations.style_preference}`);
        }
        if (customizations.key_garment && customizations.key_garment !== "Any") {
          parts.push(`Garment: ${customizations.key_garment}`);
        }
        break;

      case '🛋️ Interior Design':
        if (customizations.room_type && customizations.room_type !== "Any Room") {
          parts.push(`Room: ${customizations.room_type}`);
        }
        if (customizations.design_style && customizations.design_style !== "Any Style") {
          parts.push(`Style: ${customizations.design_style}`);
        }
        break;

      // Add other domains as needed...
    }

    return parts.join(', ');
  }

  static buildCookingVideoPrompt(colors: string, dominant: string, accent: string, context: string, angle: string): string {
    const contextText = context ? ` ${context}.` : '';
    
    switch (angle) {
      case 'Dish Plated':
        return `Professional culinary video of elegant dish plating.${contextText} Beautiful presentation emphasizing ${dominant} tones with ${accent} accents. Cinematic food styling, dramatic lighting, appetizing close-ups. Colors: ${colors}. Smooth plating motions, artistic arrangement.`;
      case 'Cooking Process':
        return `Dynamic cooking process video.${contextText} Professional kitchen action, sizzling and steam, chef's hands working. Colors inspired by ${colors}, emphasizing ${dominant} and ${accent}. Realistic cooking cinematography.`;
      case 'Artistic Ingredients':
        return `Artistic ingredient arrangement video.${contextText} Fresh ingredients floating and arranging themselves, featuring colors ${colors}. Magical food styling, clean background, professional food photography motion.`;
      default:
        return `Culinary concept video.${contextText} Beautiful food presentation featuring colors ${colors}, emphasizing ${dominant} with ${accent} accents. Professional food cinematography.`;
    }
  }

  static buildFashionVideoPrompt(colors: string, dominant: string, accent: string, context: string, angle: string): string {
    const contextText = context ? ` ${context}.` : '';
    
    switch (angle) {
      case 'Full Outfit Look':
        return `High fashion video showcasing complete outfit.${contextText} Model presenting coordinated pieces in colors ${colors}. Professional fashion cinematography, elegant movement, clean background.`;
      case 'Fabric/Detail Focus':
        return `Close-up fashion detail video.${contextText} Macro shots of fabric textures and details, emphasizing ${dominant} with ${accent} highlights. Luxury fashion cinematography.`;
      default:
        return `Fashion concept video.${contextText} Elegant styling featuring colors ${colors}, professional fashion photography in motion.`;
    }
  }

  static buildInteriorVideoPrompt(colors: string, dominant: string, accent: string, context: string, angle: string): string {
    const contextText = context ? ` ${context}.` : '';
    
    switch (angle) {
      case 'Room Perspective View':
        return `Cinematic interior design walkthrough.${contextText} Wide angle room reveal showcasing color scheme ${colors}. Professional architectural videography, natural lighting, smooth camera movement.`;
      default:
        return `Interior design concept video.${contextText} Beautiful space featuring colors ${colors}, architectural cinematography.`;
    }
  }

  static buildArtVideoPrompt(colors: string, dominant: string, accent: string, context: string, angle: string): string {
    const contextText = context ? ` ${context}.` : '';
    
    switch (angle) {
      case 'Finished Artwork':
        return `Art creation video showcasing finished piece.${contextText} Gallery-quality artwork featuring ${colors}. Artistic cinematography, dramatic lighting, creative composition.`;
      case 'Studio Context':
        return `Artist studio video.${contextText} Creative workspace with art in progress, natural lighting, colors ${colors}. Documentary-style artistic cinematography.`;
      default:
        return `Art concept video.${contextText} Creative artwork featuring colors ${colors}, artistic cinematography.`;
    }
  }

  static buildMakeupVideoPrompt(colors: string, dominant: string, accent: string, context: string, angle: string): string {
    const contextText = context ? ` ${context}.` : '';
    const angleText = angle ? ` Shot focus: ${angle}.` : '';
    
    return `Professional makeup video.${contextText}${angleText} Beautiful makeup application showcasing colors ${colors}, emphasizing ${dominant} with ${accent} accents. Beauty cinematography, perfect lighting.`;
  }

  static buildEventVideoPrompt(colors: string, dominant: string, accent: string, context: string, angle: string): string {
    const contextText = context ? ` ${context}.` : '';
    const angleText = angle ? ` Shot focus: ${angle}.` : '';
    
    return `Event design video.${contextText}${angleText} Beautiful event setup featuring color palette ${colors}. Professional event cinematography, elegant atmosphere.`;
  }

  static buildDesignVideoPrompt(colors: string, dominant: string, accent: string, context: string, angle: string): string {
    const contextText = context ? ` ${context}.` : '';
    const angleText = angle ? ` Shot focus: ${angle}.` : '';
    
    return `Design concept video.${contextText}${angleText} Modern graphic design elements featuring colors ${colors}. Professional motion graphics style, clean composition.`;
  }

  static buildSeriesPrompts(domain: string, palette: PaletteEntry[], customizations: CreativeCustomizations): string[] {
    // Build 5-part series similar to culinary video system
    const colors = palette.map(p => p.name).join(', ');
    const contextText = this.buildCustomizationsContext(domain, customizations);
    const context = contextText ? ` ${contextText}.` : '';

    // Generic 5-part transformation sequence that works for any domain
    return [
      `Part 1: Color palette inspiration.${context} Beautiful display of colors ${colors} in artistic arrangement. Professional cinematography, clean presentation.`,
      `Part 2: Color transformation begins.${context} Colors start to take shape and form, magical transition effects. Smooth motion, artistic lighting.`,
      `Part 3: Creative elements emerge.${context} Colors transform into domain-specific elements, featuring ${colors}. Professional cinematography.`,
      `Part 4: Elements combine and arrange.${context} Creative elements move and arrange themselves harmoniously. Colors ${colors}, elegant choreography.`,
      `Part 5: Final creative presentation.${context} Complete creative concept showcasing ${colors} in perfect harmony. Professional presentation, dramatic finale.`
    ];
  }
}
