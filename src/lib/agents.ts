import { AnthropicService, PaletteEntry } from './anthropic';
import { GeminiImageService } from './gemini';

export interface CreativeResult {
  ideas: string;
  image_url?: string;
  video_url?: string;
  series_urls?: string[];
  formats_generated: string[];
  errors?: string[];
  // Legacy fields (kept for backwards compatibility)
  ingredients?: string;
  dish?: string;
  design_info?: string;
}

export interface CreativeCustomizations {
  // Cooking
  dish_type?: string;
  primary_cooking_method?: string;
  complexity?: string;
  cuisine_style?: string;
  dietary_needs?: string[];

  // Fashion
  style_preference?: string;
  key_garment?: string;
  fabric_texture?: string;
  season?: string;
  audience?: string;

  // Interior Design
  room_type?: string;
  design_style?: string;
  budget_range?: string;

  // Art/Craft
  art_medium?: string;
  artistic_style?: string;
  skill_level?: string;
  subject_matter?: string;
  art_color_scheme?: string;
  art_purpose?: string;

  // Makeup
  makeup_style?: string;
  occasion?: string;
  focus_feature?: string;
  color_scheme?: string;
  intensity_level?: string;
  age_group?: string;

  // Event Theme
  event_type?: string;
  atmosphere?: string;
  event_size?: string;
  event_color_theme?: string;
  venue_type?: string;
  event_budget?: string;

  // Graphic/Web Design
  project_type?: string;
  design_approach?: string;
  target_industry?: string;
  color_palette?: string;
  complexity_level?: string;
  target_audience?: string;
}

export const CREATIVE_PATHS = [
  "🍽️ Cooking",
  "👗 Fashion", 
  "🛋️ Interior Design",
  "🎨 Art/Craft",
  "💄 Makeup",
  "🎉 Event Theme",
  "🌐 Graphic/Web Design"
] as const;

export const IMAGE_PROMPT_OPTIONS = {
  "🍽️ Cooking": ["Dish Plated", "Artistic Ingredients", "Cooking Process", "Concept Sketch"],
  "👗 Fashion": ["Full Outfit Look", "Flat Lay Styling", "Fabric/Detail Focus", "Fashion Illustration"],
  "🛋️ Interior Design": ["Room Perspective View", "Mood Board / Style Tile", "Color Vignette", "Blueprint/Sketch with Color"],
  "🎨 Art/Craft": ["Finished Artwork", "Studio Context", "Material/Texture Focus", "Concept Sketchbook"],
  "💄 Makeup": ["Close-up Beauty Shot", "Full Face Look", "Product Swatch Art", "Makeup Chart/Illustration"],
  "🎉 Event Theme": ["Table Setting Detail", "Overall Venue Atmosphere", "Decor Vignette", "Invitation Suite Mockup"],
  "🌐 Graphic/Web Design": ["UI Mockup (Website/App)", "Brand Application Mockup", "Abstract Color Background", "Style Guide Snippet"]
} as const;

export class CreativeAgentsService {
  static async generateCreativeIdeas(
    path: string,
    palette: PaletteEntry[],
    customizations: CreativeCustomizations = {},
    imagePromptChoice: string
  ): Promise<CreativeResult> {
    try {
      const result: CreativeResult = { ideas: '' };

      // Generate text ideas based on the domain
      switch (path) {
        case "🍽️ Cooking":
          result.ideas = await this.generateCookingIdeas(palette, customizations);
          break;
        case "👗 Fashion":
          result.ideas = await this.generateFashionIdeas(palette, customizations);
          break;
        case "🛋️ Interior Design":
          result.ideas = await this.generateInteriorIdeas(palette, customizations);
          break;
        case "🎨 Art/Craft":
          result.ideas = await this.generateArtCraftIdeas(palette, customizations);
          break;
        case "💄 Makeup":
          result.ideas = await this.generateMakeupIdeas(palette, customizations);
          break;
        case "🎉 Event Theme":
          result.ideas = await this.generateEventIdeas(palette, customizations);
          break;
        case "🌐 Graphic/Web Design":
          result.ideas = await this.generateDesignIdeas(palette, customizations);
          break;
        default:
          result.ideas = "This creative path is not yet implemented.";
      }

      // Generate image using Gemini
      result.image_url = await GeminiImageService.generateImageForDomain(
        path,
        result.ideas,
        palette,
        imagePromptChoice
      );

      return result;
    } catch (error) {
      console.error('Error generating creative ideas:', error);
      return {
        ideas: 'An error occurred while generating creative ideas.',
        image_url: undefined
      };
    }
  }

