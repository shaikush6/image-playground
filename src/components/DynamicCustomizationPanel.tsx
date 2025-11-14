'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Wand2, Palette, ChevronRight, RotateCcw } from 'lucide-react';
import { CreativeCustomizations } from '@/lib/agents';
import { useState, useCallback, useMemo, memo } from 'react';

interface DynamicCustomizationPanelProps {
  selectedPath: string;
  customizations: CreativeCustomizations;
  onCustomizationChange: (customizations: CreativeCustomizations) => void;
  isGenerating?: boolean;
}

interface CustomOption {
  label: string;
  value: string;
  icon?: string;
  color?: string;
  description?: string;
}

export function DynamicCustomizationPanel({ selectedPath, customizations, onCustomizationChange, isGenerating = false }: DynamicCustomizationPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const updateCustomization = useCallback((key: string, value: string | string[]) => {
    onCustomizationChange({
      ...customizations,
      [key]: value
    });
  }, [customizations, onCustomizationChange]);

  const clearCustomizations = useCallback(() => {
    onCustomizationChange({});
  }, [onCustomizationChange]);

  // All useCallback hooks must be at the top level
  const handleCuisineStyleChange = useCallback((value: string) => {
    updateCustomization('cuisine_style', value);
  }, [updateCustomization]);

  const handleDietaryNeedsChange = useCallback((values: string[]) => {
    updateCustomization('dietary_needs', values);
  }, [updateCustomization]);

  const DynamicSelect = ({ 
    label, 
    value, 
    onValueChange, 
    options, 
    placeholder = "Choose an option...",
    description,
    icon
  }: {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    options: CustomOption[];
    placeholder?: string;
    description?: string;
    icon?: React.ReactNode;
  }) => (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <Label className="text-xl font-semibold">{label}</Label>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-14 text-lg border-2 border-slate-300 dark:border-slate-600 hover:border-blue-400 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-slate-800">
          <SelectValue placeholder={placeholder} />
          <ChevronRight className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="text-lg py-3 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50 dark:hover:from-blue-900/50 dark:hover:to-emerald-900/50"
            >
              <div className="flex items-start gap-3 w-full">
                {option.icon && <span className="text-xl mt-0.5">{option.icon}</span>}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold break-words">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-muted-foreground mt-1 break-words leading-tight">{option.description}</div>
                  )}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const MultiSelectTags = ({ 
    label, 
    options, 
    selectedValues, 
    onChange,
    icon,
    description
  }: {
    label: string;
    options: CustomOption[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    icon?: React.ReactNode;
    description?: string;
  }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {icon}
        <Label className="text-xl font-semibold">{label}</Label>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <div key={option.value}>
              <Badge
                variant={isSelected ? "default" : "outline"}
                className={`
                  cursor-pointer transition-all duration-200 w-full justify-center py-3 px-4 text-base h-12
                  ${isSelected 
                    ? 'bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white border-0' 
                    : 'hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-2'
                  }
                `}
                onClick={() => {
                  const updated = isSelected
                    ? selectedValues.filter(v => v !== option.value)
                    : [...selectedValues, option.value];
                  onChange(updated);
                }}
              >
                <span className="flex items-center gap-2">
                  {option.icon && <span className="text-lg">{option.icon}</span>}
                  <span className="font-medium">{option.label}</span>
                </span>
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );

  const CreativeInput = memo(({ 
    label, 
    value, 
    onChange, 
    placeholder,
    icon,
    description
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    icon?: React.ReactNode;
    description?: string;
  }) => {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    }, [onChange]);

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {icon}
          <Label className="text-xl font-semibold">{label}</Label>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        <Input
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="h-14 text-lg border-2 border-slate-300 dark:border-slate-600 hover:border-blue-400 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-slate-800"
        />
      </div>
    );
  });

  CreativeInput.displayName = 'CreativeInput';

  const renderCookingCustomizations = () => {

    const dishTypeOptions: CustomOption[] = [
      { label: "Chef's choice", value: "Chef's choice", icon: "👨‍🍳", description: "Let the AI decide!" },
      { label: "Appetizer/Starter", value: "Appetizer/Starter", icon: "🥗" },
      { label: "Main Course (Meat)", value: "Main Course (Meat)", icon: "🥩" },
      { label: "Main Course (Fish)", value: "Main Course (Fish)", icon: "🐟" },
      { label: "Main Course (Vegetarian/Vegan)", value: "Main Course (Vegetarian/Vegan)", icon: "🥬" },
      { label: "Soup", value: "Soup", icon: "🍲" },
      { label: "Salad", value: "Salad", icon: "🥗" },
      { label: "Side Dish", value: "Side Dish", icon: "🍠" },
      { label: "Dessert", value: "Dessert", icon: "🍰" },
      { label: "Pastry/Baked Good", value: "Pastry/Baked Good", icon: "🥐" },
      { label: "Cocktail/Drink", value: "Cocktail/Drink", icon: "🍹" },
      { label: "Snack", value: "Snack", icon: "🍿" }
    ];

    const cookingMethodOptions: CustomOption[] = [
      { label: "Any", value: "Any", icon: "🔥" },
      { label: "Roasted", value: "Roasted", icon: "🔥" },
      { label: "Grilled", value: "Grilled", icon: "🔥" },
      { label: "Sautéed", value: "Sautéed", icon: "🍳" },
      { label: "Fried", value: "Fried", icon: "🍳" },
      { label: "Baked", value: "Baked", icon: "🥧" },
      { label: "Steamed", value: "Steamed", icon: "💨" },
      { label: "Raw/Ceviche", value: "Raw/Ceviche", icon: "🍣" },
      { label: "Sous-vide", value: "Sous-vide", icon: "🌡️" },
      { label: "Braised/Stewed", value: "Braised/Stewed", icon: "🍲" }
    ];

    const complexityOptions: CustomOption[] = [
      { label: "Any", value: "Any", icon: "⭐" },
      { label: "Quick & Easy (Beginner)", value: "Quick & Easy (Beginner)", icon: "⭐", description: "15-30 minutes" },
      { label: "Intermediate", value: "Intermediate", icon: "⭐⭐", description: "30-60 minutes" },
      { label: "Advanced/Gourmet", value: "Advanced/Gourmet", icon: "⭐⭐⭐", description: "1+ hours" }
    ];

    const dietaryOptions: CustomOption[] = [
      { label: "None", value: "None", icon: "🍽️" },
      { label: "Vegetarian", value: "Vegetarian", icon: "🥬" },
      { label: "Vegan", value: "Vegan", icon: "🌱" },
      { label: "Gluten-Free", value: "Gluten-Free", icon: "🌾" },
      { label: "Dairy-Free", value: "Dairy-Free", icon: "🥛" },
      { label: "Nut-Free", value: "Nut-Free", icon: "🥜" },
      { label: "Low-Carb", value: "Low-Carb", icon: "🥩" }
    ];

    return (
      <div className="space-y-8">
        {/* Row 1: Main Dish Characteristics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DynamicSelect
            label="Dish Type"
            value={customizations.dish_type || "Chef's choice"}
            onValueChange={(value) => updateCustomization('dish_type', value)}
            options={dishTypeOptions}
            icon={<span className="text-2xl">🍽️</span>}
            description="What kind of dish would you like to create?"
          />

          <DynamicSelect
            label="Cooking Method"
            value={customizations.primary_cooking_method || "Any"}
            onValueChange={(value) => updateCustomization('primary_cooking_method', value)}
            options={cookingMethodOptions}
            icon={<span className="text-2xl">🔥</span>}
            description="How should this dish be prepared?"
          />

          <DynamicSelect
            label="Complexity Level"
            value={customizations.complexity || "Any"}
            onValueChange={(value) => updateCustomization('complexity', value)}
            options={complexityOptions}
            icon={<span className="text-2xl">⏱️</span>}
            description="How much time and skill should this require?"
          />
        </div>

        {/* Row 2: Style & Cultural Inspiration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
            <CreativeInput
              label="Cuisine Inspiration"
              value={customizations.cuisine_style || ""}
              onChange={handleCuisineStyleChange}
              placeholder="e.g., Modern French, Japanese Fusion, Mediterranean..."
              icon={<span className="text-2xl">🌍</span>}
              description="Optional: Add cultural or regional inspiration"
            />
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
            <MultiSelectTags
              label="Dietary Considerations"
              options={dietaryOptions}
              selectedValues={customizations.dietary_needs || []}
              onChange={(values) => updateCustomization('dietary_needs', values)}
              icon={<span className="text-2xl">🥗</span>}
              description="Select any dietary restrictions or preferences"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderFashionCustomizations = () => {
    const styleOptions: CustomOption[] = [
      { label: "Any", value: "Any", icon: "✨" },
      { label: "Casual Chic", value: "Casual Chic", icon: "👕" },
      { label: "Streetwear", value: "Streetwear", icon: "🧢" },
      { label: "Minimalist", value: "Minimalist", icon: "🤍" },
      { label: "Bohemian", value: "Bohemian", icon: "🌸" },
      { label: "Preppy", value: "Preppy", icon: "👔" },
      { label: "Glamorous", value: "Glamorous", icon: "✨" },
      { label: "Formal/Black Tie", value: "Formal/Black Tie", icon: "🎩" },
      { label: "Business Professional", value: "Business Professional", icon: "💼" },
      { label: "Artistic/Avant-Garde", value: "Artistic/Avant-Garde", icon: "🎨" },
      { label: "Vintage-Inspired", value: "Vintage-Inspired", icon: "📻" },
      { label: "Sporty/Athleisure", value: "Sporty/Athleisure", icon: "👟" }
    ];

    const garmentOptions: CustomOption[] = [
      { label: "Any", value: "Any", icon: "👗" },
      { label: "Dress", value: "Dress", icon: "👗" },
      { label: "Top & Bottoms", value: "Top & Bottoms", icon: "👕" },
      { label: "Outerwear", value: "Outerwear (Coat/Jacket)", icon: "🧥" },
      { label: "Jumpsuit/Romper", value: "Jumpsuit/Romper", icon: "🩱" },
      { label: "Suiting", value: "Suiting", icon: "👔" }
    ];

    const fabricOptions: CustomOption[] = [
      { label: "Any", value: "Any", icon: "🧵" },
      { label: "Silks/Satins", value: "Silks/Satins", icon: "✨" },
      { label: "Denim", value: "Denim", icon: "👖" },
      { label: "Leather/Faux Leather", value: "Leather/Faux Leather", icon: "🖤" },
      { label: "Knits", value: "Knits (Chunky/Fine)", icon: "🧶" },
      { label: "Linen/Cotton", value: "Linen/Cotton", icon: "🌿" },
      { label: "Velvet", value: "Velvet", icon: "💜" },
      { label: "Sheer/Lace", value: "Sheer/Lace", icon: "🕸️" }
    ];

    const seasonOptions: CustomOption[] = [
      { label: "Any", value: "Any", icon: "🌈" },
      { label: "Spring", value: "Spring", icon: "🌸" },
      { label: "Summer", value: "Summer", icon: "☀️" },
      { label: "Autumn", value: "Autumn", icon: "🍂" },
      { label: "Winter", value: "Winter", icon: "❄️" },
      { label: "Warm Climate", value: "Warm Climate", icon: "🌴" },
      { label: "Cool Climate", value: "Cool Climate", icon: "🏔️" }
    ];

    const audienceOptions: CustomOption[] = [
      { label: "Any", value: "Any", icon: "👥" },
      { label: "Womenswear", value: "Womenswear", icon: "👩" },
      { label: "Menswear", value: "Menswear", icon: "👨" },
      { label: "Gender Neutral", value: "Gender Neutral", icon: "🌈" },
      { label: "Relaxed Fit", value: "Relaxed Fit", icon: "😌" },
      { label: "Tailored Fit", value: "Tailored Fit", icon: "📏" }
    ];

    return (
      <div className="space-y-8">
        {/* Row 1: Core Style Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DynamicSelect
            label="Style Aesthetic"
            value={customizations.style_preference || "Any"}
            onValueChange={(value) => updateCustomization('style_preference', value)}
            options={styleOptions}
            icon={<span className="text-2xl">👗</span>}
            description="What's the overall vibe you're going for?"
          />

          <DynamicSelect
            label="Key Garment"
            value={customizations.key_garment || "Any"}
            onValueChange={(value) => updateCustomization('key_garment', value)}
            options={garmentOptions}
            icon={<span className="text-2xl">👔</span>}
            description="What should be the main piece of the outfit?"
          />

          <DynamicSelect
            label="Fabric & Texture"
            value={customizations.fabric_texture || "Any"}
            onValueChange={(value) => updateCustomization('fabric_texture', value)}
            options={fabricOptions}
            icon={<span className="text-2xl">🧵</span>}
            description="What materials should be emphasized?"
          />
        </div>

        {/* Row 2: Context & Fit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DynamicSelect
            label="Season & Climate"
            value={customizations.season || "Any"}
            onValueChange={(value) => updateCustomization('season', value)}
            options={seasonOptions}
            icon={<span className="text-2xl">🌦️</span>}
            description="When and where will this be worn?"
          />

          <DynamicSelect
            label="Target & Fit"
            value={customizations.audience || "Any"}
            onValueChange={(value) => updateCustomization('audience', value)}
            options={audienceOptions}
            icon={<span className="text-2xl">👥</span>}
            description="Who is this designed for?"
          />
        </div>
      </div>
    );
  };

  const renderInteriorDesignCustomizations = () => {
    const roomTypeOptions: CustomOption[] = [
      { label: "Any Room", value: "Any Room", icon: "🏠", description: "Let AI choose the space" },
      { label: "Living Room", value: "Living Room", icon: "🛋️" },
      { label: "Bedroom", value: "Bedroom", icon: "🛏️" },
      { label: "Kitchen", value: "Kitchen", icon: "🍳" },
      { label: "Bathroom", value: "Bathroom", icon: "🛁" },
      { label: "Dining Room", value: "Dining Room", icon: "🍽️" },
      { label: "Home Office", value: "Home Office", icon: "💻" },
      { label: "Outdoor/Patio", value: "Outdoor/Patio", icon: "🌿" }
    ];

    const styleOptions: CustomOption[] = [
      { label: "Any Style", value: "Any Style", icon: "✨" },
      { label: "Modern/Contemporary", value: "Modern/Contemporary", icon: "🏢" },
      { label: "Scandinavian", value: "Scandinavian", icon: "🌲" },
      { label: "Industrial", value: "Industrial", icon: "🏭" },
      { label: "Bohemian", value: "Bohemian", icon: "🌸" },
      { label: "Mid-Century Modern", value: "Mid-Century Modern", icon: "📻" },
      { label: "Traditional", value: "Traditional", icon: "🏛️" },
      { label: "Minimalist", value: "Minimalist", icon: "⚪" }
    ];

    const budgetOptions: CustomOption[] = [
      { label: "Any Budget", value: "Any Budget", icon: "💰" },
      { label: "Budget-Friendly", value: "Budget-Friendly", icon: "💵", description: "Under $1000" },
      { label: "Mid-Range", value: "Mid-Range", icon: "💸", description: "$1000-5000" },
      { label: "Luxury", value: "Luxury", icon: "💎", description: "$5000+" }
    ];

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DynamicSelect
            label="Room Type"
            value={customizations.room_type || "Any Room"}
            onValueChange={(value) => updateCustomization('room_type', value)}
            options={roomTypeOptions}
            icon={<span className="text-2xl">🏠</span>}
            description="Which space are we designing?"
          />

          <DynamicSelect
            label="Design Style"
            value={customizations.design_style || "Any Style"}
            onValueChange={(value) => updateCustomization('design_style', value)}
            options={styleOptions}
            icon={<span className="text-2xl">🎨</span>}
            description="What's your aesthetic preference?"
          />

          <DynamicSelect
            label="Budget Range"
            value={customizations.budget_range || "Any Budget"}
            onValueChange={(value) => updateCustomization('budget_range', value)}
            options={budgetOptions}
            icon={<span className="text-2xl">💰</span>}
            description="What's your investment level?"
          />
        </div>
      </div>
    );
  };

  const renderMakeupCustomizations = () => {
    const lookTypeOptions: CustomOption[] = [
      { label: "Any Look", value: "Any Look", icon: "💄", description: "Surprise me!" },
      { label: "Natural/No-Makeup", value: "Natural/No-Makeup", icon: "🌿" },
      { label: "Everyday Glam", value: "Everyday Glam", icon: "✨" },
      { label: "Bold/Dramatic", value: "Bold/Dramatic", icon: "🔥" },
      { label: "Editorial/Artistic", value: "Editorial/Artistic", icon: "🎨" },
      { label: "Vintage Inspired", value: "Vintage Inspired", icon: "📻" },
      { label: "Bridal", value: "Bridal", icon: "💒" },
      { label: "Gothic/Dark", value: "Gothic/Dark", icon: "🖤" },
      { label: "Colorful/Rainbow", value: "Colorful/Rainbow", icon: "🌈" }
    ];

    const occasionOptions: CustomOption[] = [
      { label: "Any Occasion", value: "Any Occasion", icon: "🎉" },
      { label: "Daily Wear", value: "Daily Wear", icon: "☀️" },
      { label: "Evening/Night Out", value: "Evening/Night Out", icon: "🌙" },
      { label: "Professional/Work", value: "Professional/Work", icon: "💼" },
      { label: "Special Event", value: "Special Event", icon: "🎊" },
      { label: "Photoshoot", value: "Photoshoot", icon: "📸" },
      { label: "Date Night", value: "Date Night", icon: "💕" },
      { label: "Festival/Concert", value: "Festival/Concert", icon: "🎪" }
    ];

    const featureOptions: CustomOption[] = [
      { label: "Balanced Look", value: "Balanced Look", icon: "⚖️" },
      { label: "Eyes", value: "Eyes", icon: "👁️" },
      { label: "Lips", value: "Lips", icon: "💋" },
      { label: "Skin/Base", value: "Skin/Base", icon: "✨" },
      { label: "Cheeks/Blush", value: "Cheeks/Blush", icon: "🌸" },
      { label: "Brows", value: "Brows", icon: "🎯" },
      { label: "Contouring", value: "Contouring", icon: "🎭" }
    ];

    const colorSchemeOptions: CustomOption[] = [
      { label: "Any Colors", value: "Any Colors", icon: "🎨" },
      { label: "Warm Tones", value: "Warm Tones", icon: "🧡", description: "Oranges, reds, golds" },
      { label: "Cool Tones", value: "Cool Tones", icon: "💙", description: "Blues, purples, silvers" },
      { label: "Neutral/Earth", value: "Neutral/Earth", icon: "🤎", description: "Browns, beiges, nudes" },
      { label: "Bold/Bright", value: "Bold/Bright", icon: "🌈", description: "Vibrant colors" },
      { label: "Monochromatic", value: "Monochromatic", icon: "⚫", description: "Single color family" },
      { label: "Pastel", value: "Pastel", icon: "🌸", description: "Soft, muted colors" }
    ];

    const intensityOptions: CustomOption[] = [
      { label: "Any Intensity", value: "Any Intensity", icon: "📊" },
      { label: "Subtle/Light", value: "Subtle/Light", icon: "🌙", description: "Barely there, natural" },
      { label: "Medium", value: "Medium", icon: "☀️", description: "Noticeable but polished" },
      { label: "Full Glam", value: "Full Glam", icon: "✨", description: "High impact, statement" },
      { label: "Editorial/Extreme", value: "Editorial/Extreme", icon: "🎭", description: "Artistic, avant-garde" }
    ];

    const ageGroupOptions: CustomOption[] = [
      { label: "Any Age", value: "Any Age", icon: "👩" },
      { label: "Teen/Young Adult", value: "Teen/Young Adult", icon: "👧", description: "15-25 years" },
      { label: "Adult", value: "Adult", icon: "👩", description: "25-45 years" },
      { label: "Mature/Sophisticated", value: "Mature/Sophisticated", icon: "👩‍🦳", description: "45+ years" }
    ];

    return (
      <div className="space-y-8">
        {/* Row 1: Core Style & Occasion */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DynamicSelect
            label="Makeup Style"
            value={customizations.makeup_style || "Any Look"}
            onValueChange={(value) => updateCustomization('makeup_style', value)}
            options={lookTypeOptions}
            icon={<span className="text-2xl">💄</span>}
            description="What kind of look are you going for?"
          />

          <DynamicSelect
            label="Occasion"
            value={customizations.occasion || "Any Occasion"}
            onValueChange={(value) => updateCustomization('occasion', value)}
            options={occasionOptions}
            icon={<span className="text-2xl">🎉</span>}
            description="When will you wear this look?"
          />

          <DynamicSelect
            label="Focus Feature"
            value={customizations.focus_feature || "Balanced Look"}
            onValueChange={(value) => updateCustomization('focus_feature', value)}
            options={featureOptions}
            icon={<span className="text-2xl">✨</span>}
            description="Which feature should be emphasized?"
          />
        </div>

        {/* Row 2: Color & Intensity */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DynamicSelect
            label="Color Scheme"
            value={customizations.color_scheme || "Any Colors"}
            onValueChange={(value) => updateCustomization('color_scheme', value)}
            options={colorSchemeOptions}
            icon={<span className="text-2xl">🎨</span>}
            description="What color palette do you prefer?"
          />

          <DynamicSelect
            label="Intensity Level"
            value={customizations.intensity_level || "Any Intensity"}
            onValueChange={(value) => updateCustomization('intensity_level', value)}
            options={intensityOptions}
            icon={<span className="text-2xl">📊</span>}
            description="How bold should the look be?"
          />

          <DynamicSelect
            label="Age Group"
            value={customizations.age_group || "Any Age"}
            onValueChange={(value) => updateCustomization('age_group', value)}
            options={ageGroupOptions}
            icon={<span className="text-2xl">👩</span>}
            description="Who is this look designed for?"
          />
        </div>
      </div>
    );
  };

  const renderGraphicWebDesignCustomizations = () => {
    const projectTypeOptions: CustomOption[] = [
      { label: "Any Project", value: "Any Project", icon: "🎨", description: "Surprise me!" },
      { label: "Logo Design", value: "Logo Design", icon: "🏷️" },
      { label: "Website Layout", value: "Website Layout", icon: "💻" },
      { label: "Social Media Graphics", value: "Social Media Graphics", icon: "📱" },
      { label: "Print Design", value: "Print Design", icon: "📄" },
      { label: "App Interface", value: "App Interface", icon: "📲" },
      { label: "Brand Identity", value: "Brand Identity", icon: "🎯" },
      { label: "Packaging Design", value: "Packaging Design", icon: "📦" },
      { label: "Poster/Flyer", value: "Poster/Flyer", icon: "📋" }
    ];

    const styleOptions: CustomOption[] = [
      { label: "Any Style", value: "Any Style", icon: "✨" },
      { label: "Minimalist", value: "Minimalist", icon: "⚪" },
      { label: "Bold/Modern", value: "Bold/Modern", icon: "🔥" },
      { label: "Vintage/Retro", value: "Vintage/Retro", icon: "📻" },
      { label: "Organic/Natural", value: "Organic/Natural", icon: "🌿" },
      { label: "Tech/Futuristic", value: "Tech/Futuristic", icon: "🚀" },
      { label: "Playful/Fun", value: "Playful/Fun", icon: "🎈" },
      { label: "Elegant/Luxury", value: "Elegant/Luxury", icon: "💎" },
      { label: "Corporate/Professional", value: "Corporate/Professional", icon: "💼" }
    ];

    const industryOptions: CustomOption[] = [
      { label: "Any Industry", value: "Any Industry", icon: "🏢" },
      { label: "Technology", value: "Technology", icon: "💻" },
      { label: "Healthcare", value: "Healthcare", icon: "🏥" },
      { label: "Food & Beverage", value: "Food & Beverage", icon: "🍽️" },
      { label: "Fashion & Beauty", value: "Fashion & Beauty", icon: "👗" },
      { label: "Education", value: "Education", icon: "📚" },
      { label: "Creative Arts", value: "Creative Arts", icon: "🎨" },
      { label: "Finance/Banking", value: "Finance/Banking", icon: "🏦" },
      { label: "Real Estate", value: "Real Estate", icon: "🏠" },
      { label: "Entertainment", value: "Entertainment", icon: "🎭" }
    ];

    const colorPaletteOptions: CustomOption[] = [
      { label: "Any Colors", value: "Any Colors", icon: "🌈" },
      { label: "Monochromatic", value: "Monochromatic", icon: "⚫", description: "Single color variations" },
      { label: "Complementary", value: "Complementary", icon: "🔴🔵", description: "Opposite colors" },
      { label: "Analogous", value: "Analogous", icon: "🟡🟠", description: "Adjacent colors" },
      { label: "Triadic", value: "Triadic", icon: "🔺", description: "Three evenly spaced colors" },
      { label: "Bold/Vibrant", value: "Bold/Vibrant", icon: "💥", description: "High contrast, bright" },
      { label: "Muted/Subtle", value: "Muted/Subtle", icon: "🌫️", description: "Soft, understated" },
      { label: "Earth Tones", value: "Earth Tones", icon: "🌍", description: "Browns, greens, tans" }
    ];

    const complexityOptions: CustomOption[] = [
      { label: "Any Complexity", value: "Any Complexity", icon: "⭐" },
      { label: "Simple/Clean", value: "Simple/Clean", icon: "⚪", description: "Minimal elements" },
      { label: "Moderate Detail", value: "Moderate Detail", icon: "⭐⭐", description: "Balanced complexity" },
      { label: "Rich/Detailed", value: "Rich/Detailed", icon: "⭐⭐⭐", description: "Intricate design" },
      { label: "Experimental", value: "Experimental", icon: "🧪", description: "Pushing boundaries" }
    ];

    const audienceOptions: CustomOption[] = [
      { label: "Any Audience", value: "Any Audience", icon: "👥" },
      { label: "Children/Kids", value: "Children/Kids", icon: "🧒", description: "Ages 3-12" },
      { label: "Teenagers", value: "Teenagers", icon: "👧", description: "Ages 13-19" },
      { label: "Young Adults", value: "Young Adults", icon: "👨", description: "Ages 20-35" },
      { label: "Adults/Professional", value: "Adults/Professional", icon: "👔", description: "Ages 35-65" },
      { label: "Seniors", value: "Seniors", icon: "👴", description: "Ages 65+" },
      { label: "B2B/Business", value: "B2B/Business", icon: "🏢", description: "Business audience" }
    ];

    return (
      <div className="space-y-8">
        {/* Row 1: Project Fundamentals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DynamicSelect
            label="Project Type"
            value={customizations.project_type || "Any Project"}
            onValueChange={(value) => updateCustomization('project_type', value)}
            options={projectTypeOptions}
            icon={<span className="text-2xl">🎨</span>}
            description="What are we designing?"
          />

          <DynamicSelect
            label="Design Style"
            value={customizations.design_approach || "Any Style"}
            onValueChange={(value) => updateCustomization('design_approach', value)}
            options={styleOptions}
            icon={<span className="text-2xl">✨</span>}
            description="What's the visual approach?"
          />

          <DynamicSelect
            label="Industry"
            value={customizations.target_industry || "Any Industry"}
            onValueChange={(value) => updateCustomization('target_industry', value)}
            options={industryOptions}
            icon={<span className="text-2xl">🏢</span>}
            description="What's the business context?"
          />
        </div>

        {/* Row 2: Visual Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DynamicSelect
            label="Color Palette"
            value={customizations.color_palette || "Any Colors"}
            onValueChange={(value) => updateCustomization('color_palette', value)}
            options={colorPaletteOptions}
            icon={<span className="text-2xl">🎨</span>}
            description="What color scheme works best?"
          />

          <DynamicSelect
            label="Complexity Level"
            value={customizations.complexity_level || "Any Complexity"}
            onValueChange={(value) => updateCustomization('complexity_level', value)}
            options={complexityOptions}
            icon={<span className="text-2xl">⭐</span>}
            description="How complex should the design be?"
          />

          <DynamicSelect
            label="Target Audience"
            value={customizations.target_audience || "Any Audience"}
            onValueChange={(value) => updateCustomization('target_audience', value)}
            options={audienceOptions}
            icon={<span className="text-2xl">👥</span>}
            description="Who is the primary audience?"
          />
        </div>
      </div>
    );
  };

  const renderArtCraftCustomizations = () => {
    const mediumOptions: CustomOption[] = [
      { label: "Any Medium", value: "Any Medium", icon: "🎨", description: "Let creativity decide!" },
      { label: "Digital Art", value: "Digital Art", icon: "💻" },
      { label: "Watercolor", value: "Watercolor", icon: "🌊" },
      { label: "Oil/Acrylic", value: "Oil/Acrylic", icon: "🖌️" },
      { label: "Sketching/Drawing", value: "Sketching/Drawing", icon: "✏️" },
      { label: "Mixed Media", value: "Mixed Media", icon: "🎭" },
      { label: "Crafts/DIY", value: "Crafts/DIY", icon: "✂️" },
      { label: "Photography", value: "Photography", icon: "📸" },
      { label: "Sculpture/3D", value: "Sculpture/3D", icon: "🗿" },
      { label: "Printmaking", value: "Printmaking", icon: "🖨️" }
    ];

    const styleOptions: CustomOption[] = [
      { label: "Any Style", value: "Any Style", icon: "✨" },
      { label: "Realistic", value: "Realistic", icon: "👁️" },
      { label: "Abstract", value: "Abstract", icon: "🌀" },
      { label: "Impressionist", value: "Impressionist", icon: "🌅" },
      { label: "Pop Art", value: "Pop Art", icon: "💥" },
      { label: "Minimalist", value: "Minimalist", icon: "⚪" },
      { label: "Fantasy/Surreal", value: "Fantasy/Surreal", icon: "🦄" },
      { label: "Street Art", value: "Street Art", icon: "🏙️" },
      { label: "Vintage/Retro", value: "Vintage/Retro", icon: "📻" },
      { label: "Expressionist", value: "Expressionist", icon: "🎭" }
    ];

    const complexityOptions: CustomOption[] = [
      { label: "Any Complexity", value: "Any Complexity", icon: "⭐" },
      { label: "Beginner Friendly", value: "Beginner Friendly", icon: "🌱", description: "Simple & approachable" },
      { label: "Intermediate", value: "Intermediate", icon: "🎯", description: "Some experience needed" },
      { label: "Advanced", value: "Advanced", icon: "🏆", description: "For skilled artists" },
      { label: "Professional", value: "Professional", icon: "💎", description: "Master level technique" }
    ];

    const subjectOptions: CustomOption[] = [
      { label: "Any Subject", value: "Any Subject", icon: "🎨" },
      { label: "Portrait", value: "Portrait", icon: "👤", description: "People & faces" },
      { label: "Landscape", value: "Landscape", icon: "🏔️", description: "Nature & scenery" },
      { label: "Still Life", value: "Still Life", icon: "🍎", description: "Objects & arrangements" },
      { label: "Animals", value: "Animals", icon: "🐾", description: "Wildlife & pets" },
      { label: "Abstract Concept", value: "Abstract Concept", icon: "💭", description: "Ideas & emotions" },
      { label: "Architecture", value: "Architecture", icon: "🏛️", description: "Buildings & structures" },
      { label: "Fantasy/Fictional", value: "Fantasy/Fictional", icon: "🧚", description: "Imaginary worlds" }
    ];

    const colorSchemeOptions: CustomOption[] = [
      { label: "Any Colors", value: "Any Colors", icon: "🌈" },
      { label: "Monochromatic", value: "Monochromatic", icon: "⚫", description: "Single color variations" },
      { label: "Warm Palette", value: "Warm Palette", icon: "🔥", description: "Reds, oranges, yellows" },
      { label: "Cool Palette", value: "Cool Palette", icon: "❄️", description: "Blues, greens, purples" },
      { label: "Earth Tones", value: "Earth Tones", icon: "🌍", description: "Browns, beiges, natural" },
      { label: "Vibrant/Bright", value: "Vibrant/Bright", icon: "💥", description: "Bold, saturated colors" },
      { label: "Pastel/Soft", value: "Pastel/Soft", icon: "🌸", description: "Light, muted tones" },
      { label: "Black & White", value: "Black & White", icon: "⚫⚪", description: "Monochrome only" }
    ];

    const purposeOptions: CustomOption[] = [
      { label: "Any Purpose", value: "Any Purpose", icon: "🎯" },
      { label: "Personal Expression", value: "Personal Expression", icon: "💭", description: "Self expression & creativity" },
      { label: "Gift/Commission", value: "Gift/Commission", icon: "🎁", description: "For someone else" },
      { label: "Home Decoration", value: "Home Decoration", icon: "🏠", description: "Interior design" },
      { label: "Portfolio/Exhibition", value: "Portfolio/Exhibition", icon: "🖼️", description: "Professional display" },
      { label: "Learning/Practice", value: "Learning/Practice", icon: "📚", description: "Skill development" },
      { label: "Therapeutic/Relaxing", value: "Therapeutic/Relaxing", icon: "🧘", description: "Stress relief" }
    ];

    return (
      <div className="space-y-8">
        {/* Row 1: Core Artistic Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DynamicSelect
            label="Art Medium"
            value={customizations.art_medium || "Any Medium"}
            onValueChange={(value) => updateCustomization('art_medium', value)}
            options={mediumOptions}
            icon={<span className="text-2xl">🎨</span>}
            description="What materials will you use?"
          />

          <DynamicSelect
            label="Artistic Style"
            value={customizations.artistic_style || "Any Style"}
            onValueChange={(value) => updateCustomization('artistic_style', value)}
            options={styleOptions}
            icon={<span className="text-2xl">✨</span>}
            description="What's your artistic approach?"
          />

          <DynamicSelect
            label="Skill Level"
            value={customizations.skill_level || "Any Complexity"}
            onValueChange={(value) => updateCustomization('skill_level', value)}
            options={complexityOptions}
            icon={<span className="text-2xl">🎯</span>}
            description="What's your experience level?"
          />
        </div>

        {/* Row 2: Subject & Visual Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DynamicSelect
            label="Subject Matter"
            value={customizations.subject_matter || "Any Subject"}
            onValueChange={(value) => updateCustomization('subject_matter', value)}
            options={subjectOptions}
            icon={<span className="text-2xl">🖼️</span>}
            description="What will be the main focus?"
          />

          <DynamicSelect
            label="Color Scheme"
            value={customizations.art_color_scheme || "Any Colors"}
            onValueChange={(value) => updateCustomization('art_color_scheme', value)}
            options={colorSchemeOptions}
            icon={<span className="text-2xl">🌈</span>}
            description="What color palette appeals to you?"
          />

          <DynamicSelect
            label="Purpose"
            value={customizations.art_purpose || "Any Purpose"}
            onValueChange={(value) => updateCustomization('art_purpose', value)}
            options={purposeOptions}
            icon={<span className="text-2xl">🎯</span>}
            description="What's the intended use?"
          />
        </div>
      </div>
    );
  };

  const renderEventThemeCustomizations = () => {
    const eventTypeOptions: CustomOption[] = [
      { label: "Any Event", value: "Any Event", icon: "🎉", description: "Surprise celebration!" },
      { label: "Birthday Party", value: "Birthday Party", icon: "🎂" },
      { label: "Wedding", value: "Wedding", icon: "💒" },
      { label: "Corporate Event", value: "Corporate Event", icon: "💼" },
      { label: "Holiday Celebration", value: "Holiday Celebration", icon: "🎄" },
      { label: "Baby Shower", value: "Baby Shower", icon: "👶" },
      { label: "Graduation", value: "Graduation", icon: "🎓" },
      { label: "Anniversary", value: "Anniversary", icon: "💝" },
      { label: "Housewarming", value: "Housewarming", icon: "🏠" },
      { label: "Engagement Party", value: "Engagement Party", icon: "💍" },
      { label: "Retirement Party", value: "Retirement Party", icon: "🎊" }
    ];

    const atmosphereOptions: CustomOption[] = [
      { label: "Any Atmosphere", value: "Any Atmosphere", icon: "✨" },
      { label: "Elegant/Formal", value: "Elegant/Formal", icon: "🎩" },
      { label: "Fun/Playful", value: "Fun/Playful", icon: "🎈" },
      { label: "Intimate/Cozy", value: "Intimate/Cozy", icon: "🕯️" },
      { label: "Trendy/Modern", value: "Trendy/Modern", icon: "📱" },
      { label: "Rustic/Natural", value: "Rustic/Natural", icon: "🌿" },
      { label: "Glamorous", value: "Glamorous", icon: "💎" },
      { label: "Casual/Laid-back", value: "Casual/Laid-back", icon: "😎" },
      { label: "Romantic", value: "Romantic", icon: "💕" },
      { label: "Festive/Lively", value: "Festive/Lively", icon: "🎪" }
    ];

    const sizeOptions: CustomOption[] = [
      { label: "Any Size", value: "Any Size", icon: "👥" },
      { label: "Intimate (2-15)", value: "Intimate (2-15)", icon: "👫", description: "Small gathering" },
      { label: "Medium (16-50)", value: "Medium (16-50)", icon: "👨‍👩‍👧‍👦", description: "Family & friends" },
      { label: "Large (50+)", value: "Large (50+)", icon: "🏟️", description: "Big celebration" }
    ];

    const colorThemeOptions: CustomOption[] = [
      { label: "Any Colors", value: "Any Colors", icon: "🌈" },
      { label: "Classic/Elegant", value: "Classic/Elegant", icon: "🤍", description: "Whites, creams, golds" },
      { label: "Bold/Vibrant", value: "Bold/Vibrant", icon: "💥", description: "Bright, energetic colors" },
      { label: "Pastel/Soft", value: "Pastel/Soft", icon: "🌸", description: "Light, gentle tones" },
      { label: "Monochromatic", value: "Monochromatic", icon: "⚫", description: "Single color variations" },
      { label: "Seasonal", value: "Seasonal", icon: "🍂", description: "Colors matching the season" },
      { label: "Metallic Accents", value: "Metallic Accents", icon: "✨", description: "Gold, silver, copper touches" },
      { label: "Earth Tones", value: "Earth Tones", icon: "🌍", description: "Natural, organic colors" }
    ];

    const venueTypeOptions: CustomOption[] = [
      { label: "Any Venue", value: "Any Venue", icon: "🏢" },
      { label: "Indoor/Home", value: "Indoor/Home", icon: "🏠", description: "Comfortable & familiar" },
      { label: "Outdoor/Garden", value: "Outdoor/Garden", icon: "🌳", description: "Natural & fresh" },
      { label: "Beach/Waterfront", value: "Beach/Waterfront", icon: "🏖️", description: "Coastal & relaxed" },
      { label: "Rustic/Barn", value: "Rustic/Barn", icon: "🏚️", description: "Country & charming" },
      { label: "Modern/Urban", value: "Modern/Urban", icon: "🏙️", description: "Sleek & contemporary" },
      { label: "Historic/Traditional", value: "Historic/Traditional", icon: "🏛️", description: "Classic & timeless" }
    ];

    const budgetOptions: CustomOption[] = [
      { label: "Any Budget", value: "Any Budget", icon: "💰" },
      { label: "Budget-Friendly", value: "Budget-Friendly", icon: "💵", description: "Under $500" },
      { label: "Moderate", value: "Moderate", icon: "💸", description: "$500-2000" },
      { label: "Generous", value: "Generous", icon: "💳", description: "$2000-5000" },
      { label: "Luxury", value: "Luxury", icon: "💎", description: "$5000+" }
    ];

    return (
      <div className="space-y-8">
        {/* Row 1: Event Fundamentals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DynamicSelect
            label="Event Type"
            value={customizations.event_type || "Any Event"}
            onValueChange={(value) => updateCustomization('event_type', value)}
            options={eventTypeOptions}
            icon={<span className="text-2xl">🎉</span>}
            description="What are we celebrating?"
          />

          <DynamicSelect
            label="Atmosphere"
            value={customizations.atmosphere || "Any Atmosphere"}
            onValueChange={(value) => updateCustomization('atmosphere', value)}
            options={atmosphereOptions}
            icon={<span className="text-2xl">✨</span>}
            description="What's the desired mood?"
          />

          <DynamicSelect
            label="Event Size"
            value={customizations.event_size || "Any Size"}
            onValueChange={(value) => updateCustomization('event_size', value)}
            options={sizeOptions}
            icon={<span className="text-2xl">👥</span>}
            description="How many guests?"
          />
        </div>

        {/* Row 2: Design & Practical Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DynamicSelect
            label="Color Theme"
            value={customizations.event_color_theme || "Any Colors"}
            onValueChange={(value) => updateCustomization('event_color_theme', value)}
            options={colorThemeOptions}
            icon={<span className="text-2xl">🎨</span>}
            description="What color palette works best?"
          />

          <DynamicSelect
            label="Venue Style"
            value={customizations.venue_type || "Any Venue"}
            onValueChange={(value) => updateCustomization('venue_type', value)}
            options={venueTypeOptions}
            icon={<span className="text-2xl">🏢</span>}
            description="What type of space?"
          />

          <DynamicSelect
            label="Budget Range"
            value={customizations.event_budget || "Any Budget"}
            onValueChange={(value) => updateCustomization('event_budget', value)}
            options={budgetOptions}
            icon={<span className="text-2xl">💰</span>}
            description="What's your budget level?"
          />
        </div>
      </div>
    );
  };

  const getCustomizationContent = () => {
    switch (selectedPath) {
      case '🍽️ Cooking':
        return renderCookingCustomizations();
      case '👗 Fashion':
        return renderFashionCustomizations();
      case '🛋️ Interior Design':
        return renderInteriorDesignCustomizations();
      case '💄 Makeup':
        return renderMakeupCustomizations();
      case '🌐 Graphic/Web Design':
        return renderGraphicWebDesignCustomizations();
      case '🎨 Art/Craft':
        return renderArtCraftCustomizations();
      case '🎉 Event Theme':
        return renderEventThemeCustomizations();
      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-3 text-blue-400" />
            <p>Dynamic customizations for {selectedPath} coming soon!</p>
          </div>
        );
    }
  };

  const hasCustomizations = Object.values(customizations).some(value => 
    value && (Array.isArray(value) ? value.length > 0 : value !== 'Any' && value !== "Chef's choice")
  );

  const customizationCount = Object.values(customizations).filter(value => 
    value && (Array.isArray(value) ? value.length > 0 : value !== 'Any' && value !== "Chef's choice")
  ).length;

  return (
    <div>
      <div className="space-y-6">
        {/* Header with status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Palette className="h-5 w-5" />
            <span className="text-lg">
              Make your {selectedPath.toLowerCase()} concept uniquely yours
            </span>
          </div>
          <div className="flex items-center gap-2">
            {hasCustomizations && (
              <div>
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-emerald-100 text-blue-700 border-blue-200">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {customizationCount} active
                </Badge>
              </div>
            )}
            {hasCustomizations && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCustomizations}
                className="h-10 px-4 hover:bg-blue-100 dark:hover:bg-blue-900/50"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset All
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {getCustomizationContent()}
        
        {!hasCustomizations && (
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/50 dark:to-emerald-950/50 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300 mb-2">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold text-lg">Pro tip:</span>
            </div>
            <p className="text-blue-600 dark:text-blue-400">
              Customize your choices above to get more tailored, specific results that match your exact vision!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}