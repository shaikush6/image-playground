'use client';

import { motion } from 'framer-motion';
import { ASPECT_RATIOS, AspectRatioId } from '@/config/aspectRatios';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface AspectRatioSelectorProps {
  label: string;
  value: AspectRatioId;
  onChange: (ratio: AspectRatioId) => void;
  disabled?: boolean;
}

export function AspectRatioSelector({ label, value, onChange, disabled = false }: AspectRatioSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>

      <div className="grid grid-cols-3 gap-2">
        {ASPECT_RATIOS.map((ratio) => {
          const Icon = ratio.icon;
          const isSelected = value === ratio.id;

          return (
            <motion.button
              key={ratio.id}
              type="button"
              onClick={() => !disabled && onChange(ratio.id)}
              disabled={disabled}
              whileHover={{ scale: disabled ? 1 : 1.02 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              className={`
                relative p-3 rounded-lg border-2 transition-all duration-200
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-blue-300'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Icon */}
              <div className={`flex justify-center mb-2 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>
                <Icon className="h-6 w-6" />
              </div>

              {/* Label */}
              <div className="text-center">
                <p className={`text-sm font-medium ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-slate-700 dark:text-slate-300'}`}>
                  {ratio.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {ratio.id}
                </p>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  layoutId={`${label}-indicator`}
                  className="absolute inset-0 border-2 border-blue-500 rounded-lg"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Platform hints */}
      <div className="flex flex-wrap gap-1">
        {ASPECT_RATIOS.find(r => r.id === value)?.bestFor.slice(0, 3).map((platform) => (
          <Badge key={platform} variant="secondary" className="text-xs">
            {platform}
          </Badge>
        ))}
      </div>
    </div>
  );
}
