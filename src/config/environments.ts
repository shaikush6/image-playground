export interface EnvironmentVariation {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
}

export interface EnvironmentCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: 'promotional' | 'lifestyle';
  variations: EnvironmentVariation[];
  suggestedAspectRatios: string[];
}

export const ENVIRONMENT_CATEGORIES: EnvironmentCategory[] = [
  // PROMOTIONAL THEMES (4 categories)
  {
    id: 'ecommerce-catalog',
    name: '🛍️ E-commerce Catalog',
    icon: '🛍️',
    description: 'Professional product photography for online stores',
    type: 'promotional',
    suggestedAspectRatios: ['1:1', '4:5'],
    variations: [
      {
        id: 'clean-white',
        name: 'Clean White Background',
        description: 'Minimal white studio backdrop',
        promptTemplate: 'professional product photography, {product} on pure white background, studio lighting, high-end commercial photography, sharp focus, clean composition, centered product'
      },
      {
        id: 'shadow-depth',
        name: 'With Shadow Depth',
        description: 'White background with natural shadows',
        promptTemplate: 'professional product photography, {product} on white background with soft natural shadow, studio lighting, depth and dimension, commercial quality, clean aesthetic'
      },
      {
        id: 'subtle-gradient',
        name: 'Subtle Gradient',
        description: 'Soft gradient background',
        promptTemplate: 'professional product photography, {product} on subtle gradient background, soft lighting, elegant composition, premium commercial photography, modern aesthetic'
      },
      {
        id: 'floating',
        name: 'Floating Effect',
        description: 'Product appears to float',
        promptTemplate: 'professional product photography, {product} floating in mid-air, white background, dramatic lighting, shadow beneath product, dynamic composition, high-end commercial'
      }
    ]
  },
  {
    id: 'social-media-ad',
    name: '📱 Social Media Ad',
    icon: '📱',
    description: 'Instagram and TikTok optimized promotional content',
    type: 'promotional',
    suggestedAspectRatios: ['9:16', '1:1', '4:5'],
    variations: [
      {
        id: 'lifestyle-flat-lay',
        name: 'Lifestyle Flat Lay',
        description: 'Top-down styled scene',
        promptTemplate: 'social media product photography, {product} in lifestyle flat lay composition, styled with complementary items, natural lighting, Instagram aesthetic, vibrant and engaging'
      },
      {
        id: 'hands-interaction',
        name: 'In-Hand Interaction',
        description: 'Hands holding or using product',
        promptTemplate: 'social media content, hands elegantly holding {product}, lifestyle photography, natural interaction, aesthetic composition, warm lighting, relatable and authentic'
      },
      {
        id: 'colorful-backdrop',
        name: 'Colorful Backdrop',
        description: 'Bold colored background',
        promptTemplate: 'social media product ad, {product} against vibrant colored backdrop, bold and eye-catching, modern aesthetic, perfect lighting, scroll-stopping composition'
      },
      {
        id: 'minimal-modern',
        name: 'Minimal Modern',
        description: 'Clean contemporary style',
        promptTemplate: 'modern social media content, {product} in minimal contemporary setting, clean lines, trendy aesthetic, soft natural light, Instagram-worthy composition'
      }
    ]
  },
  {
    id: 'magazine-editorial',
    name: '📰 Magazine Editorial',
    icon: '📰',
    description: 'High-fashion editorial style photography',
    type: 'promotional',
    suggestedAspectRatios: ['2:3', '4:5'],
    variations: [
      {
        id: 'high-fashion',
        name: 'High Fashion',
        description: 'Sophisticated editorial style',
        promptTemplate: 'high-fashion editorial photography, {product} in sophisticated artistic composition, dramatic lighting, luxury aesthetic, magazine quality, cinematic mood'
      },
      {
        id: 'artistic-moody',
        name: 'Artistic & Moody',
        description: 'Dark artistic composition',
        promptTemplate: 'artistic editorial photography, {product} in moody atmospheric setting, dramatic shadows, artistic composition, magazine editorial style, sophisticated lighting'
      },
      {
        id: 'bright-airy',
        name: 'Bright & Airy',
        description: 'Light elegant editorial',
        promptTemplate: 'bright editorial photography, {product} in airy elegant composition, soft natural light, minimalist aesthetic, magazine quality, refined and sophisticated'
      },
      {
        id: 'creative-concept',
        name: 'Creative Concept',
        description: 'Unique artistic vision',
        promptTemplate: 'creative editorial photography, {product} in unique artistic concept, innovative composition, striking visual, magazine cover quality, memorable and distinctive'
      }
    ]
  },
  {
    id: 'tv-commercial',
    name: '📺 TV Commercial',
    icon: '📺',
    description: 'Cinematic advertising photography',
    type: 'promotional',
    suggestedAspectRatios: ['16:9', '21:9'],
    variations: [
      {
        id: 'hero-shot',
        name: 'Hero Shot',
        description: 'Dramatic spotlight on product',
        promptTemplate: 'cinematic commercial photography, {product} as hero shot, dramatic lighting, advertising quality, professional production, spotlight effect, premium aesthetic'
      },
      {
        id: 'lifestyle-cinematic',
        name: 'Lifestyle Cinematic',
        description: 'Cinematic lifestyle scene',
        promptTemplate: 'cinematic lifestyle commercial, {product} in beautiful lifestyle scene, movie-quality lighting, advertising photography, emotional storytelling, premium production value'
      },
      {
        id: 'motion-blur',
        name: 'Dynamic Motion',
        description: 'Movement and energy',
        promptTemplate: 'dynamic commercial photography, {product} with sense of motion and energy, cinematic composition, advertising quality, dramatic lighting, action-oriented'
      },
      {
        id: 'luxury-showcase',
        name: 'Luxury Showcase',
        description: 'Premium luxury presentation',
        promptTemplate: 'luxury commercial photography, {product} in premium showcase, sophisticated lighting, high-end advertising, elegant composition, aspirational aesthetic'
      }
    ]
  },

  // LIFESTYLE ENVIRONMENTS (8 categories)
  {
    id: 'home-interior',
    name: '🏠 Home Interior',
    icon: '🏠',
    description: 'Cozy home and living space settings',
    type: 'lifestyle',
    suggestedAspectRatios: ['16:9', '4:3', '1:1'],
    variations: [
      {
        id: 'living-room',
        name: 'Living Room',
        description: 'Comfortable living space',
        promptTemplate: 'lifestyle photography, {product} in modern cozy living room, natural window light, comfortable home interior, warm atmosphere, realistic home setting'
      },
      {
        id: 'bedroom',
        name: 'Bedroom',
        description: 'Peaceful bedroom scene',
        promptTemplate: 'lifestyle photography, {product} in serene bedroom setting, soft morning light, peaceful atmosphere, comfortable home interior, intimate and relaxing'
      },
      {
        id: 'kitchen',
        name: 'Kitchen',
        description: 'Functional kitchen space',
        promptTemplate: 'lifestyle photography, {product} in bright modern kitchen, natural lighting, clean and functional space, home interior, everyday life setting'
      },
      {
        id: 'home-office',
        name: 'Home Office',
        description: 'Productive workspace',
        promptTemplate: 'lifestyle photography, {product} in organized home office, natural desk lighting, productive workspace, contemporary interior, work-from-home aesthetic'
      }
    ]
  },
  {
    id: 'outdoor-adventure',
    name: '🌳 Outdoor Adventure',
    icon: '🌳',
    description: 'Natural outdoor and adventure settings',
    type: 'lifestyle',
    suggestedAspectRatios: ['16:9', '3:2', '9:16'],
    variations: [
      {
        id: 'beach',
        name: 'Beach Scene',
        description: 'Sunny beach environment',
        promptTemplate: 'outdoor lifestyle photography, {product} at beautiful beach, golden hour sunlight, ocean in background, summer vibes, vacation aesthetic, natural outdoor setting'
      },
      {
        id: 'park',
        name: 'Park Setting',
        description: 'Green park environment',
        promptTemplate: 'outdoor lifestyle photography, {product} in lush green park, natural daylight, trees and nature, peaceful outdoor setting, fresh and natural'
      },
      {
        id: 'street',
        name: 'Urban Street',
        description: 'City street scene',
        promptTemplate: 'urban lifestyle photography, {product} on city street, modern architecture background, natural daylight, metropolitan vibe, contemporary urban setting'
      },
      {
        id: 'mountain',
        name: 'Mountain/Nature',
        description: 'Scenic nature backdrop',
        promptTemplate: 'outdoor adventure photography, {product} with mountain landscape, natural scenic background, adventure aesthetic, beautiful nature setting, inspiring outdoor scene'
      }
    ]
  },
  {
    id: 'professional-setting',
    name: '💼 Professional Setting',
    icon: '💼',
    description: 'Business and office environments',
    type: 'lifestyle',
    suggestedAspectRatios: ['16:9', '4:3'],
    variations: [
      {
        id: 'office',
        name: 'Modern Office',
        description: 'Professional workspace',
        promptTemplate: 'professional lifestyle photography, {product} in modern office environment, business setting, professional lighting, corporate aesthetic, clean and organized'
      },
      {
        id: 'conference',
        name: 'Conference Room',
        description: 'Meeting room setting',
        promptTemplate: 'business photography, {product} in conference room, professional meeting setting, business environment, corporate lighting, professional aesthetic'
      },
      {
        id: 'co-working',
        name: 'Co-Working Space',
        description: 'Contemporary shared workspace',
        promptTemplate: 'modern workplace photography, {product} in stylish co-working space, contemporary office design, collaborative environment, trendy professional setting'
      },
      {
        id: 'desk-setup',
        name: 'Desk Setup',
        description: 'Organized work desk',
        promptTemplate: 'professional desk photography, {product} on organized work desk, business workspace, professional setup, clean and efficient, work-life aesthetic'
      }
    ]
  },
  {
    id: 'cafe-restaurant',
    name: '☕ Cafe/Restaurant',
    icon: '☕',
    description: 'Social dining and cafe atmospheres',
    type: 'lifestyle',
    suggestedAspectRatios: ['1:1', '4:5', '16:9'],
    variations: [
      {
        id: 'coffee-shop',
        name: 'Coffee Shop',
        description: 'Cozy cafe setting',
        promptTemplate: 'lifestyle photography, {product} in cozy coffee shop, warm cafe lighting, casual social atmosphere, coffee culture aesthetic, inviting and comfortable'
      },
      {
        id: 'restaurant',
        name: 'Restaurant',
        description: 'Dining environment',
        promptTemplate: 'lifestyle dining photography, {product} in elegant restaurant setting, ambient lighting, dining atmosphere, social gathering, upscale casual'
      },
      {
        id: 'outdoor-patio',
        name: 'Outdoor Patio',
        description: 'Outdoor dining area',
        promptTemplate: 'outdoor dining photography, {product} on restaurant patio, natural daylight, outdoor dining atmosphere, fresh air setting, casual and relaxed'
      },
      {
        id: 'breakfast-table',
        name: 'Breakfast Table',
        description: 'Morning dining scene',
        promptTemplate: 'morning lifestyle photography, {product} at breakfast table, soft morning light, fresh start aesthetic, casual dining scene, warm and inviting'
      }
    ]
  },
  {
    id: 'seasonal-context',
    name: '🍂 Seasonal Context',
    icon: '🍂',
    description: 'Season-specific atmospheric settings',
    type: 'lifestyle',
    suggestedAspectRatios: ['16:9', '1:1', '9:16'],
    variations: [
      {
        id: 'summer',
        name: 'Summer Vibes',
        description: 'Bright sunny atmosphere',
        promptTemplate: 'summer lifestyle photography, {product} in bright summer setting, warm sunlight, vibrant colors, summer season aesthetic, energetic and fresh'
      },
      {
        id: 'autumn',
        name: 'Autumn Aesthetic',
        description: 'Warm fall colors',
        promptTemplate: 'autumn lifestyle photography, {product} in fall setting, warm autumn colors, cozy atmosphere, seasonal aesthetic, golden hour lighting'
      },
      {
        id: 'winter-cozy',
        name: 'Winter Cozy',
        description: 'Warm winter scene',
        promptTemplate: 'winter lifestyle photography, {product} in cozy winter setting, warm indoor lighting, cold weather aesthetic, comfort and warmth, seasonal atmosphere'
      },
      {
        id: 'spring-fresh',
        name: 'Spring Fresh',
        description: 'Fresh spring scene',
        promptTemplate: 'spring lifestyle photography, {product} in fresh spring setting, natural light, blooming flowers, renewal aesthetic, bright and optimistic'
      }
    ]
  },
  {
    id: 'event-celebration',
    name: '🎉 Event Celebration',
    icon: '🎉',
    description: 'Special occasions and celebrations',
    type: 'lifestyle',
    suggestedAspectRatios: ['16:9', '1:1', '9:16'],
    variations: [
      {
        id: 'party',
        name: 'Party Scene',
        description: 'Festive celebration',
        promptTemplate: 'celebration photography, {product} at lively party, festive lighting, joyful atmosphere, celebration aesthetic, fun and energetic'
      },
      {
        id: 'wedding',
        name: 'Wedding Elegance',
        description: 'Elegant wedding setting',
        promptTemplate: 'wedding photography, {product} in elegant wedding setting, romantic lighting, sophisticated celebration, special occasion aesthetic, refined and beautiful'
      },
      {
        id: 'concert',
        name: 'Concert/Event',
        description: 'Live event atmosphere',
        promptTemplate: 'event photography, {product} at concert or live event, dynamic lighting, energetic atmosphere, entertainment setting, vibrant and exciting'
      },
      {
        id: 'holiday',
        name: 'Holiday Gathering',
        description: 'Festive holiday scene',
        promptTemplate: 'holiday photography, {product} at festive holiday gathering, warm celebratory lighting, special occasion atmosphere, joyful and festive'
      }
    ]
  },
  {
    id: 'fitness-active',
    name: '💪 Fitness/Active',
    icon: '💪',
    description: 'Sport and wellness environments',
    type: 'lifestyle',
    suggestedAspectRatios: ['9:16', '16:9', '1:1'],
    variations: [
      {
        id: 'gym',
        name: 'Gym Environment',
        description: 'Fitness facility',
        promptTemplate: 'fitness photography, {product} in modern gym, athletic lighting, workout environment, active lifestyle aesthetic, energetic and motivating'
      },
      {
        id: 'yoga',
        name: 'Yoga/Wellness',
        description: 'Peaceful wellness space',
        promptTemplate: 'wellness photography, {product} in serene yoga studio, soft natural light, peaceful wellness environment, mindful aesthetic, calm and balanced'
      },
      {
        id: 'outdoor-sport',
        name: 'Outdoor Sport',
        description: 'Outdoor athletic activity',
        promptTemplate: 'sports photography, {product} during outdoor athletic activity, natural daylight, active lifestyle, dynamic sport setting, energetic and inspiring'
      },
      {
        id: 'running',
        name: 'Running/Jogging',
        description: 'Active running scene',
        promptTemplate: 'active lifestyle photography, {product} during running or jogging, outdoor setting, morning light, athletic aesthetic, movement and energy'
      }
    ]
  },
  {
    id: 'travel-vacation',
    name: '✈️ Travel/Vacation',
    icon: '✈️',
    description: 'Travel and destination settings',
    type: 'lifestyle',
    suggestedAspectRatios: ['16:9', '3:2', '9:16'],
    variations: [
      {
        id: 'hotel',
        name: 'Hotel Room',
        description: 'Luxury hotel setting',
        promptTemplate: 'travel photography, {product} in luxury hotel room, elegant interior, vacation atmosphere, hospitality aesthetic, comfortable and upscale'
      },
      {
        id: 'resort',
        name: 'Resort/Pool',
        description: 'Resort poolside scene',
        promptTemplate: 'vacation photography, {product} at beautiful resort, poolside setting, tropical atmosphere, relaxation aesthetic, luxury vacation vibe'
      },
      {
        id: 'sightseeing',
        name: 'Sightseeing',
        description: 'Tourist destination',
        promptTemplate: 'travel photography, {product} at famous landmark or tourist destination, cultural setting, exploration aesthetic, adventure and discovery'
      },
      {
        id: 'airplane',
        name: 'Travel/Airplane',
        description: 'In-flight or airport',
        promptTemplate: 'travel photography, {product} during air travel, airplane or airport setting, journey aesthetic, modern travel lifestyle, adventure awaits'
      }
    ]
  }
];

// Helper function to get category by ID
export function getCategoryById(id: string): EnvironmentCategory | undefined {
  return ENVIRONMENT_CATEGORIES.find(cat => cat.id === id);
}

// Helper function to get variation by category and variation ID
export function getVariationById(categoryId: string, variationId: string): EnvironmentVariation | undefined {
  const category = getCategoryById(categoryId);
  return category?.variations.find(v => v.id === variationId);
}

// Helper function to filter by type
export function getCategoriesByType(type: 'promotional' | 'lifestyle'): EnvironmentCategory[] {
  return ENVIRONMENT_CATEGORIES.filter(cat => cat.type === type);
}
