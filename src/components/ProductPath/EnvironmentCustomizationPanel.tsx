'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Wand2, Edit3 } from 'lucide-react';
import { getCategoryById } from '@/config/environments';

interface EnvironmentCustomizationPanelProps {
  categoryId: string;
  selectedVariationId: string;
  customPrompt: string;
  onVariationChange: (variationId: string) => void;
  onCustomPromptChange: (prompt: string) => void;
  disabled?: boolean;
}

export function EnvironmentCustomizationPanel({
  categoryId,
  selectedVariationId,
  customPrompt,
  onVariationChange,
  onCustomPromptChange,
  disabled = false
}: EnvironmentCustomizationPanelProps) {
  const [useCustom, setUseCustom] = useState(false);
  const category = getCategoryById(categoryId);

  if (!category) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-600" />
          Customize Scene
        </h3>
        <p className="text-sm text-muted-foreground">
          Choose a specific scene variation or describe your own
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
        <button
          onClick={() => setUseCustom(false)}
          disabled={disabled}
          className={`px-4 py-2 rounded text-sm font-medium transition-all ${
            !useCustom
              ? 'bg-white dark:bg-slate-700 shadow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Wand2 className="h-4 w-4 inline mr-1" />
          Curated Scenes
        </button>
        <button
          onClick={() => setUseCustom(true)}
          disabled={disabled}
          className={`px-4 py-2 rounded text-sm font-medium transition-all ${
            useCustom
              ? 'bg-white dark:bg-slate-700 shadow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Edit3 className="h-4 w-4 inline mr-1" />
          Custom Prompt
        </button>
      </div>

      {/* Content */}
      {!useCustom ? (
        /* Curated Variations */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {category.variations.map((variation, index) => {
            const isSelected = selectedVariationId === variation.id;

            return (
              <motion.button
                key={variation.id}
                onClick={() => !disabled && onVariationChange(variation.id)}
                disabled={disabled}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: disabled ? 1 : 1.02 }}
                whileTap={{ scale: disabled ? 1 : 0.98 }}
                className={`
                  relative text-left p-4 rounded-lg border-2 transition-all duration-300
                  ${isSelected
                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-purple-300 dark:hover:border-purple-600'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-sm">
                    {variation.name}
                  </h4>
                  {isSelected && (
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-xs">
                      ✓
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {variation.description}
                </p>

                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="selected-variation-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      ) : (
        /* Custom Prompt */
        <div className="space-y-3">
          <Label htmlFor="custom-prompt" className="text-sm font-medium">
            Describe Your Custom Scene
          </Label>
          <Textarea
            id="custom-prompt"
            value={customPrompt}
            onChange={(e) => onCustomPromptChange(e.target.value)}
            disabled={disabled}
            placeholder="Describe the environment or scene you want... For example: 'Product displayed on a marble countertop in a bright, minimalist kitchen with morning sunlight streaming through the window'"
            className="min-h-[120px] resize-none"
          />
          <p className="text-xs text-muted-foreground">
            💡 Tip: Be specific about lighting, setting, mood, and composition for best results
          </p>
        </div>
      )}

      {/* Suggested Aspect Ratios */}
      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
          📐 Recommended Aspect Ratios for {category.name}:
        </p>
        <div className="flex gap-2 flex-wrap">
          {category.suggestedAspectRatios.map(ratio => (
            <Badge key={ratio} variant="secondary" className="text-xs">
              {ratio}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
