'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreativeCustomizations } from '@/lib/agents';

interface CustomizationPanelProps {
  selectedPath: string;
  customizations: CreativeCustomizations;
  onCustomizationChange: (customizations: CreativeCustomizations) => void;
}

export function CustomizationPanel({ selectedPath, customizations, onCustomizationChange }: CustomizationPanelProps) {
  const updateCustomization = (key: string, value: string | string[]) => {
    onCustomizationChange({
      ...customizations,
      [key]: value
    });
  };

  const renderCookingCustomizations = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="dish_type">Dish Type</Label>
        <Select value={customizations.dish_type || "Chef's choice"} onValueChange={(value) => updateCustomization('dish_type', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Chef's choice">Chef&apos;s choice</SelectItem>
            <SelectItem value="Appetizer/Starter">Appetizer/Starter</SelectItem>
            <SelectItem value="Main Course (Meat)">Main Course (Meat)</SelectItem>
            <SelectItem value="Main Course (Fish)">Main Course (Fish)</SelectItem>
            <SelectItem value="Main Course (Vegetarian/Vegan)">Main Course (Vegetarian/Vegan)</SelectItem>
            <SelectItem value="Soup">Soup</SelectItem>
            <SelectItem value="Salad">Salad</SelectItem>
            <SelectItem value="Side Dish">Side Dish</SelectItem>
            <SelectItem value="Dessert">Dessert</SelectItem>
            <SelectItem value="Pastry/Baked Good">Pastry/Baked Good</SelectItem>
            <SelectItem value="Cocktail/Drink">Cocktail/Drink</SelectItem>
            <SelectItem value="Snack">Snack</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="primary_cooking_method">Primary Cooking Method</Label>
        <Select value={customizations.primary_cooking_method || "Any"} onValueChange={(value) => updateCustomization('primary_cooking_method', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Roasted">Roasted</SelectItem>
            <SelectItem value="Grilled">Grilled</SelectItem>
            <SelectItem value="Sautéed">Sautéed</SelectItem>
            <SelectItem value="Fried">Fried</SelectItem>
            <SelectItem value="Baked">Baked</SelectItem>
            <SelectItem value="Steamed">Steamed</SelectItem>
            <SelectItem value="Raw/Ceviche">Raw/Ceviche</SelectItem>
            <SelectItem value="Sous-vide">Sous-vide</SelectItem>
            <SelectItem value="Braised/Stewed">Braised/Stewed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="complexity">Complexity/Skill Level</Label>
        <Select value={customizations.complexity || "Any"} onValueChange={(value) => updateCustomization('complexity', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Quick & Easy (Beginner)">Quick & Easy (Beginner)</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced/Gourmet">Advanced/Gourmet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="cuisine_style">Specific Cuisine Inspiration (Optional)</Label>
        <Input
          placeholder="e.g., Modern French, Japanese Fusion"
          value={customizations.cuisine_style || ""}
          onChange={(e) => updateCustomization('cuisine_style', e.target.value)}
        />
      </div>

      <div>
        <Label>Dietary Considerations</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {["None", "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Nut-Free", "Low-Carb"].map((diet) => (
            <Badge
              key={diet}
              variant={customizations.dietary_needs?.includes(diet) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                const current = customizations.dietary_needs || [];
                const updated = current.includes(diet)
                  ? current.filter(d => d !== diet)
                  : [...current, diet];
                updateCustomization('dietary_needs', updated);
              }}
            >
              {diet}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFashionCustomizations = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="style_preference">Outfit Style</Label>
        <Select value={customizations.style_preference || "Any"} onValueChange={(value) => updateCustomization('style_preference', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Casual Chic">Casual Chic</SelectItem>
            <SelectItem value="Streetwear">Streetwear</SelectItem>
            <SelectItem value="Minimalist">Minimalist</SelectItem>
            <SelectItem value="Bohemian">Bohemian</SelectItem>
            <SelectItem value="Preppy">Preppy</SelectItem>
            <SelectItem value="Glamorous">Glamorous</SelectItem>
            <SelectItem value="Formal/Black Tie">Formal/Black Tie</SelectItem>
            <SelectItem value="Business Professional">Business Professional</SelectItem>
            <SelectItem value="Artistic/Avant-Garde">Artistic/Avant-Garde</SelectItem>
            <SelectItem value="Vintage-Inspired">Vintage-Inspired</SelectItem>
            <SelectItem value="Sporty/Athleisure">Sporty/Athleisure</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="key_garment">Key Garment Focus</Label>
        <Select value={customizations.key_garment || "Any"} onValueChange={(value) => updateCustomization('key_garment', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Dress">Dress</SelectItem>
            <SelectItem value="Top & Bottoms">Top & Bottoms</SelectItem>
            <SelectItem value="Outerwear (Coat/Jacket)">Outerwear (Coat/Jacket)</SelectItem>
            <SelectItem value="Jumpsuit/Romper">Jumpsuit/Romper</SelectItem>
            <SelectItem value="Suiting">Suiting</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="fabric_texture">Fabric/Texture Emphasis</Label>
        <Select value={customizations.fabric_texture || "Any"} onValueChange={(value) => updateCustomization('fabric_texture', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Silks/Satins">Silks/Satins</SelectItem>
            <SelectItem value="Denim">Denim</SelectItem>
            <SelectItem value="Leather/Faux Leather">Leather/Faux Leather</SelectItem>
            <SelectItem value="Knits (Chunky/Fine)">Knits (Chunky/Fine)</SelectItem>
            <SelectItem value="Linen/Cotton">Linen/Cotton</SelectItem>
            <SelectItem value="Velvet">Velvet</SelectItem>
            <SelectItem value="Sheer/Lace">Sheer/Lace</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="season">Target Season/Climate</Label>
        <Select value={customizations.season || "Any"} onValueChange={(value) => updateCustomization('season', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Spring">Spring</SelectItem>
            <SelectItem value="Summer">Summer</SelectItem>
            <SelectItem value="Autumn">Autumn</SelectItem>
            <SelectItem value="Winter">Winter</SelectItem>
            <SelectItem value="Warm Climate">Warm Climate</SelectItem>
            <SelectItem value="Cool Climate">Cool Climate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="audience">Target Audience/Fit</Label>
        <Select value={customizations.audience || "Any"} onValueChange={(value) => updateCustomization('audience', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Womenswear">Womenswear</SelectItem>
            <SelectItem value="Menswear">Menswear</SelectItem>
            <SelectItem value="Gender Neutral">Gender Neutral</SelectItem>
            <SelectItem value="Relaxed Fit">Relaxed Fit</SelectItem>
            <SelectItem value="Tailored Fit">Tailored Fit</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderInteriorCustomizations = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="room_type">Room Type</Label>
        <Select value={customizations.room_type || "Any"} onValueChange={(value) => updateCustomization('room_type', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Living Room">Living Room</SelectItem>
            <SelectItem value="Dining Room">Dining Room</SelectItem>
            <SelectItem value="Bedroom">Bedroom</SelectItem>
            <SelectItem value="Kitchen">Kitchen</SelectItem>
            <SelectItem value="Bathroom">Bathroom</SelectItem>
            <SelectItem value="Home Office">Home Office</SelectItem>
            <SelectItem value="Entryway/Foyer">Entryway/Foyer</SelectItem>
            <SelectItem value="Nursery/Kids Room">Nursery/Kids Room</SelectItem>
            <SelectItem value="Outdoor Patio/Balcony">Outdoor Patio/Balcony</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="design_style">Core Design Style</Label>
        <Select value={customizations.design_style || "Any"} onValueChange={(value) => updateCustomization('design_style', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Modern">Modern</SelectItem>
            <SelectItem value="Contemporary">Contemporary</SelectItem>
            <SelectItem value="Minimalist">Minimalist</SelectItem>
            <SelectItem value="Scandinavian">Scandinavian</SelectItem>
            <SelectItem value="Industrial">Industrial</SelectItem>
            <SelectItem value="Traditional">Traditional</SelectItem>
            <SelectItem value="Transitional">Transitional</SelectItem>
            <SelectItem value="Bohemian">Bohemian</SelectItem>
            <SelectItem value="Farmhouse/Rustic">Farmhouse/Rustic</SelectItem>
            <SelectItem value="Coastal/Hamptons">Coastal/Hamptons</SelectItem>
            <SelectItem value="Mid-Century Modern">Mid-Century Modern</SelectItem>
            <SelectItem value="Art Deco">Art Deco</SelectItem>
            <SelectItem value="Maximalist">Maximalist</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="mood">Desired Mood/Atmosphere</Label>
        <Select value={customizations.mood || "Any"} onValueChange={(value) => updateCustomization('mood', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Calm & Serene">Calm & Serene</SelectItem>
            <SelectItem value="Cozy & Inviting">Cozy & Inviting</SelectItem>
            <SelectItem value="Bright & Airy">Bright & Airy</SelectItem>
            <SelectItem value="Energetic & Vibrant">Energetic & Vibrant</SelectItem>
            <SelectItem value="Sophisticated & Elegant">Sophisticated & Elegant</SelectItem>
            <SelectItem value="Playful & Creative">Playful & Creative</SelectItem>
            <SelectItem value="Dramatic & Moody">Dramatic & Moody</SelectItem>
            <SelectItem value="Natural & Organic">Natural & Organic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="material_focus">Key Material Focus</Label>
        <Select value={customizations.material_focus || "Any"} onValueChange={(value) => updateCustomization('material_focus', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Wood (Light/Dark)">Wood (Light/Dark)</SelectItem>
            <SelectItem value="Metals (Gold/Silver/Brass/Black)">Metals (Gold/Silver/Brass/Black)</SelectItem>
            <SelectItem value="Stone/Marble">Stone/Marble</SelectItem>
            <SelectItem value="Concrete">Concrete</SelectItem>
            <SelectItem value="Glass">Glass</SelectItem>
            <SelectItem value="Natural Fibers (Rattan/Jute)">Natural Fibers (Rattan/Jute)</SelectItem>
            <SelectItem value="Plush Textiles">Plush Textiles</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="budget_indication">Budget Indication</Label>
        <Select value={customizations.budget_indication || "Any"} onValueChange={(value) => updateCustomization('budget_indication', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Budget-Friendly / DIY Focus">Budget-Friendly / DIY Focus</SelectItem>
            <SelectItem value="Mid-Range">Mid-Range</SelectItem>
            <SelectItem value="High-End / Luxury">High-End / Luxury</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderArtCraftCustomizations = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="medium">Primary Medium</Label>
        <Select value={customizations.medium || "Any"} onValueChange={(value) => updateCustomization('medium', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Painting (Oil)">Painting (Oil)</SelectItem>
            <SelectItem value="Painting (Acrylic)">Painting (Acrylic)</SelectItem>
            <SelectItem value="Watercolor">Watercolor</SelectItem>
            <SelectItem value="Digital Painting/Illustration">Digital Painting/Illustration</SelectItem>
            <SelectItem value="Drawing (Pencil/Charcoal/Ink)">Drawing (Pencil/Charcoal/Ink)</SelectItem>
            <SelectItem value="Sculpture (Clay/Wood/Metal)">Sculpture (Clay/Wood/Metal)</SelectItem>
            <SelectItem value="Textile Art (Weaving/Embroidery/Quilting)">Textile Art (Weaving/Embroidery/Quilting)</SelectItem>
            <SelectItem value="Knitting/Crochet">Knitting/Crochet</SelectItem>
            <SelectItem value="Printmaking">Printmaking</SelectItem>
            <SelectItem value="Mixed Media">Mixed Media</SelectItem>
            <SelectItem value="Photography (Conceptual)">Photography (Conceptual)</SelectItem>
            <SelectItem value="Ceramics/Pottery Glazing">Ceramics/Pottery Glazing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="artistic_style">Artistic Style/Movement</Label>
        <Select value={customizations.artistic_style || "Any"} onValueChange={(value) => updateCustomization('artistic_style', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Abstract Expressionism">Abstract Expressionism</SelectItem>
            <SelectItem value="Impressionism">Impressionism</SelectItem>
            <SelectItem value="Surrealism">Surrealism</SelectItem>
            <SelectItem value="Realism/Hyperrealism">Realism/Hyperrealism</SelectItem>
            <SelectItem value="Geometric Abstraction">Geometric Abstraction</SelectItem>
            <SelectItem value="Figurative">Figurative</SelectItem>
            <SelectItem value="Minimalism">Minimalism</SelectItem>
            <SelectItem value="Pop Art Inspired">Pop Art Inspired</SelectItem>
            <SelectItem value="Folk Art/Naive Style">Folk Art/Naive Style</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="subject_matter">Subject Matter Focus</Label>
        <Select value={customizations.subject_matter || "Any"} onValueChange={(value) => updateCustomization('subject_matter', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Landscape/Seascape">Landscape/Seascape</SelectItem>
            <SelectItem value="Portraiture">Portraiture</SelectItem>
            <SelectItem value="Still Life">Still Life</SelectItem>
            <SelectItem value="Abstract Forms/Textures">Abstract Forms/Textures</SelectItem>
            <SelectItem value="Narrative/Storytelling">Narrative/Storytelling</SelectItem>
            <SelectItem value="Pattern/Repetition">Pattern/Repetition</SelectItem>
            <SelectItem value="Conceptual">Conceptual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="composition">Composition Emphasis</Label>
        <Select value={customizations.composition || "Any"} onValueChange={(value) => updateCustomization('composition', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Symmetrical Balance">Symmetrical Balance</SelectItem>
            <SelectItem value="Asymmetrical Balance">Asymmetrical Balance</SelectItem>
            <SelectItem value="Rule of Thirds">Rule of Thirds</SelectItem>
            <SelectItem value="Dynamic Movement">Dynamic Movement</SelectItem>
            <SelectItem value="Strong Focal Point">Strong Focal Point</SelectItem>
            <SelectItem value="Negative Space Focus">Negative Space Focus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="emotion">Emotional Tone</Label>
        <Select value={customizations.emotion || "Any"} onValueChange={(value) => updateCustomization('emotion', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Joyful/Uplifting">Joyful/Uplifting</SelectItem>
            <SelectItem value="Mysterious/Intriguing">Mysterious/Intriguing</SelectItem>
            <SelectItem value="Calm/Peaceful">Calm/Peaceful</SelectItem>
            <SelectItem value="Energetic/Chaotic">Energetic/Chaotic</SelectItem>
            <SelectItem value="Nostalgic/Melancholic">Nostalgic/Melancholic</SelectItem>
            <SelectItem value="Whimsical/Playful">Whimsical/Playful</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderMakeupCustomizations = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="look_style">Overall Look Style</Label>
        <Select value={customizations.look_style || "Any"} onValueChange={(value) => updateCustomization('look_style', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Natural / 'No-Makeup' Makeup">Natural / &apos;No-Makeup&apos; Makeup</SelectItem>
            <SelectItem value="Everyday Enhancing">Everyday Enhancing</SelectItem>
            <SelectItem value="Soft Glam">Soft Glam</SelectItem>
            <SelectItem value="Full Glam / Evening">Full Glam / Evening</SelectItem>
            <SelectItem value="Bold & Graphic">Bold & Graphic</SelectItem>
            <SelectItem value="Editorial / Avant-Garde">Editorial / Avant-Garde</SelectItem>
            <SelectItem value="Monochromatic">Monochromatic</SelectItem>
            <SelectItem value="Glowy / Dewy Focus">Glowy / Dewy Focus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="feature_focus">Primary Feature Focus</Label>
        <Select value={customizations.feature_focus || "Any"} onValueChange={(value) => updateCustomization('feature_focus', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Eyes (Defined/Smokey/Graphic Liner)">Eyes (Defined/Smokey/Graphic Liner)</SelectItem>
            <SelectItem value="Lips (Bold/Nude/Glossy)">Lips (Bold/Nude/Glossy)</SelectItem>
            <SelectItem value="Skin Finish (Matte/Radiant)">Skin Finish (Matte/Radiant)</SelectItem>
            <SelectItem value="Balanced Overall">Balanced Overall</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="eye_complexity">Eye Makeup Complexity</Label>
        <Select value={customizations.eye_complexity || "Any"} onValueChange={(value) => updateCustomization('eye_complexity', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Simple Wash of Color">Simple Wash of Color</SelectItem>
            <SelectItem value="Defined Crease & Lid">Defined Crease & Lid</SelectItem>
            <SelectItem value="Smokey Eye (Classic/Colored)">Smokey Eye (Classic/Colored)</SelectItem>
            <SelectItem value="Cut Crease">Cut Crease</SelectItem>
            <SelectItem value="Graphic Liner">Graphic Liner</SelectItem>
            <SelectItem value="Halo Eye">Halo Eye</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="lip_finish">Lip Finish Preference</Label>
        <Select value={customizations.lip_finish || "Any"} onValueChange={(value) => updateCustomization('lip_finish', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Matte">Matte</SelectItem>
            <SelectItem value="Satin/Cream">Satin/Cream</SelectItem>
            <SelectItem value="Glossy">Glossy</SelectItem>
            <SelectItem value="Stain">Stain</SelectItem>
            <SelectItem value="Metallic">Metallic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="inspired_by">Inspired By</Label>
        <Select value={customizations.inspired_by || "Any"} onValueChange={(value) => updateCustomization('inspired_by', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Nature (e.g., Sunset, Forest)">Nature (e.g., Sunset, Forest)</SelectItem>
            <SelectItem value="Art Movement">Art Movement</SelectItem>
            <SelectItem value="Geometric Shapes">Geometric Shapes</SelectItem>
            <SelectItem value="Texture (e.g., Velvet, Metal)">Texture (e.g., Velvet, Metal)</SelectItem>
            <SelectItem value="Era (e.g., 90s Grunge, 60s Mod)">Era (e.g., 90s Grunge, 60s Mod)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderEventCustomizations = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="event_type">Event Type</Label>
        <Select value={customizations.event_type || "Any"} onValueChange={(value) => updateCustomization('event_type', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Birthday Party (Adult/Child)">Birthday Party (Adult/Child)</SelectItem>
            <SelectItem value="Wedding Reception">Wedding Reception</SelectItem>
            <SelectItem value="Engagement Party">Engagement Party</SelectItem>
            <SelectItem value="Baby Shower">Baby Shower</SelectItem>
            <SelectItem value="Dinner Party">Dinner Party</SelectItem>
            <SelectItem value="Cocktail Party">Cocktail Party</SelectItem>
            <SelectItem value="Corporate Gala/Networking">Corporate Gala/Networking</SelectItem>
            <SelectItem value="Product Launch">Product Launch</SelectItem>
            <SelectItem value="Themed Gathering (e.g., Movie Night, Book Club)">Themed Gathering (e.g., Movie Night, Book Club)</SelectItem>
            <SelectItem value="Holiday Celebration">Holiday Celebration</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="core_theme">Core Theme/Concept</Label>
        <Select value={customizations.core_theme || "Any"} onValueChange={(value) => updateCustomization('core_theme', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Enchanted Forest">Enchanted Forest</SelectItem>
            <SelectItem value="Starry Night / Celestial">Starry Night / Celestial</SelectItem>
            <SelectItem value="Tropical Paradise / Luau">Tropical Paradise / Luau</SelectItem>
            <SelectItem value="Vintage Circus / Carnival">Vintage Circus / Carnival</SelectItem>
            <SelectItem value="Roaring Twenties / Great Gatsby">Roaring Twenties / Great Gatsby</SelectItem>
            <SelectItem value="Urban Industrial Chic">Urban Industrial Chic</SelectItem>
            <SelectItem value="Mediterranean Escape">Mediterranean Escape</SelectItem>
            <SelectItem value="Mystical Masquerade">Mystical Masquerade</SelectItem>
            <SelectItem value="Color Block Party">Color Block Party</SelectItem>
            <SelectItem value="Literary / Storybook">Literary / Storybook</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="formality">Formality Level</Label>
        <Select value={customizations.formality || "Any"} onValueChange={(value) => updateCustomization('formality', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Casual / Relaxed">Casual / Relaxed</SelectItem>
            <SelectItem value="Semi-Formal / Cocktail Attire">Semi-Formal / Cocktail Attire</SelectItem>
            <SelectItem value="Formal / Black Tie Optional">Formal / Black Tie Optional</SelectItem>
            <SelectItem value="Black Tie / Gala">Black Tie / Gala</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="decor_focus">Key Decor Element Focus</Label>
        <Select value={customizations.decor_focus || "Any"} onValueChange={(value) => updateCustomization('decor_focus', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Floral Arrangements">Floral Arrangements</SelectItem>
            <SelectItem value="Lighting Design (Uplighting, String Lights, Candles)">Lighting Design (Uplighting, String Lights, Candles)</SelectItem>
            <SelectItem value="Table Settings / Centerpieces">Table Settings / Centerpieces</SelectItem>
            <SelectItem value="Draping / Backdrops">Draping / Backdrops</SelectItem>
            <SelectItem value="Balloons / Installations">Balloons / Installations</SelectItem>
            <SelectItem value="Signage / Stationery">Signage / Stationery</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="experience">Desired Guest Experience</Label>
        <Select value={customizations.experience || "Any"} onValueChange={(value) => updateCustomization('experience', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Interactive & Fun">Interactive & Fun</SelectItem>
            <SelectItem value="Elegant & Sophisticated">Elegant & Sophisticated</SelectItem>
            <SelectItem value="Intimate & Cozy">Intimate & Cozy</SelectItem>
            <SelectItem value="High Energy & Celebratory">High Energy & Celebratory</SelectItem>
            <SelectItem value="Relaxed & Conversational">Relaxed & Conversational</SelectItem>
            <SelectItem value="Immersive & Theatrical">Immersive & Theatrical</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderDesignCustomizations = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="application">Primary Application</Label>
        <Select value={customizations.application || "Any"} onValueChange={(value) => updateCustomization('application', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Website UI (e.g., SaaS, Blog, Portfolio, E-commerce)">Website UI (e.g., SaaS, Blog, Portfolio, E-commerce)</SelectItem>
            <SelectItem value="Mobile App UI">Mobile App UI</SelectItem>
            <SelectItem value="Brand Identity System (Logo, Guidelines)">Brand Identity System (Logo, Guidelines)</SelectItem>
            <SelectItem value="Marketing Campaign Assets (Social Media, Ads)">Marketing Campaign Assets (Social Media, Ads)</SelectItem>
            <SelectItem value="Presentation Deck">Presentation Deck</SelectItem>
            <SelectItem value="Infographic">Infographic</SelectItem>
            <SelectItem value="Packaging Design">Packaging Design</SelectItem>
            <SelectItem value="Book Cover / Editorial Layout">Book Cover / Editorial Layout</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="audience_style">Target Audience Style</Label>
        <Select value={customizations.audience_style || "Any"} onValueChange={(value) => updateCustomization('audience_style', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Corporate / Professional">Corporate / Professional</SelectItem>
            <SelectItem value="Youthful / Trendy">Youthful / Trendy</SelectItem>
            <SelectItem value="Luxury / High-End">Luxury / High-End</SelectItem>
            <SelectItem value="Eco-Conscious / Natural">Eco-Conscious / Natural</SelectItem>
            <SelectItem value="Tech Savvy / Innovative">Tech Savvy / Innovative</SelectItem>
            <SelectItem value="Artistic / Creative Community">Artistic / Creative Community</SelectItem>
            <SelectItem value="General Public / Mass Market">General Public / Mass Market</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="design_style_pref">Design Style Preference</Label>
        <Select value={customizations.design_style_pref || "Any"} onValueChange={(value) => updateCustomization('design_style_pref', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Clean & Minimalist">Clean & Minimalist</SelectItem>
            <SelectItem value="Bold & Typographic">Bold & Typographic</SelectItem>
            <SelectItem value="Illustrative / Hand-drawn">Illustrative / Hand-drawn</SelectItem>
            <SelectItem value="Data-Driven / Technical">Data-Driven / Technical</SelectItem>
            <SelectItem value="Photorealistic">Photorealistic</SelectItem>
            <SelectItem value="Geometric / Abstract">Geometric / Abstract</SelectItem>
            <SelectItem value="Retro / Vintage">Retro / Vintage</SelectItem>
            <SelectItem value="Playful / Whimsical">Playful / Whimsical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="comm_goal">Key Communication Goal</Label>
        <Select value={customizations.comm_goal || "Any"} onValueChange={(value) => updateCustomization('comm_goal', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Build Trust / Authority">Build Trust / Authority</SelectItem>
            <SelectItem value="Drive Engagement / Action">Drive Engagement / Action</SelectItem>
            <SelectItem value="Inform / Educate">Inform / Educate</SelectItem>
            <SelectItem value="Entertain / Delight">Entertain / Delight</SelectItem>
            <SelectItem value="Create Exclusivity / Desire">Create Exclusivity / Desire</SelectItem>
            <SelectItem value="Simplify Complexity">Simplify Complexity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="hierarchy">Visual Hierarchy Emphasis</Label>
        <Select value={customizations.hierarchy || "Any"} onValueChange={(value) => updateCustomization('hierarchy', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Strong Call-to-Actions">Strong Call-to-Actions</SelectItem>
            <SelectItem value="Clear Information Flow">Clear Information Flow</SelectItem>
            <SelectItem value="Image Dominance">Image Dominance</SelectItem>
            <SelectItem value="Typography Focus">Typography Focus</SelectItem>
            <SelectItem value="Balanced Elements">Balanced Elements</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const getCustomizationContent = () => {
    switch (selectedPath) {
      case '🍽️ Cooking':
        return renderCookingCustomizations();
      case '👗 Fashion':
        return renderFashionCustomizations();
      case '🛋️ Interior Design':
        return renderInteriorCustomizations();
      case '🎨 Art/Craft':
        return renderArtCraftCustomizations();
      case '💄 Makeup':
        return renderMakeupCustomizations();
      case '🎉 Event Theme':
        return renderEventCustomizations();
      case '🌐 Graphic/Web Design':
        return renderDesignCustomizations();
      default:
        return null;
    }
  };

  const hasCustomizations = Object.values(customizations).some(value => 
    value && (Array.isArray(value) ? value.length > 0 : value !== 'Any' && value !== "Chef's choice")
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>4. Customize Your Vision</span>
            {hasCustomizations && (
              <Badge variant="secondary" className="text-xs">
                {Object.values(customizations).filter(value => 
                  value && (Array.isArray(value) ? value.length > 0 : value !== 'Any' && value !== "Chef's choice")
                ).length} customizations
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-sm text-muted-foreground">
            Fine-tune your {selectedPath.toLowerCase()} concept with these specialized options.
          </div>
          {getCustomizationContent()}
        </CardContent>
      </Card>
    </motion.div>
  );
}