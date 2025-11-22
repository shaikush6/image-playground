'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { PaletteEntry } from '@/lib/anthropic';

interface AdaptiveBackgroundProps {
  palette: PaletteEntry[] | null;
  intensity?: number; // 0-1, how strong the palette influence is
}

export function AdaptiveBackground({ palette, intensity = 0.3 }: AdaptiveBackgroundProps) {
  if (!palette || palette.length === 0) {
    return (
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900" />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={palette.map(p => p.hex).join('-')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className="fixed inset-0 -z-10"
      >
        {/* Primary gradient layer */}
        <div
          className="absolute inset-0 bg-gradient-to-br"
          style={{
            background: `linear-gradient(135deg, ${palette.map((entry, i) => {
              const opacity = intensity * (1 - i / palette.length);
              return `${entry.hex}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
            }).join(', ')})`
          }}
        />

        {/* Overlay for better content readability */}
        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl" />

        {/* Animated gradient mesh overlay */}
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 20% 50%, ${palette[0]?.hex}40 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, ${palette[1]?.hex || palette[0]?.hex}40 0%, transparent 50%),
                        radial-gradient(circle at 40% 20%, ${palette[2]?.hex || palette[0]?.hex}40 0%, transparent 50%)`,
            backgroundSize: '200% 200%',
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
