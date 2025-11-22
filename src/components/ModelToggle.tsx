'use client';

import { motion } from 'framer-motion';
import { Zap, Sparkles } from 'lucide-react';
import type { GeminiModelType } from '@/lib/geminiV2';

interface ModelToggleProps {
  model: GeminiModelType;
  onChange: (model: GeminiModelType) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export function ModelToggle({ model, onChange, disabled = false, size = 'md' }: ModelToggleProps) {
  const sizeClasses = size === 'sm'
    ? 'px-3 py-1.5 text-xs'
    : 'px-4 py-2 text-sm';

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Model:</span>
      <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 shadow-inner">
        <button
          onClick={() => onChange('flash')}
          disabled={disabled}
          title="Gemini Flash - Faster, good for most tasks"
          className={`
            relative ${sizeClasses} rounded-md font-medium transition-all duration-300
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            ${model === 'flash'
              ? 'text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }
          `}
        >
          {model === 'flash' && (
            <motion.div
              layoutId="active-model"
              className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-md shadow-md"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            Flash
          </span>
        </button>

        <button
          onClick={() => onChange('pro')}
          disabled={disabled}
          title="Gemini Pro - Higher quality, best for complex tasks"
          className={`
            relative ${sizeClasses} rounded-md font-medium transition-all duration-300
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            ${model === 'pro'
              ? 'text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }
          `}
        >
          {model === 'pro' && (
            <motion.div
              layoutId="active-model"
              className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-md shadow-md"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Pro
          </span>
        </button>
      </div>
    </div>
  );
}
