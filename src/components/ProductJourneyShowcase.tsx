'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Upload, Scissors, LayoutGrid, Sparkles, Camera, Video, Package } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface JourneyStage {
  id: string;
  icon: LucideIcon;
  label: string;
  color: string;
  description: string;
  example: {
    emoji?: string;
    scenes?: string[];
    badge?: string;
    result?: string;
  };
}

const stages: JourneyStage[] = [
  {
    id: 'upload',
    label: 'Upload Product',
    icon: Upload,
    color: 'from-purple-500 to-indigo-500',
    description: 'Drop a PNG or photo',
    example: {
      emoji: '📦',
    },
  },
  {
    id: 'extract',
    label: 'Polish & Cutout',
    icon: Scissors,
    color: 'from-pink-500 to-orange-500',
    description: 'Auto background removal',
    example: {
      emoji: '✂️',
    },
  },
  {
    id: 'scene',
    label: 'Scene Library',
    icon: LayoutGrid,
    color: 'from-emerald-500 to-teal-500',
    description: 'Pick up to five worlds',
    example: {
      scenes: ['🏠', '🏖️', '🌃', '🏔️', '🌸'],
    },
  },
  {
    id: 'result',
    label: 'Showtime',
    icon: Sparkles,
    color: 'from-amber-500 to-rose-500',
    description: 'Images + video render',
    example: {
      result: '🎬',
    },
  },
];

export function ProductJourneyShowcase() {
  const [currentStage, setCurrentStage] = useState(0);
  const [travelerPosition, setTravelerPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % stages.length);
      setTravelerPosition((prev) => (prev + 25) % 100);
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative py-16 px-8 rounded-3xl border border-purple-100 dark:border-purple-900/40 bg-gradient-to-br from-purple-50 via-white to-rose-50 dark:from-purple-950/30 dark:via-slate-950/40 dark:to-rose-950/20 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4 bg-white/60 dark:bg-slate-900/40 border-purple-200 dark:border-purple-800 text-xs uppercase tracking-wide">
          Product Path Journey
        </Badge>
        <motion.h3
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
        >
          Stage to Studio in Seconds
        </motion.h3>
        <p className="text-muted-foreground">
          Turn a raw product photo into cinematic campaigns
        </p>
      </div>

      {/* Journey Path Container */}
      <div className="relative max-w-5xl mx-auto">
        {/* Flowing Path Background */}
        <svg
          className="absolute inset-0 w-full h-64 pointer-events-none"
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
        >
          {/* Background path */}
          <motion.path
            d="M 0,100 Q 250,50 500,100 T 1000,100"
            stroke="currentColor"
            className="text-purple-200 dark:text-purple-800/50"
            strokeWidth="4"
            fill="none"
            strokeDasharray="10,5"
          />

          {/* Active path that grows */}
          <motion.path
            d="M 0,100 Q 250,50 500,100 T 1000,100"
            stroke="url(#product-gradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: (currentStage + 1) / stages.length }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="product-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="33%" stopColor="#EC4899" />
              <stop offset="66%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>

        {/* Journey Stages */}
        <div className="relative h-64 flex items-center justify-between">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isActive = index <= currentStage;
            const isCurrent = index === currentStage;

            return (
              <div key={stage.id} className="relative z-10 flex flex-col items-center">
                {/* Stage Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{
                    scale: isActive ? 1 : 0.7,
                    y: isCurrent ? -10 : 0,
                  }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className={`
                    relative w-16 h-16 rounded-full flex items-center justify-center
                    ${isActive
                      ? `bg-gradient-to-br ${stage.color} shadow-lg`
                      : 'bg-slate-200 dark:bg-slate-700'
                    }
                  `}
                >
                  <Icon
                    className={`h-7 w-7 ${isActive ? 'text-white' : 'text-slate-400'}`}
                  />

                  {/* Pulse effect for current stage */}
                  {isCurrent && (
                    <motion.div
                      className={`absolute inset-0 rounded-full bg-gradient-to-br ${stage.color}`}
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                </motion.div>

                {/* Stage Label */}
                <motion.div
                  animate={{
                    opacity: isActive ? 1 : 0.5,
                    scale: isCurrent ? 1.05 : 1,
                  }}
                  className="mt-3 text-center"
                >
                  <p className={`text-sm font-medium ${
                    isCurrent ? 'text-purple-600 dark:text-purple-400' : ''
                  }`}>
                    {stage.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stage.description}</p>
                </motion.div>

                {/* Example Content */}
                <AnimatePresence mode="wait">
                  {isCurrent && (
                    <motion.div
                      key={`example-${stage.id}`}
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className="absolute top-28 mt-2"
                    >
                      {/* Emoji example */}
                      {stage.example.emoji && (
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-4xl"
                        >
                          {stage.example.emoji}
                        </motion.div>
                      )}

                      {/* Scenes example */}
                      {stage.example.scenes && (
                        <div className="flex gap-1">
                          {stage.example.scenes.map((scene, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-lg"
                            >
                              {scene}
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Result example */}
                      {stage.example.result && (
                        <motion.div
                          animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="text-5xl"
                        >
                          {stage.example.result}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Traveling Product Package */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 z-20"
          animate={{
            left: `${travelerPosition}%`,
          }}
          transition={{ duration: 2.6, ease: 'easeInOut' }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              scale: { duration: 1, repeat: Infinity },
              rotate: { duration: 2.6, ease: 'linear', repeat: Infinity },
            }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 shadow-lg flex items-center justify-center"
          >
            <Package className="w-5 h-5 text-white" />
            <div className="absolute inset-1 bg-white/20 rounded-lg blur-sm" />
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Camera, label: 'Product Shots', count: '500+', color: 'purple' },
            { icon: Video, label: 'Videos', count: '200+', color: 'pink' },
            { icon: Sparkles, label: 'Campaigns', count: '100+', color: 'amber' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="text-center p-6 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-purple-100 dark:border-purple-900/30"
            >
              <stat.icon className={`h-8 w-8 mx-auto mb-3 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {stat.count}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
