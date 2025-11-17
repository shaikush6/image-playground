'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ENVIRONMENT_CATEGORIES, EnvironmentCategory } from '@/config/environments';

interface EnvironmentCategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  disabled?: boolean;
  filterType?: 'promotional' | 'lifestyle' | 'all';
}

export function EnvironmentCategorySelector({
  selectedCategory,
  onCategoryChange,
  disabled = false,
  filterType = 'all'
}: EnvironmentCategorySelectorProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const filteredCategories = filterType === 'all'
    ? ENVIRONMENT_CATEGORIES
    : ENVIRONMENT_CATEGORIES.filter(cat => cat.type === filterType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Choose Environment Theme</h3>
        <p className="text-sm text-muted-foreground">
          Select how you want to showcase your product
        </p>
      </div>

      {/* Type Filter Badges */}
      <div className="flex gap-2">
        <Badge
          variant={filterType === 'promotional' ? 'default' : 'outline'}
          className="cursor-default"
        >
          {filteredCategories.filter(c => c.type === 'promotional').length} Promotional
        </Badge>
        <Badge
          variant={filterType === 'lifestyle' ? 'default' : 'outline'}
          className="cursor-default"
        >
          {filteredCategories.filter(c => c.type === 'lifestyle').length} Lifestyle
        </Badge>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCategories.map((category, index) => {
          const isSelected = selectedCategory === category.id;
          const isHovered = hoveredCategory === category.id;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <motion.button
                onClick={() => !disabled && onCategoryChange(category.id)}
                disabled={disabled}
                whileHover={{ scale: disabled ? 1 : 1.02 }}
                whileTap={{ scale: disabled ? 1 : 0.98 }}
                className={`
                  relative w-full text-left p-5 rounded-xl border-2 transition-all duration-300 overflow-hidden
                  ${isSelected
                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 shadow-lg'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {/* Background gradient on hover */}
                <AnimatePresence>
                  {isHovered && !isSelected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20"
                    />
                  )}
                </AnimatePresence>

                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`
                        text-3xl flex-shrink-0
                      `}>
                        {category.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base break-words leading-tight">
                          {category.name}
                        </h4>
                      </div>
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 flex-shrink-0">
                          Selected
                        </Badge>
                      </motion.div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {category.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">
                      {category.type === 'promotional' ? '📢 Promotional' : '🌟 Lifestyle'}
                    </Badge>
                    <span className="text-xs">
                      {category.variations.length} scenes
                    </span>
                  </div>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="selected-environment-indicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
