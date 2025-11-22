'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PRODUCT_COLOR_PRESETS = [
  {
    id: 'bold-citrus',
    label: 'Bold Citrus',
    description: 'High-energy backdrop for summer launches',
    colors: ['#FF6B35', '#FFD166', '#06D6A0', '#1B4332'],
  },
  {
    id: 'minimal-neon',
    label: 'Minimal Neon',
    description: 'Electric glows for futuristic tech drops',
    colors: ['#0F172A', '#9333EA', '#22D3EE', '#F8F7FF'],
  },
  {
    id: 'earthy-luxe',
    label: 'Earthy Luxe',
    description: 'Terracotta warmth for lifestyle shoots',
    colors: ['#8D5524', '#C08A60', '#F1E0C5', '#2F2F2F'],
  },
  {
    id: 'coastal-soft',
    label: 'Coastal Soft',
    description: 'Spa-like palette with breezy neutrals',
    colors: ['#D0E8F2', '#7AB8BF', '#F6E7CB', '#1E3D58'],
  },
];

interface ProductColorPaletteSelectorProps {
  value: string[];
  onChange: (colors: string[]) => void;
  disabled?: boolean;
}

export function ProductColorPaletteSelector({
  value,
  onChange,
  disabled = false,
}: ProductColorPaletteSelectorProps) {
  const handleSelect = (colors: string[]) => {
    if (disabled) return;
    const isSame =
      value.length === colors.length && value.every((color, index) => color === colors[index]);
    onChange(isSame ? [] : colors);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Color Vibes</p>
          <p className="text-xs text-muted-foreground">Optional mood overlays for each scene.</p>
          <Badge variant="outline" className="mt-1 text-[10px] uppercase tracking-wide">
            Applied to image + video prompts
          </Badge>
        </div>
        {value.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => onChange([])} disabled={disabled}>
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRODUCT_COLOR_PRESETS.map((preset) => {
          const isActive =
            value.length === preset.colors.length &&
            value.every((color, index) => color === preset.colors[index]);

          return (
            <motion.button
              key={preset.id}
              type="button"
              onClick={() => handleSelect(preset.colors)}
              disabled={disabled}
              whileHover={{ scale: disabled ? 1 : 1.01 }}
              className={`text-left rounded-2xl border p-4 transition ${
                isActive
                  ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/20 shadow'
                  : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div>
                  <p className="font-semibold">{preset.label}</p>
                  <p className="text-xs text-muted-foreground">{preset.description}</p>
                </div>
                {isActive && <Badge variant="default">Selected</Badge>}
              </div>

              <div className="flex gap-2">
                {preset.colors.map((color) => (
                  <span
                    key={color}
                    className="h-8 w-8 rounded-full border border-white shadow"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-3">
                Guides lighting, props, and set styling cues during generation.
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
