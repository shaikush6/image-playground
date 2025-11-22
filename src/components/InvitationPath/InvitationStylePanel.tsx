'use client';

import { motion } from 'framer-motion';
import { InvitationStyle } from '@/config/invitations';
import { Badge } from '@/components/ui/badge';

interface InvitationStylePanelProps {
  styles: InvitationStyle[];
  selectedStyleId?: string;
  onSelectStyle: (styleId: string) => void;
  disabled?: boolean;
}

export function InvitationStylePanel({
  styles,
  selectedStyleId,
  onSelectStyle,
  disabled = false,
}: InvitationStylePanelProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {styles.map((style) => {
        const isSelected = style.id === selectedStyleId;

        return (
          <motion.button
            key={style.id}
            type="button"
            onClick={() => !disabled && onSelectStyle(style.id)}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.01 }}
            whileTap={{ scale: disabled ? 1 : 0.99 }}
            className={`
              relative text-left p-4 rounded-xl border-2 transition-all duration-200 shadow-sm
              ${isSelected
                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/20'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 hover:border-purple-300'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {isSelected && (
              <motion.div
                layoutId="invitation-style"
                className="absolute inset-0 border-2 border-purple-500 rounded-xl pointer-events-none"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{style.name}</p>
                  <p className="text-sm text-muted-foreground">{style.description}</p>
                </div>
                {style.colorScheme && (
                  <div className="flex -space-x-1">
                    {style.colorScheme.map((color) => (
                      <span
                        key={color}
                        className="h-6 w-6 rounded-full border border-white dark:border-slate-900"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                {style.promptTemplate.replace(/\s+/g, ' ')}
              </div>

              <Badge variant={isSelected ? 'default' : 'secondary'}>
                {isSelected ? 'Selected' : 'Tap to Select'}
              </Badge>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
