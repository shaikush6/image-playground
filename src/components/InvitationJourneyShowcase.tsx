'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PenSquare, Palette, Rainbow, PartyPopper, Images, Sparkles, Mail, LayoutGrid } from 'lucide-react';
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
    colors?: string[];
    badge?: string;
    result?: string;
  };
}

const invitationStages: JourneyStage[] = [
  {
    id: 'details',
    label: 'Event Story',
    icon: PenSquare,
    color: 'from-rose-500 to-orange-400',
    description: 'Title, vibes, hosts',
    example: {
      emoji: '✍️',
    },
  },
  {
    id: 'style',
    label: 'Style Board',
    icon: Palette,
    color: 'from-violet-500 to-indigo-500',
    description: 'Templates + typography',
    example: {
      emoji: '🎨',
    },
  },
  {
    id: 'templates',
    label: 'Template Remix',
    icon: LayoutGrid,
    color: 'from-sky-500 to-teal-500',
    description: 'Layouts & prompts',
    example: {
      badge: 'Editorial save the date',
    },
  },
  {
    id: 'color',
    label: 'Color Chemistry',
    icon: Rainbow,
    color: 'from-emerald-500 to-teal-500',
    description: 'Palettes & gradients',
    example: {
      colors: ['#F43F5E', '#FB923C', '#FACC15', '#4ADE80', '#60A5FA'],
    },
  },
  {
    id: 'output',
    label: 'Invitation Suite',
    icon: PartyPopper,
    color: 'from-amber-500 to-pink-500',
    description: 'Images + video preview',
    example: {
      result: '🎉',
    },
  },
];

export function InvitationJourneyShowcase() {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % invitationStages.length);
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  const stageCount = invitationStages.length;
  const journeyProgress = stageCount <= 1 ? 0 : (currentStage / (stageCount - 1)) * 100;

  return (
    <div className="relative py-16 px-8 rounded-3xl border border-rose-100 dark:border-rose-900/40 bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-rose-950/30 dark:via-slate-950/40 dark:to-amber-950/10 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4 bg-white/70 dark:bg-slate-900/40 border-rose-200 dark:border-rose-900 text-xs uppercase tracking-wide">
          Invitation Flow
        </Badge>
        <motion.h3
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-2 text-rose-600 dark:text-rose-200"
        >
          Storyboard Your Celebration
        </motion.h3>
        <p className="text-muted-foreground">
          Turn your event details into a gallery-ready invitation suite
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
            className="text-rose-200 dark:text-rose-800/50"
            strokeWidth="4"
            fill="none"
            strokeDasharray="10,5"
          />

          {/* Active path that grows */}
          <motion.path
            d="M 0,100 Q 250,50 500,100 T 1000,100"
            stroke="url(#invitation-gradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: (currentStage + 1) / invitationStages.length }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="invitation-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="33%" stopColor="#8B5CF6" />
              <stop offset="66%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>

        {/* Journey Stages */}
        <div className="relative h-64 flex items-center justify-between">
          {invitationStages.map((stage, index) => {
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
                    isCurrent ? 'text-rose-600 dark:text-rose-400' : ''
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

                      {/* Template badge example */}
                      {stage.example.badge && (
                        <Badge variant="secondary" className="text-[11px] uppercase tracking-wide">
                          {stage.example.badge}
                        </Badge>
                      )}

                      {/* Colors example */}
                      {stage.example.colors && (
                        <div className="flex gap-1">
                          {stage.example.colors.map((color, i) => (
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

        {/* Traveling Envelope */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 z-20"
          animate={{
            left: `${journeyProgress}%`,
          }}
          transition={{ duration: 2.4, ease: 'easeInOut' }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              scale: { duration: 1, repeat: Infinity },
              rotate: { duration: 2.4, ease: 'linear', repeat: Infinity },
            }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 via-amber-500 to-pink-500 shadow-lg flex items-center justify-center"
          >
            <Mail className="w-5 h-5 text-white" />
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
            { icon: Images, label: 'Invitations', count: '300+', color: 'rose' },
            { icon: Sparkles, label: 'Styles', count: '50+', color: 'violet' },
            { icon: PartyPopper, label: 'Events', count: '100+', color: 'amber' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="text-center p-6 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-rose-100 dark:border-rose-900/30"
            >
              <stat.icon className={`h-8 w-8 mx-auto mb-3 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              <p className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
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
