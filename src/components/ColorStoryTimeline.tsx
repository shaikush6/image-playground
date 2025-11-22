'use client';

import { motion } from 'framer-motion';
import {
  Upload,
  Palette,
  Wand2,
  Sparkles,
  Check
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ColorStoryTimelineProps {
  currentStep: 'upload' | 'extract' | 'customize' | 'generate' | 'complete';
  compact?: boolean;
}

interface TimelineStep {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export function ColorStoryTimeline({ currentStep, compact = false }: ColorStoryTimelineProps) {
  const steps: TimelineStep[] = [
    {
      id: 'upload',
      label: 'Upload',
      description: 'Choose inspiration',
      icon: Upload,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      id: 'extract',
      label: 'Extract',
      description: 'Analyze colors',
      icon: Palette,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
      id: 'customize',
      label: 'Customize',
      description: 'Fine-tune vision',
      icon: Wand2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      id: 'generate',
      label: 'Generate',
      description: 'Create content',
      icon: Sparkles,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    },
    {
      id: 'complete',
      label: 'Complete',
      description: 'Enjoy results',
      icon: Check,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.id === currentStep);
  };

  const currentIndex = getCurrentStepIndex();

  if (compact) {
    return (
      <div className="flex items-center justify-between max-w-4xl mx-auto px-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                    ${isActive
                      ? `${step.bgColor} border-current ${step.color} shadow-lg scale-110`
                      : isCompleted
                      ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-600'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}

                  {isActive && (
                    <motion.div
                      className={`absolute inset-0 rounded-full ${step.bgColor} opacity-50`}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                <p className={`text-xs font-medium mt-2 ${isActive ? step.color : 'text-muted-foreground'}`}>
                  {step.label}
                </p>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 relative">
                  <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
        <motion.div
          className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-blue-500 via-emerald-500 to-green-500"
          initial={{ height: 0 }}
          animate={{ height: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-6"
              >
                {/* Icon */}
                <motion.div
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  className={`
                    relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 border-white dark:border-slate-900 shadow-lg transition-all duration-300
                    ${isActive
                      ? `${step.bgColor} ${step.color}`
                      : isCompleted
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-7 w-7" />
                  ) : (
                    <Icon className="h-7 w-7" />
                  )}

                  {isActive && (
                    <>
                      <motion.div
                        className={`absolute inset-0 rounded-full ${step.bgColor} opacity-50`}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute -top-2 -right-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                      </motion.div>
                    </>
                  )}
                </motion.div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-lg font-semibold ${isActive ? step.color : isCompleted ? 'text-green-600' : 'text-slate-600 dark:text-slate-400'}`}>
                      {step.label}
                    </h3>
                    {isActive && (
                      <Badge className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white border-0">
                        Current
                      </Badge>
                    )}
                    {isCompleted && (
                      <Badge variant="outline" className="border-green-500 text-green-600">
                        Completed
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>

                  {/* Progress details for active step */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/50 dark:to-emerald-950/50 border border-blue-200 dark:border-blue-800"
                    >
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        You&apos;re currently at this step in your creative journey. Complete this to move forward!
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
