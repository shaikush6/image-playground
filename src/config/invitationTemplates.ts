export interface InvitationTemplate {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  thumbnail?: string;
  promptCues: string[];
  layoutNotes?: string;
}

export const INVITATION_TEMPLATES: InvitationTemplate[] = [
  {
    id: 'editorial-save-the-date',
    categoryId: 'wedding',
    title: 'Editorial Save the Date',
    description: 'Asymmetrical type, negative space hero photo, subtle embossing.',
    thumbnail: '/templates/editorial-save-the-date.png',
    promptCues: [
      'editorial typography hierarchy with oversized serif numerals',
      'full-bleed hero photo masked with oval cutout',
      'blind deboss border and vellum overlay texture',
    ],
    layoutNotes: 'Headline left, details right. include subtle debossed monogram in the footer.',
  },
  {
    id: 'retro-poster-party',
    categoryId: 'celebration',
    title: 'Retro Poster Party',
    description: '70s gig-poster energy with halftone gradients and chunky type.',
    thumbnail: '/templates/retro-poster-party.png',
    promptCues: [
      'retro gig poster layout with stacked typography and halftone gradients',
      'grainy paper texture with misregistered CMYK ink',
      'bold ribbon banners framing key details',
    ],
    layoutNotes: 'Use curved text for the headliner and layered tickets behind the copy.',
  },
  {
    id: 'boardroom-luxe',
    categoryId: 'corporate',
    title: 'Boardroom Luxe',
    description: 'Marble split layout, metallic separators, premium sans-serif.',
    thumbnail: '/templates/boardroom-luxe.png',
    promptCues: [
      'split layout featuring deep marble slab and bright negative space',
      'thin metallic separators and micro-grid annotations',
      'premium sans-serif typography with high-contrast weights',
    ],
    layoutNotes: 'Focus on agenda modules with iconography for each segment.',
  },
  {
    id: 'neon-deco-birthday',
    categoryId: 'birthday',
    title: 'Neon Deco Poster',
    description: 'Chrome numerals, stacked deco type, holographic gradients.',
    promptCues: [
      'multi-column deco typography with oversized numerals',
      'chrome balloons and neon tube accents framing the title',
      'gradient dance-floor reflection beneath the hero type',
    ],
    layoutNotes: 'Center the age badge, anchor RSVP bottom-right in a pill label.',
  },
  {
    id: 'crestfolio-grad',
    categoryId: 'graduation',
    title: 'Foil Crest Announcement',
    description: 'Formal crest lockup with photo strip and micro serif labels.',
    promptCues: [
      'top crest with laurel branches and monogram inside gold foil circle',
      'vertical photo strip framed in letterpress texture',
      'micro-serif informational labels separated by hairline rules',
    ],
    layoutNotes: 'Keep crest + headline above the fold, pair serif + sans in a 60/40 split.',
  },
  {
    id: 'storybook-shower',
    categoryId: 'baby-shower',
    title: 'Storybook Spread',
    description: 'Soft scalloped frames, watercolor critters, dotted borders.',
    promptCues: [
      'left/right storybook layout with scalloped borders',
      'hand-painted baby animals sitting on watercolor clouds',
      'dotted line dividers with whimsical script subheads',
    ],
    layoutNotes: 'Hero illustration on the left, copy on right, add floating cloud labels for time + RSVP.',
  },
];

export function getTemplatesForCategory(categoryId: string) {
  return INVITATION_TEMPLATES.filter((template) => template.categoryId === categoryId);
}

export function getTemplateById(id: string) {
  return INVITATION_TEMPLATES.find((template) => template.id === id);
}
