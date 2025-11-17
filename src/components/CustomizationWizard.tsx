'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { DynamicCustomizationPanel } from './DynamicCustomizationPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CreativeCustomizations } from '@/lib/agents';
import { PaletteEntry } from '@/lib/anthropic';
import {
  Zap,
  Settings,
  Sparkles,
  ChevronRight,
  Wand2,
  RefreshCw,
  Edit
} from 'lucide-react';

interface CustomizationWizardProps {
  selectedPath: string;
  customizations: CreativeCustomizations;
  onCustomizationChange: (customizations: CreativeCustomizations) => void;
  palette?: PaletteEntry[];
  isGenerating?: boolean;
}

type WizardMode = 'simple' | 'advanced';

export function CustomizationWizard({
  selectedPath,
  customizations,
  onCustomizationChange,
  palette,
  isGenerating = false,
}: CustomizationWizardProps) {
  const [mode, setMode] = useState<WizardMode>('simple');
  const [showGeneratedCombo, setShowGeneratedCombo] = useState(false);

  // Analyze palette to make smart choices
  const analyzePalette = () => {
    if (!palette || palette.length === 0) return { isWarm: false, isDark: false, isBright: false };

    const colors = palette.map(p => {
      const hex = p.hex.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return { r, g, b, luminance };
    });

    const avgLuminance = colors.reduce((sum, c) => sum + c.luminance, 0) / colors.length;
    const isWarm = colors.some(c => c.r > c.b);
    const isDark = avgLuminance < 0.4;
    const isBright = avgLuminance > 0.7;

    return { isWarm, isDark, isBright };
  };

  // AI-powered smart defaults based on path AND palette
  const applySimpleDefaults = () => {
    const { isWarm, isDark, isBright } = analyzePalette();

    // Smart defaults that adapt to palette characteristics
    const defaults: Record<string, CreativeCustomizations> = {
      '🍽️ Cooking': {
        dish_type: isWarm ? "Main Course (Meat)" : "Dessert/Pastries",
        primary_cooking_method: isBright ? "Grilling/Roasting" : "Baking",
        complexity: "Intermediate",
        color_balance: isWarm ? "Warm Emphasis" : isDark ? "Dark Emphasis" : "Balanced",
        text_length: "300-500",
      },
      '👗 Fashion': {
        style_preference: isDark ? "Evening/Formal" : isBright ? "Streetwear/Urban" : "Casual Chic",
        season: isWarm ? "Spring/Summer" : "Fall/Winter",
        color_balance: isWarm ? "Warm Emphasis" : "Cool Emphasis",
        text_length: "300-500",
      },
      '🛋️ Interior Design': {
        room_type: "Living Room",
        design_style: isDark ? "Industrial/Rustic" : isBright ? "Scandinavian" : "Modern/Contemporary",
        color_balance: isBright ? "Bright Emphasis" : isDark ? "Dark Emphasis" : "Balanced",
        text_length: "300-500",
      },
      '🎨 Art/Craft': {
        art_medium: isBright ? "Watercolor" : "Acrylic",
        artistic_style: isDark ? "Abstract" : "Impressionism",
        color_balance: isWarm ? "Warm Emphasis" : "Cool Emphasis",
        text_length: "300-500",
      },
      '💄 Makeup': {
        makeup_style: isDark ? "Bold/Dramatic" : isBright ? "Colorful/Rainbow" : "Everyday Glam",
        occasion: isWarm ? "Date Night" : "Daily Wear",
        intensity_level: isDark ? "Full Glam" : "Medium",
        color_balance: isWarm ? "Warm Emphasis" : "Cool Emphasis",
        text_length: "300-500",
      },
      '🎉 Event Theme': {
        event_type: isBright ? "Birthday Party" : isDark ? "Gala/Formal Event" : "Dinner Party",
        atmosphere: isWarm ? "Fun/Playful" : "Elegant/Sophisticated",
        color_balance: isWarm ? "Warm Emphasis" : isDark ? "Dark Emphasis" : "Balanced",
        text_length: "300-500",
      },
      '🌐 Graphic/Web Design': {
        project_type: "Brand Identity",
        design_approach: isDark ? "Dark Mode/Bold" : isBright ? "Modern/Bold" : "Minimalist/Clean",
        color_balance: isBright ? "Bright Emphasis" : isDark ? "Dark Emphasis" : "Balanced",
        text_length: "300-500",
      },
    };

    onCustomizationChange(defaults[selectedPath] || {});
    setShowGeneratedCombo(true);
  };

  const getModeIcon = (m: WizardMode) => {
    return m === 'simple' ? Zap : Settings;
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Customize Your Vision
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Fine-tune your {selectedPath.toLowerCase()} concept
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={mode === 'simple' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('simple');
              if (Object.keys(customizations).length === 0) {
                applySimpleDefaults();
              }
            }}
            className={mode === 'simple' ? 'bg-gradient-to-r from-blue-600 to-emerald-600' : ''}
          >
            <Zap className="h-4 w-4 mr-2" />
            Simple
            <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30">
              Quick
            </Badge>
          </Button>
          <Button
            variant={mode === 'advanced' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('advanced')}
            className={mode === 'advanced' ? 'bg-gradient-to-r from-blue-600 to-emerald-600' : ''}
          >
            <Settings className="h-4 w-4 mr-2" />
            Advanced
            <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700 dark:bg-purple-900/30">
              Full Control
            </Badge>
          </Button>
        </div>
      </div>

      {/* Mode Description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/50 dark:to-emerald-950/50 border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex-shrink-0">
              {mode === 'simple' ? (
                <Zap className="h-4 w-4 text-white" />
              ) : (
                <Settings className="h-4 w-4 text-white" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {mode === 'simple' ? 'Simple Mode' : 'Advanced Mode'}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                {mode === 'simple'
                  ? 'AI will intelligently select the best options based on your palette. Perfect for quick results!'
                  : 'Full control over every aspect of your creative content. Customize everything to your exact specifications.'}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {mode === 'simple' ? (
          <motion.div
            key="simple"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* AI-Powered Smart Selection */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border-2 border-dashed border-slate-300 dark:border-slate-600 text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-block mb-4"
              >
                <Wand2 className="h-12 w-12 text-blue-600" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Smart Selection</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We'll automatically choose the best settings based on your color palette's mood and characteristics.
                Just sit back and let the AI work its magic!
              </p>

              <Button
                onClick={applySimpleDefaults}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
              >
                <Wand2 className="h-5 w-5 mr-2" />
                Apply Smart Defaults
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>

              {showGeneratedCombo && Object.keys(customizations).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                      ✨ Smart defaults applied!
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={applySimpleDefaults}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Regenerate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMode('advanced')}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Modify
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(customizations)
                      .filter(([key]) => key !== 'text_length')
                      .map(([key, value]) => (
                        <Card key={key} className="bg-white dark:bg-slate-800">
                          <CardContent className="p-3">
                            <p className="text-xs text-muted-foreground mb-1 capitalize">
                              {key.replace(/_/g, ' ')}
                            </p>
                            <p className="text-sm font-medium">{value}</p>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-center">
                <p className="text-2xl font-bold text-blue-600">3x</p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Faster setup</p>
              </div>
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
                <p className="text-2xl font-bold text-emerald-600">90%</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">Success rate</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-center">
                <p className="text-2xl font-bold text-purple-600">AI</p>
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">Optimized</p>
              </div>
            </div>

            {/* Upgrade to Advanced */}
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMode('advanced')}
                className="text-muted-foreground"
              >
                Need more control? Switch to Advanced Mode
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="advanced"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <DynamicCustomizationPanel
              selectedPath={selectedPath}
              customizations={customizations}
              onCustomizationChange={onCustomizationChange}
              isGenerating={isGenerating}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
