export interface EventDetails {
  title: string;
  subtitle?: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  hostName?: string;
  rsvpInfo?: string;
  moodKeywords?: string;
  dressCode?: string;
}

export interface InvitationStyle {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
  colorScheme?: string[];
  colorPresets?: string[][];
}

export interface InvitationCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  styles: InvitationStyle[];
  suggestedAspectRatios: string[];
}

export type InvitationAspectRatio = '4:5' | '3:2' | '1:1' | '9:16' | '16:9';

export const INVITATION_CATEGORIES: InvitationCategory[] = [
  {
    id: 'birthday',
    name: 'Birthday Celebrations',
    icon: '🎂',
    description: 'Playful designs for kids, adults, and milestone birthdays.',
    suggestedAspectRatios: ['4:5', '1:1', '3:2'],
    styles: [
      {
        id: 'kids-fun',
        name: 'Kids Fun',
        description: 'Vibrant illustrated scenes with balloons, confetti, and cute characters.',
        promptTemplate: `Design a joyful {categoryName} invitation for {eventTitle}. 
Focus: {toneDescription}. 
Use bright illustrated elements, layered paper textures, and bold playful typography. 
Include event details ({detailsBlock}) within stylish text blocks. Palette: {colorPalette}.`,
        colorScheme: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF'],
        colorPresets: [
          ['#FF6B6B', '#FFD93D', '#4D96FF', '#F9F5FF'],
          ['#F97316', '#FDE68A', '#34D399', '#2563EB'],
          ['#FF8FAB', '#FFDAC1', '#E0BBE4', '#B5EAD7']
        ]
      },
      {
        id: 'adult-modern',
        name: 'Modern Adult',
        description: 'Bold typography with abstract shapes and metallic accents.',
        promptTemplate: `Create a modern {categoryName} invitation for {eventTitle} blending geometric shapes and luxury foil accents. 
Typography should be elegant sans-serif paired with a cursive highlight. 
Incorporate subtle gradients, clean spacing, and the following details: {detailsBlock}. Primary palette: {colorPalette}.`,
        colorScheme: ['#0F172A', '#EAB308', '#F87171', '#FFFFFF'],
        colorPresets: [
          ['#0F172A', '#F87171', '#FDE68A', '#EEF2FF'],
          ['#111827', '#D4AF37', '#F1F5F9', '#B45309'],
          ['#0F172A', '#F472B6', '#C084FC', '#F5F3FF']
        ]
      },
      {
        id: 'milestone-elegant',
        name: 'Milestone Elegance',
        description: 'Refined layout with photo frames and textured backgrounds.',
        promptTemplate: `Elegant {styleName} invitation celebrating {eventTitle}. 
Use layered vellum textures, serif typography, and delicate foil line art. 
Feature a hero number or badge for the milestone with supporting copy showing {detailsBlock}. Palette inspiration: {colorPalette}.`,
        colorScheme: ['#B77BFF', '#FDE68A', '#1E1B4B', '#F4F1EB'],
        colorPresets: [
          ['#B77BFF', '#FDE68A', '#1E1B4B', '#F4F1EB'],
          ['#D4C2FC', '#F8EDEB', '#7F5A83', '#F6F6F6'],
          ['#F2E8CF', '#C3A29E', '#5E548E', '#F1FAFF']
        ]
      },
      {
        id: 'retro-pop-celebration',
        name: 'Retro Pop Celebration',
        description: '70s-inspired poster layout with bold typography and halftone bursts.',
        promptTemplate: `Design a retro-inspired {categoryName} invitation for {eventTitle}. 
Use halftone gradients, offset typography, and curved frames. 
Highlight milestone copy ({detailsBlock}) with sticker-style callouts. Palette: {colorPalette}.`,
        colorScheme: ['#FF66C4', '#FFBD59', '#00C2BA', '#2E0249'],
        colorPresets: [
          ['#FF66C4', '#FFBD59', '#1F6FEB', '#FFF5E1'],
          ['#FF6F91', '#FFC75F', '#F9F871', '#845EC2'],
          ['#00C2BA', '#F2F2F2', '#FF9671', '#845EC2']
        ]
      },
      {
        id: 'garden-cake-soiree',
        name: 'Garden Cake Soiree',
        description: 'Watercolor botanicals with tiered cake illustration focal points.',
        promptTemplate: `Paint a whimsical {categoryName} invitation for {eventTitle}. 
Layer watercolor florals, frosting piping borders, and handwritten notes. 
Showcase event info ({detailsBlock}) tucked into ribbon labels. Palette {colorPalette}.`,
        colorScheme: ['#FFB3C1', '#FEE1E8', '#C1E1C1', '#FFECD1'],
        colorPresets: [
          ['#FFB3C1', '#FEE1E8', '#B4F8C8', '#FCF6BD'],
          ['#FF9AA2', '#FFDAC1', '#E2F0CB', '#B5EAD7'],
          ['#FAD2E1', '#F7D9C4', '#D9E7F5', '#CDE4DE']
        ]
      },
      {
        id: 'neon-arcade-bash',
        name: 'Neon Arcade Bash',
        description: 'Glow-stick gradients, chrome typography, and motion streaks.',
        promptTemplate: `Create a neon-charged {categoryName} invitation for {eventTitle}. 
Blend retro arcade grids, chrome numbers, and glitched typography. 
Call out {detailsBlock} using glowing chips and ticker panels. Palette {colorPalette}.`,
        colorScheme: ['#F72585', '#7209B7', '#3A0CA3', '#4CC9F0'],
        colorPresets: [
          ['#F72585', '#7209B7', '#3A0CA3', '#4CC9F0'],
          ['#FF5AC8', '#7122FA', '#1B1F3B', '#36F1CD'],
          ['#FF3CAC', '#562B7C', '#2B86C5', '#20E3B2']
        ]
      }
    ]
  },
  {
    id: 'wedding',
    name: 'Wedding & Formal',
    icon: '💍',
    description: 'Romantic save-the-dates, ceremony invitations, and reception cards.',
    suggestedAspectRatios: ['3:2', '4:5', '1:1'],
    styles: [
      {
        id: 'save-the-date',
        name: 'Save the Date',
        description: 'Soft florals, hand-painted textures, and script typography.',
        promptTemplate: `Create a romantic {categoryName} invitation titled {eventTitle}. 
Incorporate watercolor botanicals, linen texture, and flowing calligraphy. 
Layout should highlight couple names and {detailsBlock}. Palette focus: {colorPalette}.`,
        colorScheme: ['#F3D9DC', '#E2D4BA', '#D6EADF', '#8C7A6B'],
        colorPresets: [
          ['#F3D9DC', '#E2D4BA', '#8C7A6B', '#FFFFFF'],
          ['#EADDDC', '#BFA7A0', '#7A6248', '#F5F1EB'],
          ['#FDEDEB', '#E8D8CE', '#C0A299', '#806F63']
        ]
      },
      {
        id: 'formal-invite',
        name: 'Formal Invitation',
        description: 'Classic serif type, gold foil borders, and symmetrical layout.',
        promptTemplate: `Design a sophisticated {styleName} suite for {eventTitle}. 
Use thick cotton paper texture, letterpress impression, and gilded borders. 
Typography: small caps serif with monogram. Highlight {detailsBlock}. Palette: {colorPalette}.`,
        colorScheme: ['#FFFFFF', '#C58C4D', '#1F2937', '#D1D5DB'],
        colorPresets: [
          ['#FFFFFF', '#C58C4D', '#1F2937', '#D1D5DB'],
          ['#FDFBF7', '#B08968', '#2C2C34', '#E5DED3'],
          ['#FFFBF2', '#D4AF37', '#3F3F46', '#E8E5E1']
        ]
      },
      {
        id: 'reception-modern',
        name: 'Reception Modern',
        description: 'Minimal layout with avant-garde typography and tonal color blocking.',
        promptTemplate: `Modern reception invitation for {eventTitle}. 
Combine oversized sans-serif typography, translucent overlays, and editorial photography blends. 
Showcase event details ({detailsBlock}) with asymmetrical layout. Use palette {colorPalette}.`,
        colorScheme: ['#0B1120', '#9F1239', '#F1F5F9', '#FACC15'],
        colorPresets: [
          ['#0B1120', '#9F1239', '#FACC15', '#F1F5F9'],
          ['#1B1B3A', '#E43A19', '#F9DEC9', '#FEE440'],
          ['#0D1B2A', '#FF4D6D', '#FFE66D', '#EDF2F4']
        ]
      },
      {
        id: 'boho-terracotta',
        name: 'Boho Terracotta',
        description: 'Organic arches, pressed florals, and terracotta gradients.',
        promptTemplate: `Design a bohemian {categoryName} invitation for {eventTitle}. 
Layer deckled arches, hand-drawn botanicals, and micro serif typography. 
Emphasize relaxed details ({detailsBlock}) with tone-on-tone frames. Palette {colorPalette}.`,
        colorScheme: ['#CE8E6D', '#F2D3B9', '#663A2F', '#F5EEE2'],
        colorPresets: [
          ['#CE8E6D', '#F2D3B9', '#663A2F', '#F5EEE2'],
          ['#B05D48', '#F2E2CE', '#7B4B3A', '#E6C8B5'],
          ['#AD7A7A', '#FDEADE', '#7F675B', '#E8D8CF']
        ]
      },
      {
        id: 'art-deco-gala',
        name: 'Art Deco Gala',
        description: 'Symmetrical deco motifs, champagne foil, and mirrored typography.',
        promptTemplate: `Create an art deco {categoryName} suite for {eventTitle}. 
Use mirrored borders, geometric rays, and condensed type. 
Highlight {detailsBlock} inside layered panels with metallic rules. Palette {colorPalette}.`,
        colorScheme: ['#0F172A', '#C89B3C', '#FDF5E6', '#2E2E3A'],
        colorPresets: [
          ['#0F172A', '#C89B3C', '#FDF5E6', '#2E2E3A'],
          ['#1F1D36', '#E0AA3E', '#F4EBD0', '#726E75'],
          ['#050401', '#E9C46A', '#F2CC8F', '#264653']
        ]
      },
      {
        id: 'coastal-destination',
        name: 'Coastal Destination',
        description: 'Airy linen textures with sun-bleached gradients and travel stamps.',
        promptTemplate: `Craft a breezy destination invitation for {eventTitle}. 
Blend watercolor shoreline scenes, vellum overlays, and passport stamps. 
List {detailsBlock} with relaxed serif + handwritten pairing. Palette {colorPalette}.`,
        colorScheme: ['#A7C6ED', '#F6E7D8', '#2F4858', '#F4F9FF'],
        colorPresets: [
          ['#A7C6ED', '#F6E7D8', '#2F4858', '#F4F9FF'],
          ['#7AB8BF', '#F9F7F3', '#345B63', '#F4EAD5'],
          ['#94B4A4', '#FDF6EC', '#2C6E91', '#E4F0FF']
        ]
      }
    ]
  },
  {
    id: 'corporate',
    name: 'Corporate Events',
    icon: '🏢',
    description: 'Professional conferences, launches, and leadership events.',
    suggestedAspectRatios: ['16:9', '3:2'],
    styles: [
      {
        id: 'conference',
        name: 'Conference',
        description: 'Grid-based layout with data-inspired accents.',
        promptTemplate: `Design a professional {categoryName} invitation for {eventTitle}. 
Incorporate isometric shapes, gradient lines, and tech-inspired iconography. 
Call out speakers and schedule from {detailsBlock}. Palette: {colorPalette}.`,
        colorScheme: ['#0F172A', '#2563EB', '#22D3EE', '#F8FAFC'],
        colorPresets: [
          ['#0F172A', '#2563EB', '#22D3EE', '#F8FAFC'],
          ['#111827', '#3B82F6', '#06B6D4', '#E0F2FE'],
          ['#0B1120', '#6366F1', '#14B8A6', '#F1F5F9']
        ]
      },
      {
        id: 'executive',
        name: 'Executive Dinner',
        description: 'Dark backgrounds, metallic foils, and premium materials.',
        promptTemplate: `Create an upscale executive invite for {eventTitle}. 
Use deep tones, marble textures, and rose-gold foil borders. 
Typography should be refined serif. Include event details ({detailsBlock}) with discrete icons. Palette {colorPalette}.`,
        colorScheme: ['#0B0F19', '#F5D0C5', '#94A3B8', '#1E293B'],
        colorPresets: [
          ['#0B0F19', '#F5D0C5', '#94A3B8', '#1E293B'],
          ['#11131D', '#EEC9B7', '#8DA0B8', '#2D3748'],
          ['#050914', '#DDB892', '#ADB5BD', '#1C1F2A']
        ]
      },
      {
        id: 'product-launch',
        name: 'Product Launch',
        description: 'Futuristic gradients with glowing elements and motion blur.',
        promptTemplate: `Futuristic {styleName} invitation for {eventTitle}. 
Blend neon gradients, motion trails, and sleek sans-serif type. 
Highlight launch info and {detailsBlock}. Palette {colorPalette}.`,
        colorScheme: ['#9333EA', '#14B8A6', '#0EA5E9', '#020617'],
        colorPresets: [
          ['#9333EA', '#14B8A6', '#0EA5E9', '#020617'],
          ['#8B5CF6', '#06B6D4', '#0F172A', '#E0F2FE'],
          ['#6D28D9', '#14B8A6', '#F472B6', '#020617']
        ]
      },
      {
        id: 'panel-roundtable',
        name: 'Panel Roundtable',
        description: 'Modular grid, speaker portraits, and info badges.',
        promptTemplate: `Design a modular {categoryName} invite for {eventTitle}. 
Include headshot frames, agenda badges, and layered grids. 
Call out {detailsBlock} using pill-shaped callouts. Palette {colorPalette}.`,
        colorScheme: ['#0F172A', '#38BDF8', '#FACC15', '#F8FAFC'],
        colorPresets: [
          ['#0F172A', '#38BDF8', '#FACC15', '#F8FAFC'],
          ['#111827', '#22D3EE', '#FB923C', '#F3F4F6'],
          ['#0B1120', '#2DD4BF', '#FBBF24', '#E5E7EB']
        ]
      },
      {
        id: 'minimal-blueprint',
        name: 'Minimal Blueprint',
        description: 'Technical blueprint lines with monochrome typography.',
        promptTemplate: `Craft a minimal {categoryName} invitation for {eventTitle}. 
Use blueprint grids, thin sans-serif captions, and subtle embossing. 
Highlight {detailsBlock} like a project spec sheet. Palette {colorPalette}.`,
        colorScheme: ['#0F172A', '#1D4ED8', '#93C5FD', '#E2E8F0'],
        colorPresets: [
          ['#0F172A', '#1D4ED8', '#93C5FD', '#E2E8F0'],
          ['#0B132B', '#1C7293', '#5BC0BE', '#F1FAFF'],
          ['#0D1B2A', '#1F7AEC', '#A8D1FF', '#EEF2FF']
        ]
      },
      {
        id: 'immersive-keynote',
        name: 'Immersive Keynote',
        description: 'Large-scale projection visuals with motion blur typography.',
        promptTemplate: `Create an immersive keynote invitation for {eventTitle}. 
Blend projector light streaks, hero gradient spheres, and kinetic type. 
Show {detailsBlock} stacked with micro-icons. Palette {colorPalette}.`,
        colorScheme: ['#05051A', '#4C1D95', '#22D3EE', '#F472B6'],
        colorPresets: [
          ['#05051A', '#4C1D95', '#22D3EE', '#F472B6'],
          ['#020617', '#6D28D9', '#14B8A6', '#FDE68A'],
          ['#050A30', '#9333EA', '#00F5FF', '#FDE68A']
        ]
      }
    ]
  },
  {
    id: 'holiday',
    name: 'Holiday & Seasonal',
    icon: '🎄',
    description: 'Festive invitations for Christmas, New Year, and seasonal gatherings.',
    suggestedAspectRatios: ['4:5', '1:1'],
    styles: [
      {
        id: 'christmas-classic',
        name: 'Classic Christmas',
        description: 'Traditional palette with botanical illustrations and foil accents.',
        promptTemplate: `Classic holiday invitation for {eventTitle}. 
Use pine foliage borders, hand-drawn ornaments, and script typography. 
Feature cozy textures and include {detailsBlock}. Palette emphasis: {colorPalette}.`,
        colorScheme: ['#165B33', '#146B3A', '#F8B229', '#EA4630'],
        colorPresets: [
          ['#165B33', '#146B3A', '#F8B229', '#EA4630'],
          ['#1B4332', '#2D6A4F', '#D8F3DC', '#FFB703'],
          ['#133A2D', '#BF0603', '#F6AA1C', '#FBF3E4']
        ]
      },
      {
        id: 'new-year-modern',
        name: 'Modern New Year',
        description: 'Bold typographic countdowns with confetti gradients.',
        promptTemplate: `Design a striking New Year invitation for {eventTitle}. 
Combine dynamic numerals, shimmering confetti blur, and metallic gradients. 
Highlight {detailsBlock}. Palette {colorPalette}.`,
        colorScheme: ['#0F172A', '#FACC15', '#E879F9', '#38BDF8'],
        colorPresets: [
          ['#0F172A', '#FACC15', '#E879F9', '#38BDF8'],
          ['#1F2937', '#FEF08A', '#FB7185', '#4ADE80'],
          ['#020617', '#FBBF24', '#E879F9', '#7DD3FC']
        ]
      },
      {
        id: 'autumn-harvest',
        name: 'Autumn Harvest',
        description: 'Warm earthy tones with watercolor foliage and hand lettering.',
        promptTemplate: `Warm seasonal invitation for {eventTitle}. 
Blend watercolor leaves, speckled paper texture, and hand-lettered headers. 
Include detailed copy ({detailsBlock}). Palette inspiration: {colorPalette}.`,
        colorScheme: ['#B45309', '#92400E', '#FBBF24', '#FEE2B3'],
        colorPresets: [
          ['#B45309', '#92400E', '#FBBF24', '#FEE2B3'],
          ['#7C3F00', '#DAA520', '#F7E1BC', '#FFF9F0'],
          ['#6B2C1B', '#E07A5F', '#F2CC8F', '#EDE6DB']
        ]
      },
      {
        id: 'winter-minimal',
        name: 'Winter Minimal',
        description: 'Frosted gradients, blind embossing, and micro serif typography.',
        promptTemplate: `Design a minimal {categoryName} invite for {eventTitle}. 
Use frosted glass blocks, embossed snowflakes, and calm typography. 
Emphasize {detailsBlock} with slim dividers. Palette {colorPalette}.`,
        colorScheme: ['#E0F2F1', '#A7C4D5', '#0F172A', '#FFFFFF'],
        colorPresets: [
          ['#E0F2F1', '#A7C4D5', '#0F172A', '#FFFFFF'],
          ['#F5F7FA', '#B0C4DE', '#1F2937', '#CCE3DE'],
          ['#EEF6FB', '#A2B9BC', '#3A506B', '#F7FFF7']
        ]
      },
      {
        id: 'harvest-folk',
        name: 'Harvest Folk',
        description: 'Folk art illustrations, stitched borders, and warm quilt textures.',
        promptTemplate: `Create a folk-inspired {categoryName} invitation for {eventTitle}. 
Layer stitched borders, folk patterns, and vintage typography. 
List {detailsBlock} on crafted labels. Palette {colorPalette}.`,
        colorScheme: ['#8C3B0E', '#FFC857', '#7FB069', '#F4E4D7'],
        colorPresets: [
          ['#8C3B0E', '#FFC857', '#7FB069', '#F4E4D7'],
          ['#6B2C2A', '#F4A259', '#5B8C5A', '#F7EED3'],
          ['#93312B', '#FAD6A5', '#8DA47E', '#FCEFE6']
        ]
      },
      {
        id: 'spooky-neon',
        name: 'Spooky Neon',
        description: 'Glow-in-the-dark typography with illustrated holographic ghosts.',
        promptTemplate: `Craft a spooky {categoryName} invitation for {eventTitle}. 
Blend neon type, illustrated spirits, and textured gradients. 
Show {detailsBlock} with horror ticket stubs. Palette {colorPalette}.`,
        colorScheme: ['#050505', '#7C3AED', '#F472B6', '#FBBF24'],
        colorPresets: [
          ['#050505', '#7C3AED', '#F472B6', '#FBBF24'],
          ['#0F0B1A', '#C026D3', '#F97316', '#FEF3C7'],
          ['#040303', '#9333EA', '#F43F5E', '#FFFBEB']
        ]
      }
    ]
  },
  {
    id: 'baby-shower',
    name: 'Baby Shower',
    icon: '🍼',
    description: 'Sweet designs for baby showers and gender reveals.',
    suggestedAspectRatios: ['4:5', '1:1'],
    styles: [
      {
        id: 'classic',
        name: 'Classic Storybook',
        description: 'Soft watercolor animals and storybook frames.',
        promptTemplate: `Design a gentle {categoryName} invitation for {eventTitle}. 
Include illustrated baby animals, scalloped frames, and pastel gradients. 
Highlight key info ({detailsBlock}). Palette {colorPalette}.`,
        colorScheme: ['#F4E1F2', '#BDE0FE', '#CDEAC0', '#FFD6A5'],
        colorPresets: [
          ['#F4E1F2', '#BDE0FE', '#CDEAC0', '#FFD6A5'],
          ['#FAD4D8', '#D7E3FC', '#C7F0DB', '#FFF1C9'],
          ['#E8DFF5', '#B8E0D2', '#F9E2AE', '#F5CAC3']
        ]
      },
      {
        id: 'modern-minimal',
        name: 'Modern Minimal',
        description: 'Monoline illustrations and clean typography.',
        promptTemplate: `Minimal baby shower invitation for {eventTitle}. 
Use abstract shapes, monoline icons, and soft sans-serif fonts. 
Keep layout airy and highlight {detailsBlock}. Palette {colorPalette}.`,
        colorScheme: ['#0F172A', '#F5F5F4', '#94A3B8', '#F59E0B'],
        colorPresets: [
          ['#0F172A', '#F5F5F4', '#94A3B8', '#F59E0B'],
          ['#1F2933', '#EAEAEA', '#C7CED7', '#FFC857'],
          ['#111827', '#F0F4F8', '#CBD2D9', '#FFBF69']
        ]
      },
      {
        id: 'themed-adventure',
        name: 'Adventure Theme',
        description: 'Whimsical travel motifs and stamped details.',
        promptTemplate: `Adventure-inspired invitation for {eventTitle}. 
Blend illustrated maps, hot air balloons, and textured kraft paper. 
Include detailed copy ({detailsBlock}) using playful type. Palette {colorPalette}.`,
        colorScheme: ['#264653', '#2A9D8F', '#E9C46A', '#F4A261'],
        colorPresets: [
          ['#264653', '#2A9D8F', '#E9C46A', '#F4A261'],
          ['#1D3557', '#457B9D', '#F4A261', '#EAE2B7'],
          ['#143642', '#0F8B8D', '#EC9A29', '#F5EE9E']
        ]
      },
      {
        id: 'storybook-neutral',
        name: 'Storybook Neutral',
        description: 'Gender-neutral palette with illustrated story frames.',
        promptTemplate: `Design a storybook {categoryName} invitation for {eventTitle}. 
Use neutral animal characters, scalloped borders, and textured backdrops. 
Outline {detailsBlock} with ribbon tabs. Palette {colorPalette}.`,
        colorScheme: ['#ECE2D0', '#C9ADA7', '#D5B9B2', '#413C58'],
        colorPresets: [
          ['#ECE2D0', '#C9ADA7', '#D5B9B2', '#413C58'],
          ['#F6EFEF', '#CAB7B1', '#BFA2A1', '#4A3B47'],
          ['#F7F1E7', '#CBB8A9', '#9A8C98', '#4B3869']
        ]
      },
      {
        id: 'celestial-dream',
        name: 'Celestial Dream',
        description: 'Moon phases, stardust gradients, and metallic constellations.',
        promptTemplate: `Craft a celestial {categoryName} invitation for {eventTitle}. 
Blend moon motifs, cloud gradients, and foil constellations. 
List {detailsBlock} with dreamy serif + script pairing. Palette {colorPalette}.`,
        colorScheme: ['#1B1F3B', '#7353BA', '#F0E7FF', '#F7B801'],
        colorPresets: [
          ['#1B1F3B', '#7353BA', '#F0E7FF', '#F7B801'],
          ['#0B132B', '#6A4C93', '#D5C6FF', '#F4D160'],
          ['#1A1B41', '#5C5470', '#F2E9E4', '#FFC857']
        ]
      },
      {
        id: 'candy-pop',
        name: 'Candy Pop',
        description: 'Bubble letters, sprinkle textures, and gummy gradients.',
        promptTemplate: `Create a candy-inspired {categoryName} invitation for {eventTitle}. 
Use bubbly typography, sprinkle borders, and pastel gradients. 
Highlight {detailsBlock} with gummy drop labels. Palette {colorPalette}.`,
        colorScheme: ['#FF9AA2', '#FFDAC1', '#E2F0CB', '#C7CEEA'],
        colorPresets: [
          ['#FF9AA2', '#FFDAC1', '#E2F0CB', '#C7CEEA'],
          ['#FFB3C6', '#FFDFD3', '#CAFFBF', '#B9FBC0'],
          ['#FF99C8', '#FCF6BD', '#D0F4DE', '#A9DEF9']
        ]
      }
    ]
  },
  {
    id: 'graduation',
    name: 'Graduation',
    icon: '🎓',
    description: 'Commencement announcements and celebration invites.',
    suggestedAspectRatios: ['3:2', '16:9'],
    styles: [
      {
        id: 'announcement',
        name: 'Announcement',
        description: 'Photo-forward layout with editorial typography.',
        promptTemplate: `Create a polished graduation announcement for {eventTitle}. 
Feature hero portrait area, serif + sans type pairing, and gold foil accents. 
Include academic info ({detailsBlock}). Palette {colorPalette}.`,
        colorScheme: ['#0F172A', '#D97706', '#E2E8F0', '#F8FAFC'],
        colorPresets: [
          ['#0F172A', '#D97706', '#E2E8F0', '#F8FAFC'],
          ['#111827', '#B45309', '#F5F5F5', '#9CA3AF'],
          ['#1F2937', '#E9C46A', '#E5E7EB', '#F8FAFC']
        ]
      },
      {
        id: 'celebration',
        name: 'Celebration Party',
        description: 'Confetti bursts, ribbon streamers, and neon lighting.',
        promptTemplate: `High-energy celebration invite for {eventTitle}. 
Use confetti overlays, neon tubes, and upbeat typography. 
Call out {detailsBlock}. Palette {colorPalette}.`,
        colorScheme: ['#D946EF', '#6366F1', '#14B8A6', '#FDE047'],
        colorPresets: [
          ['#D946EF', '#6366F1', '#14B8A6', '#FDE047'],
          ['#8B5CF6', '#F43F5E', '#10B981', '#FBBF24'],
          ['#EC4899', '#6366F1', '#22D3EE', '#FEF08A']
        ]
      },
      {
        id: 'minimal-grad',
        name: 'Minimal Grad',
        description: 'Clean typographic layout with micro-grid details.',
        promptTemplate: `Minimalist graduation invitation for {eventTitle}. 
Rely on structured grid, thin line illustrations, and grayscale palette with one accent color. 
Feature event info ({detailsBlock}). Palette {colorPalette}.`,
        colorScheme: ['#0B1120', '#CBD5F5', '#475569', '#F8FAFC'],
        colorPresets: [
          ['#0B1120', '#CBD5F5', '#475569', '#F8FAFC'],
          ['#11131E', '#A5B4FC', '#64748B', '#F8FAFC'],
          ['#0F172A', '#E2E8F0', '#475569', '#FFFFFF']
        ]
      },
      {
        id: 'heritage-crest',
        name: 'Heritage Crest',
        description: 'Traditional crest motifs, laurel borders, and archival textures.',
        promptTemplate: `Design a heritage {categoryName} announcement for {eventTitle}. 
Use crest emblems, letterpress textures, and formal serif typography. 
Spotlight {detailsBlock} within ribbon scrolls. Palette {colorPalette}.`,
        colorScheme: ['#1D3557', '#A8DADC', '#F1FAEE', '#E63946'],
        colorPresets: [
          ['#1D3557', '#A8DADC', '#F1FAEE', '#E63946'],
          ['#0B2545', '#8DB4D9', '#F4F1DE', '#C81D25'],
          ['#13293D', '#93A3BC', '#FEFEFA', '#BF4330']
        ]
      },
      {
        id: 'modern-foil-panel',
        name: 'Modern Foil Panel',
        description: 'Split panels with foil outlines and oversized numerals.',
        promptTemplate: `Create a modern {categoryName} invite for {eventTitle}. 
Combine oversized numerals, foil lines, and minimalist type. 
Call out {detailsBlock} inside stacked panels. Palette {colorPalette}.`,
        colorScheme: ['#05070E', '#E5E5E5', '#F4B860', '#AEB8FE'],
        colorPresets: [
          ['#05070E', '#E5E5E5', '#F4B860', '#AEB8FE'],
          ['#111213', '#F7F7F7', '#D4AF37', '#9BA3EB'],
          ['#1E1B18', '#FAFAFA', '#E8B04A', '#B9C0F7']
        ]
      },
      {
        id: 'studio-spotlight',
        name: 'Studio Spotlight',
        description: 'Magazine-style layout with monochrome photography and spotlight lighting.',
        promptTemplate: `Craft a studio spotlight graduation invite for {eventTitle}. 
Use monochrome portraits, light flares, and editorial captions. 
List {detailsBlock} with timeline dots. Palette {colorPalette}.`,
        colorScheme: ['#0E0E0E', '#333333', '#FFD369', '#EEEEEE'],
        colorPresets: [
          ['#0E0E0E', '#333333', '#FFD369', '#EEEEEE'],
          ['#111111', '#2E2E2E', '#F4B400', '#F5F5F5'],
          ['#050505', '#4B4B4B', '#FFC300', '#EDEDED']
        ]
      }
    ]
  },
  {
    id: 'celebration',
    name: 'Celebrations',
    icon: '🎉',
    description: 'Anniversaries, engagements, and housewarming parties.',
    suggestedAspectRatios: ['4:5', '3:2'],
    styles: [
      {
        id: 'anniversary',
        name: 'Anniversary Luxe',
        description: 'Foil-pressed botanicals with layered vellum.',
        promptTemplate: `Elegant anniversary invitation for {eventTitle}. 
Blend etched floral borders, vellum overlay effect, and metallic foil text. 
Showcase {detailsBlock}. Palette {colorPalette}.`,
        colorScheme: ['#78350F', '#F5F5F4', '#B45309', '#FCD34D'],
        colorPresets: [
          ['#78350F', '#F5F5F4', '#B45309', '#FCD34D'],
          ['#4B2E27', '#F7EDE2', '#C68B59', '#FFD26A'],
          ['#5C4033', '#FAF3E0', '#D79A5B', '#F7C873']
        ]
      },
      {
        id: 'engagement',
        name: 'Engagement Modern',
        description: 'Editorial photography with translucent gradients.',
        promptTemplate: `Chic engagement invite for {eventTitle}. 
Combine couple photography area, translucent gradients, and modern serif typography. 
Include {detailsBlock}. Palette {colorPalette}.`,
        colorScheme: ['#FDF2F8', '#DB2777', '#F8FAFC', '#111827'],
        colorPresets: [
          ['#FDF2F8', '#DB2777', '#F8FAFC', '#111827'],
          ['#FDE8F6', '#C026D3', '#FFF5F7', '#0F172A'],
          ['#FFF0F6', '#E11D48', '#F8FAFC', '#111111']
        ]
      },
      {
        id: 'housewarming',
        name: 'Housewarming',
        description: 'Cozy illustrated homes and hand-drawn details.',
        promptTemplate: `Friendly housewarming invite for {eventTitle}. 
Use illustrated architecture, warm textures, and handwritten accents. 
Highlight {detailsBlock}. Palette {colorPalette}.`,
        colorScheme: ['#C084FC', '#FDBA74', '#FED7AA', '#1E1B4B'],
        colorPresets: [
          ['#C084FC', '#FDBA74', '#FED7AA', '#1E1B4B'],
          ['#B39DDB', '#FFB685', '#FFE5D9', '#312E81'],
          ['#A5B4FC', '#FCD5CE', '#FFEAD0', '#2C2A4A']
        ]
      },
      {
        id: 'speakeasy-soiree',
        name: 'Speakeasy Soirée',
        description: 'Moody speakeasy aesthetics with gilded line work.',
        promptTemplate: `Design a speakeasy-inspired {categoryName} invitation for {eventTitle}. 
Use dark velvet textures, deco borders, and cocktail illustrations. 
Highlight {detailsBlock} with ticket-style labels. Palette {colorPalette}.`,
        colorScheme: ['#0B090C', '#8C6A3A', '#F2E9E4', '#2E1F27'],
        colorPresets: [
          ['#0B090C', '#8C6A3A', '#F2E9E4', '#2E1F27'],
          ['#1B1A17', '#C29545', '#EEE2CF', '#3F2E3E'],
          ['#050505', '#CF9F52', '#F5E6C5', '#2A1F2D']
        ]
      },
      {
        id: 'desert-moon',
        name: 'Desert Moon Party',
        description: 'Terracotta gradients, crescent moons, and woven textures.',
        promptTemplate: `Craft a desert-inspired {categoryName} invitation for {eventTitle}. 
Blend terracotta arches, moon icons, and boho typography. 
Showcase {detailsBlock} with woven label motifs. Palette {colorPalette}.`,
        colorScheme: ['#E07A5F', '#F4A259', '#F5D5AE', '#2F3E46'],
        colorPresets: [
          ['#E07A5F', '#F4A259', '#F5D5AE', '#2F3E46'],
          ['#CC704B', '#FFB347', '#FFEBC9', '#4B2E39'],
          ['#D17A22', '#F2CC8F', '#FEF9EF', '#2D3142']
        ]
      },
      {
        id: 'poolside-lounge',
        name: 'Poolside Lounge',
        description: 'Playful Memphis shapes, acrylic waves, and floating typography.',
        promptTemplate: `Design a poolside celebration invite for {eventTitle}. 
Use acrylic wave patterns, floating type, and sunburst gradients. 
Call out {detailsBlock} using buoy tags. Palette {colorPalette}.`,
        colorScheme: ['#00B4D8', '#FFC300', '#FF7B9C', '#1F2041'],
        colorPresets: [
          ['#00B4D8', '#FFC300', '#FF7B9C', '#1F2041'],
          ['#0096C7', '#FFD60A', '#FF5C8D', '#2B2D42'],
          ['#00A7E1', '#F7B801', '#FF6392', '#1C1C3C']
        ]
      }
    ]
  }
];

export function getInvitationCategoryById(id: string): InvitationCategory | undefined {
  return INVITATION_CATEGORIES.find(category => category.id === id);
}

export function getInvitationStyleById(categoryId: string, styleId: string): InvitationStyle | undefined {
  const category = getInvitationCategoryById(categoryId);
  return category?.styles.find(style => style.id === styleId);
}

export function formatEventDetails(details: EventDetails): string {
  const parts: string[] = [];

  if (details.date) parts.push(`Date: ${details.date}`);
  if (details.time) parts.push(`Time: ${details.time}`);
  if (details.location) parts.push(`Location: ${details.location}`);
  if (details.hostName) parts.push(`Host: ${details.hostName}`);
  if (details.rsvpInfo) parts.push(`RSVP: ${details.rsvpInfo}`);
  if (details.moodKeywords) parts.push(`Mood: ${details.moodKeywords}`);
  if (details.dressCode) parts.push(`Dress: ${details.dressCode}`);
  if (details.description) parts.push(`About: ${details.description}`);

  return parts.join(', ');
}
