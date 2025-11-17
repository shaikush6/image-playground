'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Upload, Palette, Wand2, Sparkles, Camera, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface JourneyStage {
  id: string;
  icon: any;
  label: string;
  color: string;
  example: {
    image?: string;
    palette?: string[];
    path?: string;
    result?: string;
  };
}

const journeyStages: JourneyStage[] = [
  {
    id: 'upload',
    icon: Upload,
    label: 'Upload',
    color: 'from-blue-500 to-cyan-500',
    example: {
      image: '🏔️',
    },
  },
  {
    id: 'extract',
    icon: Palette,
    label: 'Extract Palette',
    color: 'from-purple-500 to-pink-500',
    example: {
      palette: ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B', '#7ED321'],
    },
  },
  {
    id: 'create',
    icon: Wand2,
    label: 'Choose Path',
    color: 'from-emerald-500 to-teal-500',
    example: {
      path: '🍽️ Cooking',
    },
  },
  {
    id: 'result',
    icon: Sparkles,
    label: 'Create Magic',
    color: 'from-orange-500 to-red-500',
    example: {
      result: '✨',
    },
  },
];

export function AnimatedJourneyShowcase() {
  const [currentStage, setCurrentStage] = useState(0);
  const [travelerPosition, setTravelerPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % journeyStages.length);
      setTravelerPosition((prev) => (prev + 25) % 100);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative py-16 px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h3
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-2"
        >
          Your Creative Journey
        </motion.h3>
        <p className="text-muted-foreground">
          Watch your inspiration transform into stunning content
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
            className="text-slate-200 dark:text-slate-700"
            strokeWidth="4"
            fill="none"
            strokeDasharray="10,5"
          />

          {/* Active path that grows */}
          <motion.path
            d="M 0,100 Q 250,50 500,100 T 1000,100"
            stroke="url(#gradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: (currentStage + 1) / journeyStages.length }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="33%" stopColor="#8B5CF6" />
              <stop offset="66%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>

        {/* Journey Stages */}
        <div className="relative h-64 flex items-center justify-between">
          {journeyStages.map((stage, index) => {
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
                <motion.p
                  animate={{
                    opacity: isActive ? 1 : 0.5,
                    scale: isCurrent ? 1.05 : 1,
                  }}
                  className={`mt-3 text-sm font-medium ${
                    isCurrent ? 'text-blue-600 dark:text-blue-400' : ''
                  }`}
                >
                  {stage.label}
                </motion.p>

                {/* Example Content */}
                <AnimatePresence mode="wait">
                  {isCurrent && (
                    <motion.div
                      key={`example-${stage.id}`}
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className="absolute top-24 mt-2"
                    >
                      {/* Image example */}
                      {stage.example.image && (
                        <div className="text-4xl">{stage.example.image}</div>
                      )}

                      {/* Palette example */}
                      {stage.example.palette && (
                        <div className="flex gap-1">
                          {stage.example.palette.map((color, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="w-8 h-8 rounded-full shadow-md"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Path example */}
                      {stage.example.path && (
                        <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
                          {stage.example.path}
                        </Badge>
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

        {/* Traveling Color Droplet */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 z-20"
          animate={{
            left: `${travelerPosition}%`,
          }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              scale: { duration: 1, repeat: Infinity },
              rotate: { duration: 2.5, ease: 'linear', repeat: Infinity },
            }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg"
          >
            <div className="absolute inset-1 bg-white/30 rounded-full blur-sm" />
          </motion.div>
        </motion.div>
      </div>

      {/* Example Results Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Camera, label: 'Images', count: '1000+' },
            { icon: Video, label: 'Videos', count: '500+' },
            { icon: Sparkles, label: 'Series', count: '300+' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700"
            >
              <stat.icon className="h-8 w-8 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stat.count}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label} Created</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