  private static async generateCookingIdeas(
    palette: PaletteEntry[],
    customizations: CreativeCustomizations
  ): Promise<string> {
    const additionalContext = this.buildCookingContext(customizations);
    const ideas = await AnthropicService.generateCreativeIdeas(
      palette,
      'culinary arts and cooking',
      customizations,
      `${additionalContext} Create a detailed dish concept including: dish name, description, key ingredients, plating suggestions, and cooking techniques. Focus on how the colors inspire the flavors and presentation.`
    );
    return ideas;
  }

  private static async generateFashionIdeas(
    palette: PaletteEntry[],
    customizations: CreativeCustomizations
  ): Promise<string> {
    const additionalContext = this.buildFashionContext(customizations);
    return await AnthropicService.generateCreativeIdeas(
      palette,
      'fashion design and styling',
      customizations,
      `${additionalContext} Create a complete outfit concept including: style description, key pieces, fabric suggestions, accessories, and styling tips. Explain how each color can be incorporated into the look.`
    );
  }

  private static async generateInteriorIdeas(
    palette: PaletteEntry[],
    customizations: CreativeCustomizations
  ): Promise<string> {
    const additionalContext = this.buildInteriorContext(customizations);
    return await AnthropicService.generateCreativeIdeas(
      palette,
      'interior design and home decor',
      customizations,
      `${additionalContext} Create a complete room design concept including: color scheme application, furniture suggestions, materials and textures, lighting ideas, and decorative elements.`
    );
  }

  private static async generateArtCraftIdeas(
    palette: PaletteEntry[],
    customizations: CreativeCustomizations
  ): Promise<string> {
    const additionalContext = this.buildArtCraftContext(customizations);
    return await AnthropicService.generateCreativeIdeas(
      palette,
      'art and craft creation',
      customizations,
      `${additionalContext} Create a detailed art project concept including: artistic vision, techniques to use, materials needed, composition ideas, and step-by-step creative process.`
    );
  }

  private static async generateMakeupIdeas(
    palette: PaletteEntry[],
    customizations: CreativeCustomizations
  ): Promise<string> {
    const additionalContext = this.buildMakeupContext(customizations);
    return await AnthropicService.generateCreativeIdeas(
      palette,
      'makeup artistry and beauty',
      customizations,
      `${additionalContext} Create a complete makeup look concept including: color placement, techniques, product suggestions, and application tips. Explain how to use each color in the palette.`
    );
  }

  private static async generateEventIdeas(
    palette: PaletteEntry[],
    customizations: CreativeCustomizations
  ): Promise<string> {
    const additionalContext = this.buildEventContext(customizations);
    return await AnthropicService.generateCreativeIdeas(
      palette,
      'event planning and design',
      customizations,
      `${additionalContext} Create a comprehensive event theme concept including: overall aesthetic, decoration ideas, table settings, lighting, floral arrangements, and guest experience elements.`
    );
  }

  private static async generateDesignIdeas(
    palette: PaletteEntry[],
    customizations: CreativeCustomizations
  ): Promise<string> {
    const additionalContext = this.buildDesignContext(customizations);
    return await AnthropicService.generateCreativeIdeas(
      palette,
      'graphic and web design',
      customizations,
      `${additionalContext} Create a complete design concept including: visual hierarchy, typography suggestions, layout ideas, brand applications, and user experience considerations.`
    );
  }

  // Context builders for each domain
  private static buildCookingContext(customizations: CreativeCustomizations): string {
    const parts = [];
    if (customizations.dish_type && customizations.dish_type !== "Chef's choice") {
      parts.push(`Dish type: ${customizations.dish_type}`);
    }
    if (customizations.cuisine_style) {
      parts.push(`Cuisine style: ${customizations.cuisine_style}`);
    }
    if (customizations.primary_cooking_method && customizations.primary_cooking_method !== "Any") {
      parts.push(`Cooking method: ${customizations.primary_cooking_method}`);
    }
    if (customizations.dietary_needs && customizations.dietary_needs.length > 0) {
      parts.push(`Dietary needs: ${customizations.dietary_needs.join(', ')}`);
    }
    return parts.join('. ');
  }

  private static buildFashionContext(customizations: CreativeCustomizations): string {
    const parts = [];
    if (customizations.style_preference && customizations.style_preference !== "Any") {
      parts.push(`Style: ${customizations.style_preference}`);
    }
    if (customizations.season && customizations.season !== "Any") {
      parts.push(`Season: ${customizations.season}`);
    }
    if (customizations.key_garment && customizations.key_garment !== "Any") {
      parts.push(`Key garment: ${customizations.key_garment}`);
    }
    if (customizations.fabric_texture && customizations.fabric_texture !== "Any") {
      parts.push(`Fabric focus: ${customizations.fabric_texture}`);
    }
    return parts.join('. ');
  }

