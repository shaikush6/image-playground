import { PaletteEntry } from '@/lib/anthropic';
import { CreativeCustomizations } from '@/lib/agents';
import { getThemeById } from '@/config/themes';

/**
 * Builds a series of prompts for image series generation
 */
export function buildImageSeriesPrompts(
  domain: string,
  palette: PaletteEntry[],
  customizations: CreativeCustomizations,
  themeId: string,
  count: number
): string[] {
  const theme = getThemeById(domain, themeId);
  if (!theme) {
    // Fallback to generic series
    return buildGenericSeriesPrompts(palette, count);
  }

  // Extract color information
  const colorNames = palette.map(p => p.name).join(', ');
  const dominantColor = palette.find(p => p.suggested_role.includes('Dominant'))?.name || palette[0]?.name;
  const accentColor = palette.find(p => p.suggested_role.includes('Accent'))?.name || palette[palette.length - 1]?.name;

  // Build customizations context
  const context = buildCustomizationsContext(domain, customizations);

  // Replace template variables
  const basePrompt = theme.promptTemplate
    .replace('{colors}', colorNames)
    .replace('{dominant}', dominantColor || '')
    .replace('{accent}', accentColor || '')
    .replace('{context}', context);

  // Generate series variations
  return generateSeriesVariations(basePrompt, count, theme.id);
}

/**
 * Builds customizations context string from customizations object
 */
function buildCustomizationsContext(domain: string, customizations: CreativeCustomizations): string {
  const parts: string[] = [];

  switch (domain) {
    case '🍽️ Cooking':
      if (customizations.dish_type && customizations.dish_type !== "Chef's choice") {
        parts.push(`${customizations.dish_type}`);
      }
      if (customizations.cuisine_style) {
        parts.push(`${customizations.cuisine_style} cuisine`);
      }
      if (customizations.primary_cooking_method && customizations.primary_cooking_method !== "Any") {
        parts.push(`${customizations.primary_cooking_method} cooking`);
      }
      break;

    case '👗 Fashion':
      if (customizations.style_preference && customizations.style_preference !== "Any") {
        parts.push(`${customizations.style_preference} style`);
      }
      if (customizations.key_garment && customizations.key_garment !== "Any") {
        parts.push(`featuring ${customizations.key_garment}`);
      }
      break;

    case '🛋️ Interior Design':
      if (customizations.room_type && customizations.room_type !== "Any Room") {
        parts.push(`${customizations.room_type}`);
      }
      if (customizations.design_style && customizations.design_style !== "Any Style") {
        parts.push(`${customizations.design_style} design`);
      }
      break;

    case '🎨 Art/Craft':
      if (customizations.art_style) {
        parts.push(`${customizations.art_style} style`);
      }
      if (customizations.complexity) {
        parts.push(`${customizations.complexity} complexity`);
      }
      break;

    case '💄 Makeup':
      if (customizations.occasion && customizations.occasion !== "Any Event") {
        parts.push(`for ${customizations.occasion}`);
      }
      if (customizations.intensity) {
        parts.push(`${customizations.intensity} intensity`);
      }
      break;

    case '🎉 Event Theme':
      if (customizations.event_type && customizations.event_type !== "Any Event") {
        parts.push(`${customizations.event_type}`);
      }
      if (customizations.season) {
        parts.push(`${customizations.season} season`);
      }
      break;

    case '🌐 Graphic/Web Design':
      if (customizations.project_type) {
        parts.push(`${customizations.project_type} project`);
      }
      if (customizations.design_style) {
        parts.push(`${customizations.design_style} aesthetic`);
      }
      break;
  }

  return parts.join(', ');
}

/**
 * Generates series variations based on theme type
 */
function generateSeriesVariations(basePrompt: string, count: number, themeType: string): string[] {
  const prompts: string[] = [];

  // Different variation strategies based on theme
  if (themeType.includes('transformation') || themeType.includes('tutorial')) {
    // Progressive transformation series
    const steps = ['initial', 'early stage', 'mid-development', 'advanced stage', 'final result'];
    for (let i = 0; i < count; i++) {
      const step = steps[Math.floor((i / count) * steps.length)] || 'stage';
      prompts.push(`${basePrompt} Image ${i + 1} of ${count}: ${step}.`);
    }
  } else if (themeType.includes('portfolio') || themeType.includes('catalog')) {
    // Varied angles and compositions
    const angles = ['straight-on view', '45-degree angle', 'overhead shot', 'close-up detail', 'wide context shot'];
    for (let i = 0; i < count; i++) {
      const angle = angles[i % angles.length];
      prompts.push(`${basePrompt} Image ${i + 1} of ${count}: ${angle}, professional composition.`);
    }
  } else if (themeType.includes('social')) {
    // Social media variations
    const styles = ['candid moment', 'stylized shot', 'behind-the-scenes', 'detailed close-up', 'atmospheric wide'];
    for (let i = 0; i < count; i++) {
      const style = styles[i % styles.length];
      prompts.push(`${basePrompt} Image ${i + 1} of ${count}: ${style}, social media optimized.`);
    }
  } else {
    // Generic series with varied emphasis
    const variations = ['primary focus', 'alternative angle', 'detail showcase', 'context view', 'creative interpretation'];
    for (let i = 0; i < count; i++) {
      const variation = variations[i % variations.length];
      prompts.push(`${basePrompt} Image ${i + 1} of ${count}: ${variation}.`);
    }
  }

  return prompts;
}

/**
 * Fallback generic series prompts
 */
function buildGenericSeriesPrompts(palette: PaletteEntry[], count: number): string[] {
  const colorNames = palette.map(p => p.name).join(', ');
  const prompts: string[] = [];

  for (let i = 0; i < count; i++) {
    prompts.push(
      `Professional photography series image ${i + 1} of ${count}. ` +
      `Creative concept featuring colors: ${colorNames}. ` +
      `High quality, professional composition, cohesive visual style.`
    );
  }

  return prompts;
}
