import { AspectRatioId } from './aspectRatios';

export interface SeriesTheme {
  id: string;
  label: string;
  description: string;
  seriesSize: { min: number; max: number; default: number };
  preferredAspectRatio: AspectRatioId;
  promptTemplate: string;
}

export interface DomainThemes {
  domain: string;
  themes: SeriesTheme[];
  autoTheme: SeriesTheme; // Smart default
}

// Professional image series themes per domain (Nov 2025 trends)
export const IMAGE_SERIES_THEMES: Record<string, DomainThemes> = {
  '🍽️ Cooking': {
    domain: '🍽️ Cooking',
    autoTheme: {
      id: 'menu-catalog',
      label: 'Restaurant Menu Catalog',
      description: 'Professional dish photography for menus and promotion',
      seriesSize: { min: 5, max: 8, default: 6 },
      preferredAspectRatio: '16:9',
      promptTemplate: 'Professional restaurant menu photography series. {context}. Signature dish showcase with cinematic lighting, 45° angle, minimalist styling. Clean backgrounds, authentic presentation. Colors: {colors}.'
    },
    themes: [
      {
        id: 'menu-catalog',
        label: 'Restaurant Menu Catalog',
        description: 'Professional dish photography for menus',
        seriesSize: { min: 5, max: 8, default: 6 },
        preferredAspectRatio: '16:9',
        promptTemplate: 'Professional restaurant menu photography series. {context}. Signature dish showcase with cinematic lighting, 45° angle, minimalist styling. Colors: {colors}.'
      },
      {
        id: 'social-content',
        label: 'Social Media Series',
        description: 'Behind-the-scenes and flat lay content',
        seriesSize: { min: 3, max: 5, default: 4 },
        preferredAspectRatio: '9:16',
        promptTemplate: 'Social media food content series. {context}. Authentic cooking process, flat lay ingredients, overhead shots. Vertical mobile-first composition. Colors: {colors}.'
      },
      {
        id: 'recipe-story',
        label: 'Recipe Story Progression',
        description: 'Ingredient to final dish journey',
        seriesSize: { min: 4, max: 6, default: 5 },
        preferredAspectRatio: '1:1',
        promptTemplate: 'Recipe story photography series. {context}. Ingredient sourcing, preparation steps, cooking process, final plated presentation. Square format for versatility. Colors: {colors}.'
      }
    ]
  },

  '👗 Fashion': {
    domain: '👗 Fashion',
    autoTheme: {
      id: 'lookbook',
      label: 'Model Lookbook',
      description: 'Editorial fashion portraits with generous negative space',
      seriesSize: { min: 6, max: 10, default: 8 },
      preferredAspectRatio: '9:16',
      promptTemplate: 'Editorial fashion lookbook series. {context}. Vertical portrait framing, generous negative space, authentic emotion. Professional model photography, natural lighting. Colors: {colors}.'
    },
    themes: [
      {
        id: 'lookbook',
        label: 'Model Lookbook',
        description: 'Editorial fashion portraits',
        seriesSize: { min: 6, max: 10, default: 8 },
        preferredAspectRatio: '9:16',
        promptTemplate: 'Editorial fashion lookbook series. {context}. Vertical portrait framing, generous negative space, authentic emotion. Colors: {colors}.'
      },
      {
        id: 'product-catalog',
        label: 'Product Catalog',
        description: 'Fabric details and styling variations',
        seriesSize: { min: 5, max: 8, default: 6 },
        preferredAspectRatio: '9:16',
        promptTemplate: 'Fashion product catalog series. {context}. Close-up fabric textures, styling variations, detail showcase. Vertical composition. Colors: {colors}.'
      },
      {
        id: 'flat-lay',
        label: 'Flat Lay Styling',
        description: 'Outfit components arranged artistically',
        seriesSize: { min: 3, max: 5, default: 4 },
        preferredAspectRatio: '1:1',
        promptTemplate: 'Fashion flat lay series. {context}. Outfit components arranged artistically, overhead shots, clean backgrounds. Square composition. Colors: {colors}.'
      }
    ]
  },

  '🛋️ Interior Design': {
    domain: '🛋️ Interior Design',
    autoTheme: {
      id: 'magazine-spread',
      label: 'Magazine Portfolio Spread',
      description: 'Professional room photography for editorial',
      seriesSize: { min: 5, max: 8, default: 6 },
      preferredAspectRatio: '16:9',
      promptTemplate: 'Interior design magazine series. {context}. Wide-angle room photography, natural lighting, clean minimalist presentation. Horizontal landscape format. Colors: {colors}.'
    },
    themes: [
      {
        id: 'magazine-spread',
        label: 'Magazine Portfolio',
        description: 'Professional room photography',
        seriesSize: { min: 5, max: 8, default: 6 },
        preferredAspectRatio: '16:9',
        promptTemplate: 'Interior design magazine series. {context}. Wide-angle room views, architectural photography, authentic lived-in spaces. Colors: {colors}.'
      },
      {
        id: 'transformation',
        label: 'Room Transformation',
        description: 'Before, during, after renovation',
        seriesSize: { min: 4, max: 6, default: 5 },
        preferredAspectRatio: '16:9',
        promptTemplate: 'Room transformation series. {context}. Same space evolution, renovation journey, design progression. Horizontal format. Colors: {colors}.'
      },
      {
        id: 'vignettes',
        label: 'Styling Vignettes',
        description: 'Corner details and arrangements',
        seriesSize: { min: 4, max: 6, default: 5 },
        preferredAspectRatio: '9:16',
        promptTemplate: 'Interior styling vignette series. {context}. Corner details, shelf arrangements, decorative elements. Vertical composition. Colors: {colors}.'
      }
    ]
  },

  '🎨 Art/Craft': {
    domain: '🎨 Art/Craft',
    autoTheme: {
      id: 'portfolio',
      label: 'Portfolio Showcase',
      description: 'Curated best works collection',
      seriesSize: { min: 8, max: 12, default: 10 },
      preferredAspectRatio: '1:1',
      promptTemplate: 'Art portfolio showcase series. {context}. Gallery-quality artwork presentation, studio lighting, authentic artistic process. Square format for uniformity. Colors: {colors}.'
    },
    themes: [
      {
        id: 'portfolio',
        label: 'Portfolio Showcase',
        description: 'Best works collection',
        seriesSize: { min: 8, max: 12, default: 10 },
        preferredAspectRatio: '1:1',
        promptTemplate: 'Art portfolio series. {context}. Curated best works, diverse techniques, professional gallery presentation. Colors: {colors}.'
      },
      {
        id: 'process',
        label: 'Process Documentation',
        description: 'Sketch to finished artwork',
        seriesSize: { min: 6, max: 8, default: 7 },
        preferredAspectRatio: '1:1',
        promptTemplate: 'Art creation process series. {context}. Sketches, work-in-progress stages, final artwork. Documentary style. Colors: {colors}.'
      },
      {
        id: 'exhibition',
        label: 'Gallery Exhibition',
        description: 'Thematic art collection',
        seriesSize: { min: 5, max: 10, default: 7 },
        preferredAspectRatio: '1:1',
        promptTemplate: 'Gallery exhibition series. {context}. Thematic artwork collection, unified concept, professional lighting. Colors: {colors}.'
      }
    ]
  },

  '💄 Makeup': {
    domain: '💄 Makeup',
    autoTheme: {
      id: 'tutorial',
      label: 'Tutorial Series',
      description: 'Step-by-step makeup application',
      seriesSize: { min: 5, max: 8, default: 6 },
      preferredAspectRatio: '9:16',
      promptTemplate: 'Makeup tutorial series. {context}. Step-by-step application progression, beauty close-ups, perfect lighting. Vertical portrait format. Colors: {colors}.'
    },
    themes: [
      {
        id: 'tutorial',
        label: 'Tutorial Series',
        description: 'Step-by-step application',
        seriesSize: { min: 5, max: 8, default: 6 },
        preferredAspectRatio: '9:16',
        promptTemplate: 'Makeup tutorial series. {context}. Application steps, transformation stages, beauty photography. Vertical format. Colors: {colors}.'
      },
      {
        id: 'product-campaign',
        label: 'Product Campaign',
        description: 'Color swatches and beauty shots',
        seriesSize: { min: 3, max: 6, default: 4 },
        preferredAspectRatio: '1:1',
        promptTemplate: 'Makeup product campaign series. {context}. Color swatches, product arrangements, beauty close-ups. Square format. Colors: {colors}.'
      },
      {
        id: 'transformation',
        label: 'Day to Night',
        description: 'Natural to dramatic looks',
        seriesSize: { min: 4, max: 6, default: 5 },
        preferredAspectRatio: '9:16',
        promptTemplate: 'Makeup transformation series. {context}. Natural daytime to dramatic evening evolution. Vertical beauty photography. Colors: {colors}.'
      }
    ]
  },

  '🎉 Event Theme': {
    domain: '🎉 Event Theme',
    autoTheme: {
      id: 'wedding',
      label: 'Wedding Photography',
      description: 'Ceremony and reception moments',
      seriesSize: { min: 8, max: 15, default: 10 },
      preferredAspectRatio: '16:9',
      promptTemplate: 'Wedding photography series. {context}. Candid documentary style, emotional moments, authentic celebration. Horizontal format for venues. Colors: {colors}.'
    },
    themes: [
      {
        id: 'wedding',
        label: 'Wedding Collection',
        description: 'Ceremony and reception',
        seriesSize: { min: 8, max: 15, default: 10 },
        preferredAspectRatio: '16:9',
        promptTemplate: 'Wedding photography series. {context}. Ceremony moments, reception details, candid emotions. Documentary style. Colors: {colors}.'
      },
      {
        id: 'corporate',
        label: 'Corporate Event',
        description: 'Professional event coverage',
        seriesSize: { min: 5, max: 10, default: 7 },
        preferredAspectRatio: '16:9',
        promptTemplate: 'Corporate event series. {context}. Professional networking, brand integration, event storytelling. Horizontal format. Colors: {colors}.'
      },
      {
        id: 'party',
        label: 'Themed Party',
        description: 'Decoration and atmosphere',
        seriesSize: { min: 4, max: 8, default: 6 },
        preferredAspectRatio: '16:9',
        promptTemplate: 'Themed party series. {context}. Decoration showcase, color scheme execution, celebration atmosphere. Colors: {colors}.'
      }
    ]
  },

  '🌐 Graphic/Web Design': {
    domain: '🌐 Graphic/Web Design',
    autoTheme: {
      id: 'brand-identity',
      label: 'Brand Identity Package',
      description: 'Logo applications and guidelines',
      seriesSize: { min: 6, max: 12, default: 8 },
      preferredAspectRatio: '16:9',
      promptTemplate: 'Brand identity series. {context}. Logo applications, mockups, brand guidelines, design system. Horizontal presentation format. Colors: {colors}.'
    },
    themes: [
      {
        id: 'brand-identity',
        label: 'Brand Identity',
        description: 'Complete brand system',
        seriesSize: { min: 6, max: 12, default: 8 },
        preferredAspectRatio: '16:9',
        promptTemplate: 'Brand identity series. {context}. Logo mockups, business cards, marketing materials, brand applications. Colors: {colors}.'
      },
      {
        id: 'ui-portfolio',
        label: 'UI/UX Portfolio',
        description: 'App and website designs',
        seriesSize: { min: 5, max: 8, default: 6 },
        preferredAspectRatio: '16:9',
        promptTemplate: 'UI/UX portfolio series. {context}. Website designs, app interfaces, user flows, responsive mockups. Colors: {colors}.'
      },
      {
        id: 'social-campaign',
        label: 'Social Campaign',
        description: 'Multi-platform graphics',
        seriesSize: { min: 4, max: 6, default: 5 },
        preferredAspectRatio: '1:1',
        promptTemplate: 'Social media campaign series. {context}. Multi-platform graphics, cohesive visual theme, modern design. Colors: {colors}.'
      }
    ]
  }
};

export function getDomainThemes(domain: string): DomainThemes | null {
  return IMAGE_SERIES_THEMES[domain] || null;
}

export function getThemeById(domain: string, themeId: string): SeriesTheme | null {
  const domainThemes = getDomainThemes(domain);
  if (!domainThemes) return null;

  if (themeId === 'auto') return domainThemes.autoTheme;
  return domainThemes.themes.find(t => t.id === themeId) || domainThemes.autoTheme;
}
