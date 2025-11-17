import { Smartphone, Monitor, Square } from 'lucide-react';

export type AspectRatioId = '9:16' | '16:9' | '1:1';

export interface AspectRatioConfig {
  id: AspectRatioId;
  label: string;
  description: string;
  icon: typeof Smartphone;
  cssClass: string;
  bestFor: string[];
  dimensions: { width: number; height: number };
}

export const ASPECT_RATIOS: AspectRatioConfig[] = [
  {
    id: '9:16',
    label: 'Vertical',
    description: 'Portrait orientation',
    icon: Smartphone,
    cssClass: 'aspect-[9/16]',
    bestFor: ['Instagram Stories', 'TikTok', 'Reels', 'Mobile'],
    dimensions: { width: 1080, height: 1920 }
  },
  {
    id: '16:9',
    label: 'Horizontal',
    description: 'Landscape orientation',
    icon: Monitor,
    cssClass: 'aspect-[16/9]',
    bestFor: ['YouTube', 'Web', 'Presentations', 'Desktop'],
    dimensions: { width: 1920, height: 1080 }
  },
  {
    id: '1:1',
    label: 'Square',
    description: 'Equal sides',
    icon: Square,
    cssClass: 'aspect-square',
    bestFor: ['Instagram Feed', 'Portfolio', 'Universal'],
    dimensions: { width: 1080, height: 1080 }
  }
];

// Smart defaults per domain
export const DOMAIN_ASPECT_DEFAULTS: Record<string, { image: AspectRatioId; video: AspectRatioId }> = {
  '🍽️ Cooking': { image: '1:1', video: '9:16' },
  '👗 Fashion': { image: '9:16', video: '9:16' },
  '🛋️ Interior Design': { image: '16:9', video: '16:9' },
  '🎨 Art/Craft': { image: '1:1', video: '9:16' },
  '💄 Makeup': { image: '1:1', video: '9:16' },
  '🎉 Event Theme': { image: '16:9', video: '16:9' },
  '🌐 Graphic/Web Design': { image: '16:9', video: '16:9' }
};

export function getAspectRatioConfig(id: AspectRatioId): AspectRatioConfig {
  return ASPECT_RATIOS.find(ar => ar.id === id) || ASPECT_RATIOS[0];
}

export function getDomainDefaults(domain: string): { image: AspectRatioId; video: AspectRatioId } {
  return DOMAIN_ASPECT_DEFAULTS[domain] || { image: '1:1', video: '9:16' };
}
