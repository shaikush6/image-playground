export interface InvitationVariationDirective {
  id: string;
  name: string;
  description: string;
  promptCue: string;
}

export const INVITATION_VARIATIONS: InvitationVariationDirective[] = [
  {
    id: 'collage-energy',
    name: 'Collage Energy',
    description: 'Layered scraps, paper rips, and bold color blocking.',
    promptCue: 'collage-inspired layout with layered paper scraps, taped corners, and painterly strokes',
  },
  {
    id: 'letterpress-luxe',
    name: 'Letterpress Luxe',
    description: 'Debossed typography, thick cotton paper, foil edges.',
    promptCue: 'letterpress impression with thick cotton paper, debossed serif typography, and gold foil edges',
  },
  {
    id: 'photo-forward',
    name: 'Photo Forward',
    description: 'Hero photographic frame with translucent overlays.',
    promptCue: 'photo-forward layout featuring cinematic photo frame, translucent gradient overlays, and minimal copy blocks',
  },
  {
    id: 'illustrated-story',
    name: 'Illustrated Story',
    description: 'Hand-drawn motifs and whimsical doodles framing the copy.',
    promptCue: 'hand-drawn illustrated motifs wrapping the copy, whimsical doodles, gentle pencil texture',
  },
  {
    id: 'kinetic-type',
    name: 'Kinetic Type',
    description: 'Dynamic stacked typography and perspective grids.',
    promptCue: 'kinetic typography with perspective grids, tilted letters, and glowing shadow trails',
  },
  {
    id: 'minimal-air',
    name: 'Minimal Air',
    description: 'Ultra-clean spacing, micro details, and whisper colors.',
    promptCue: 'ultra minimal swiss layout, micro typographic details, airy spacing, whisper pastel palette',
  },
];

export function getVariationById(id: string) {
  return INVITATION_VARIATIONS.find((variation) => variation.id === id);
}
