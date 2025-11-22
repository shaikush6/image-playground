'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import {
  Palette,
  Brain,
  Image,
  Video,
  Layers,
  Sparkles,
  Check
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PaletteEntry } from '@/lib/anthropic';

interface EnhancedGenerationProgressProps {
  progress: number;
  formats: string[];
  palette?: PaletteEntry[];
  currentPath?: string;
}

interface GenerationStage {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  progressRange: [number, number];
  colors?: string[];
}

export function EnhancedGenerationProgress({
  progress,
  formats,
  palette,
  currentPath,
}: EnhancedGenerationProgressProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [activeColors, setActiveColors] = useState<string[]>([]);

  const stages: GenerationStage[] = useMemo(() => [
    {
      id: 'analyzing',
      label: 'Analyzing Palette',
      description: 'Understanding color relationships and emotional tones',
      icon: Palette,
      progressRange: [0, 20],
      colors: palette?.slice(0, 2).map(p => p.hex),
    },
    {
      id: 'conceptualizing',
      label: 'Generating Concepts',
      description: 'Creating creative ideas based on your preferences',
      icon: Brain,
      progressRange: [20, 45],
      colors: palette?.slice(2, 4).map(p => p.hex),
    },
    {
      id: 'creating',
      label: 'Creating Content',
      description: `Generating ${formats.join(', ')} with AI`,
      icon: formats.includes('video') ? Video : formats.includes('series') ? Layers : Image,
      progressRange: [45, 85],
      colors: palette?.slice(4, 6).map(p => p.hex),
    },
    {
      id: 'finalizing',
      label: 'Finalizing',
      description: 'Polishing and optimizing your creative content',
      icon: Sparkles,
      progressRange: [85, 100],
      colors: palette?.map(p => p.hex),
    },
  ], [palette, formats]);

  // Update current stage based on progress
  useEffect(() => {
    const stage = stages.findIndex(
      (s) => progress >= s.progressRange[0] && progress <= s.progressRange[1]
    );
    if (stage !== -1) {
      setCurrentStage(stage);
      if (stages[stage].colors) {
        setActiveColors(stages[stage].colors || []);
      }
    }
  }, [progress, stages]);

  // Calculate estimated time remaining
  const estimatedMinutes = Math.max(1, Math.ceil((100 - progress) / 20));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="inline-block mb-3"
        >
          <Sparkles className="h-8 w-8 text-blue-600" />
        </motion.div>
        <h3 className="text-xl font-semibold mb-1">Creating Your {currentPath}</h3>
        <p className="text-sm text-muted-foreground">
          Estimated time: {estimatedMinutes} {estimatedMinutes === 1 ? 'minute' : 'minutes'}
        </p>
      </div>

      {/* Progress bar with gradient */}
      <div className="relative">
        <Progress value={progress} className="h-3" />
        <motion.div
          className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500 opacity-75"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = index === currentStage;
          const isCompleted = progress > stage.progressRange[1];

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: isActive ? 1.05 : 1,
              }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-300
                ${isActive
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950/50 dark:to-emerald-950/50 shadow-lg'
                  : isCompleted
                  ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/30'
                  : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/30'
                }
              `}
            >
              {/* Icon */}
              <div className="flex items-center gap-3 mb-2">
                <div className={`
                  p-2 rounded-lg transition-colors duration-300
                  ${isActive
                    ? 'bg-gradient-to-br from-blue-500 to-emerald-500 text-white'
                    : isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }
                `}>
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{stage.label}</h4>
                </div>
              </div>

              {/* Description */}
              <AnimatePresence>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-muted-foreground mt-2"
                  >
                    {stage.description}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Color dots for active stage */}
              {isActive && stage.colors && stage.colors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-1 mt-3"
                >
                  {stage.colors.map((color, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </motion.div>
              )}

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="active-stage"
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Live color preview */}
      {palette && activeColors.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
        >
          <div className="flex-shrink-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Using Colors
            </p>
          </div>
          <div className="flex gap-2 flex-1">
            {activeColors.map((color, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex-1 h-8 rounded-lg shadow-inner"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Fun fact or tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800"
      >
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <Sparkles className="inline h-3 w-3 mr-1" />
          Did you know? Colors can evoke different emotions and influence creativity in unique ways!
        </p>
      </motion.div>
    </motion.div>
  );
}