  private static buildInteriorContext(customizations: CreativeCustomizations): string {
    const parts = [];
    if (customizations.room_type && customizations.room_type !== "Any Room") {
      parts.push(`Room: ${customizations.room_type}`);
    }
    if (customizations.design_style && customizations.design_style !== "Any Style") {
      parts.push(`Style: ${customizations.design_style}`);
    }
    if (customizations.budget_range && customizations.budget_range !== "Any Budget") {
      parts.push(`Budget: ${customizations.budget_range}`);
    }
    return parts.join('. ');
  }

  private static buildArtCraftContext(customizations: CreativeCustomizations): string {
    const parts = [];
    if (customizations.art_medium && customizations.art_medium !== "Any Medium") {
      parts.push(`Medium: ${customizations.art_medium}`);
    }
    if (customizations.artistic_style && customizations.artistic_style !== "Any Style") {
      parts.push(`Style: ${customizations.artistic_style}`);
    }
    if (customizations.skill_level && customizations.skill_level !== "Any Complexity") {
      parts.push(`Skill Level: ${customizations.skill_level}`);
    }
    if (customizations.subject_matter && customizations.subject_matter !== "Any Subject") {
      parts.push(`Subject: ${customizations.subject_matter}`);
    }
    if (customizations.art_color_scheme && customizations.art_color_scheme !== "Any Colors") {
      parts.push(`Color Scheme: ${customizations.art_color_scheme}`);
    }
    if (customizations.art_purpose && customizations.art_purpose !== "Any Purpose") {
      parts.push(`Purpose: ${customizations.art_purpose}`);
    }
    return parts.join('. ');
  }

  private static buildMakeupContext(customizations: CreativeCustomizations): string {
    const parts = [];
    if (customizations.makeup_style && customizations.makeup_style !== "Any Look") {
      parts.push(`Makeup style: ${customizations.makeup_style}`);
    }
    if (customizations.occasion && customizations.occasion !== "Any Occasion") {
      parts.push(`Occasion: ${customizations.occasion}`);
    }
    if (customizations.focus_feature && customizations.focus_feature !== "Balanced Look") {
      parts.push(`Focus feature: ${customizations.focus_feature}`);
    }
    if (customizations.color_scheme && customizations.color_scheme !== "Any Colors") {
      parts.push(`Color scheme: ${customizations.color_scheme}`);
    }
    if (customizations.intensity_level && customizations.intensity_level !== "Any Intensity") {
      parts.push(`Intensity: ${customizations.intensity_level}`);
    }
    if (customizations.age_group && customizations.age_group !== "Any Age") {
      parts.push(`Age group: ${customizations.age_group}`);
    }
    return parts.join('. ');
  }

  private static buildEventContext(customizations: CreativeCustomizations): string {
    const parts = [];
    if (customizations.event_type && customizations.event_type !== "Any Event") {
      parts.push(`Event: ${customizations.event_type}`);
    }
    if (customizations.atmosphere && customizations.atmosphere !== "Any Atmosphere") {
      parts.push(`Atmosphere: ${customizations.atmosphere}`);
    }
    if (customizations.event_size && customizations.event_size !== "Any Size") {
      parts.push(`Size: ${customizations.event_size}`);
    }
    if (customizations.event_color_theme && customizations.event_color_theme !== "Any Colors") {
      parts.push(`Color theme: ${customizations.event_color_theme}`);
    }
    if (customizations.venue_type && customizations.venue_type !== "Any Venue") {
      parts.push(`Venue: ${customizations.venue_type}`);
    }
    if (customizations.event_budget && customizations.event_budget !== "Any Budget") {
      parts.push(`Budget: ${customizations.event_budget}`);
    }
    return parts.join('. ');
  }

  private static buildDesignContext(customizations: CreativeCustomizations): string {
    const parts = [];
    if (customizations.project_type && customizations.project_type !== "Any Project") {
      parts.push(`Project: ${customizations.project_type}`);
    }
    if (customizations.design_approach && customizations.design_approach !== "Any Style") {
      parts.push(`Design style: ${customizations.design_approach}`);
    }
    if (customizations.target_industry && customizations.target_industry !== "Any Industry") {
      parts.push(`Industry: ${customizations.target_industry}`);
    }
    if (customizations.color_palette && customizations.color_palette !== "Any Colors") {
      parts.push(`Color palette: ${customizations.color_palette}`);
    }
    if (customizations.complexity_level && customizations.complexity_level !== "Any Complexity") {
      parts.push(`Complexity: ${customizations.complexity_level}`);
    }
    if (customizations.target_audience && customizations.target_audience !== "Any Audience") {
      parts.push(`Target audience: ${customizations.target_audience}`);
    }
    return parts.join('. ');
  }
}