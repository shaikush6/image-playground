'use client';

import { motion } from 'framer-motion';
import { Palette, Package, Sparkles } from 'lucide-react';

type StudioMode = 'color' | 'product' | 'invitation';

interface ModeToggleProps {
  mode: StudioMode;
  onChange: (mode: StudioMode) => void;
  disabled?: boolean;
}

const MODE_OPTIONS: Array<{
  id: StudioMode;
  label: string;
  gradient: string;
  icon: typeof Palette;
  description: string;
}> = [
  {
    id: 'color',
    label: 'Color Lab',
    gradient: 'from-blue-600 to-emerald-600',
    icon: Palette,
    description: 'Extract palettes and creative directions',
  },
  {
    id: 'product',
    label: 'Product Path',
    gradient: 'from-purple-600 to-pink-600',
    icon: Package,
    description: 'Place products into cinematic scenes',
  },
  {
    id: 'invitation',
    label: 'Event Invitations',
    gradient: 'from-rose-500 to-amber-500',
    icon: Sparkles,
    description: 'Design AI-crafted event invitations',
  },
];

export function ModeToggle({ mode, onChange, disabled = false }: ModeToggleProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1.5 shadow-inner">
        {MODE_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = option.id === mode;

          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              disabled={disabled}
              className={`
                relative px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 min-w-[160px]
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                ${isActive
                  ? 'text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="active-mode"
                  className={`absolute inset-0 bg-gradient-to-r ${option.gradient} rounded-xl shadow-lg`}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex flex-col items-center gap-1 text-center">
                <span className="flex items-center gap-1">
                  <Icon className="h-4 w-4" />
                  {option.label}
                </span>
                <span className="text-[11px] font-normal opacity-80 hidden md:inline">{option.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
