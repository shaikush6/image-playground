'use client';

import { motion } from 'framer-motion';
import { InvitationCategory } from '@/config/invitations';
import { Badge } from '@/components/ui/badge';

interface InvitationCategorySelectorProps {
  categories: InvitationCategory[];
  selectedCategoryId?: string;
  onSelectCategory: (categoryId: string) => void;
  disabled?: boolean;
}

export function InvitationCategorySelector({
  categories,
  selectedCategoryId,
  onSelectCategory,
  disabled = false,
}: InvitationCategorySelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((category) => {
        const isSelected = category.id === selectedCategoryId;

        return (
          <motion.button
            key={category.id}
            type="button"
            onClick={() => !disabled && onSelectCategory(category.id)}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.01 }}
            whileTap={{ scale: disabled ? 1 : 0.99 }}
            className={`
              relative w-full text-left rounded-xl border-2 p-5 transition-all duration-200 shadow-sm
              ${isSelected
                ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/40 dark:to-cyan-950/30'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 hover:border-emerald-300'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {isSelected && (
              <motion.div
                layoutId="invitation-category"
                className="absolute inset-0 border-2 border-emerald-500 rounded-xl pointer-events-none"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}

            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl" aria-hidden>{category.icon}</span>
                  <div>
                    <p className="text-base font-semibold">{category.name}</p>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <Badge variant={isSelected ? 'default' : 'secondary'}>{category.styles.length} styles</Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.suggestedAspectRatios.map((ratio) => (
                  <Badge
                    key={ratio}
                    variant="outline"
                    className={isSelected ? 'border-emerald-300 text-emerald-700 dark:text-emerald-200' : ''}
                  >
                    {ratio}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
