'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  TrendingUp,
  Users,
  ChefHat,
  Shirt,
  Home,
  Palette,
  Sparkle,
  PartyPopper,
  Laptop
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface EnhancedCreativePathSelectorProps {
  paths: readonly string[];
  selectedPath: string;
  onPathChange: (path: string) => void;
  disabled?: boolean;
}

const pathIcons: Record<string, LucideIcon> = {
  '🍽️ Cooking': ChefHat,
  '👗 Fashion': Shirt,
  '🛋️ Interior Design': Home,
  '🎨 Art/Craft': Palette,
  '💄 Makeup': Sparkle,
  '🎉 Event Theme': PartyPopper,
  '🌐 Graphic/Web Design': Laptop,
};

const pathDescriptions: Record<string, string> = {
  '🍽️ Cooking': 'Transform colors into delicious culinary creations and plating concepts',
  '👗 Fashion': 'Design stunning outfits and fashion concepts inspired by your palette',
  '🛋️ Interior Design': 'Create beautiful room designs and decoration ideas',
  '🎨 Art/Craft': 'Generate artistic projects and creative concepts',
  '💄 Makeup': 'Design makeup looks and beauty concepts',
  '🎉 Event Theme': 'Plan themed events and decorative concepts',
  '🌐 Graphic/Web Design': 'Create design systems and visual identities',
};

// Simulated trending data (would come from backend in production)
const pathStats: Record<string, { trend: boolean; users: number }> = {
  '🍽️ Cooking': { trend: true, users: 1247 },
  '👗 Fashion': { trend: true, users: 2103 },
  '🛋️ Interior Design': { trend: false, users: 891 },
  '🎨 Art/Craft': { trend: true, users: 1556 },
  '💄 Makeup': { trend: false, users: 1834 },
  '🎉 Event Theme': { trend: false, users: 734 },
  '🌐 Graphic/Web Design': { trend: true, users: 1923 },
};

export function EnhancedCreativePathSelector({
  paths,
  selectedPath,
  onPathChange,
  disabled = false,
}: EnhancedCreativePathSelectorProps) {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="space-y-6">
      {/* Header with view toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Choose Your Creative Path
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Select a domain to transform your palette into creative content
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded text-sm font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-700 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded text-sm font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-700 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Path cards */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-4'}>
        {paths.map((path, index) => {
          const Icon = pathIcons[path] || Sparkles;
          const stats = pathStats[path];
          const isSelected = selectedPath === path;
          const isHovered = hoveredPath === path;

          return (
            <motion.div
              key={path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onMouseEnter={() => setHoveredPath(path)}
              onMouseLeave={() => setHoveredPath(null)}
            >
              <motion.button
                onClick={() => !disabled && onPathChange(path)}
                disabled={disabled}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative w-full text-left p-6 rounded-xl border-2 transition-all duration-300 overflow-hidden
                  ${isSelected
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950/50 dark:to-emerald-950/50 shadow-lg'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
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
                      className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-emerald-50/50 dark:from-blue-950/20 dark:to-emerald-950/20"
                    />
                  )}
                </AnimatePresence>

                {/* Content */}
                <div className="relative z-10">
                  {/* Header with icon and badges */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`
                        p-2.5 rounded-lg transition-colors duration-300 flex-shrink-0
                        ${isSelected
                          ? 'bg-gradient-to-br from-blue-500 to-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }
                      `}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-lg break-words">{path}</h4>
                        {viewMode === 'list' && (
                          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                            {pathDescriptions[path]}
                          </p>
                        )}
                      </div>
                    </div>

                    {stats?.trend && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0 flex-shrink-0">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>

                  {/* Description (grid view only) */}
                  {viewMode === 'grid' && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: isHovered || isSelected ? 'auto' : 0,
                        opacity: isHovered || isSelected ? 1 : 0
                      }}
                      transition={{ duration: 0.2 }}
                      className="text-sm text-muted-foreground mb-3 overflow-hidden"
                    >
                      {pathDescriptions[path]}
                    </motion.p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{stats?.users.toLocaleString()} creators</span>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto"
                      >
                        <Badge className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white border-0">
                          Selected
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="selected-indicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-500"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* AI Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/50 dark:to-emerald-950/50 border border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              AI Suggestion
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
              Based on your color palette mood, we recommend trying <span className="font-semibold">{paths[1]}</span> or <span className="font-semibold">{paths[3]}</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
