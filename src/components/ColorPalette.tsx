'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PaletteEntry } from '@/lib/anthropic';

interface ColorPaletteProps {
  palette: PaletteEntry[];
  moodDescription?: string;
}

export function ColorPalette({ palette, moodDescription }: ColorPaletteProps) {
  const getContrastColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {moodDescription && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center px-2"
        >
          <div className="bg-secondary/50 rounded-lg p-4 max-w-full">
            <p className="text-sm font-medium break-words overflow-wrap-anywhere leading-relaxed">
              🎨 {moodDescription}
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {palette.map((color, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            <Card
              className="relative overflow-hidden h-32 transition-all duration-300 hover:shadow-lg cursor-pointer"
              style={{ backgroundColor: color.hex }}
            >
              <div
                className="absolute inset-0 flex flex-col justify-between p-3"
                style={{ color: getContrastColor(color.hex) }}
              >
                <div className="text-xs font-medium opacity-90 break-words">
                  {color.name}
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-mono opacity-80">
                    {color.hex}
                  </div>
                  {color.suggested_role && (
                    <Badge
                      variant="outline"
                      className="text-xs border-current max-w-full"
                      style={{
                        borderColor: getContrastColor(color.hex),
                        color: getContrastColor(color.hex),
                      }}
                    >
                      <span className="break-words overflow-wrap-anywhere text-center">
                        {color.suggested_role}
                      </span>
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}