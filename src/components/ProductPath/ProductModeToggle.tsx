'use client';

import { motion } from 'framer-motion';
import { Palette, Package } from 'lucide-react';

interface ProductModeToggleProps {
  mode: 'color' | 'product';
  onChange: (mode: 'color' | 'product') => void;
  disabled?: boolean;
}

export function ProductModeToggle({ mode, onChange, disabled = false }: ProductModeToggleProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1.5 shadow-inner">
        <button
          onClick={() => onChange('color')}
          disabled={disabled}
          className={`
            relative px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            ${mode === 'color'
              ? 'text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }
          `}
        >
          {mode === 'color' && (
            <motion.div
              layoutId="active-mode"
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg shadow-lg"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Color Palette Mode
          </span>
        </button>

        <button
          onClick={() => onChange('product')}
          disabled={disabled}
          className={`
            relative px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            ${mode === 'product'
              ? 'text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }
          `}
        >
          {mode === 'product' && (
            <motion.div
              layoutId="active-mode"
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Product Path Mode
          </span>
        </button>
      </div>
    </div>
  );
}
