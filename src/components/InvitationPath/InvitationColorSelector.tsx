'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface InvitationColorSelectorProps {
  basePalette?: string[];
  suggestions?: string[][];
  value: string[];
  onChange: (colors: string[]) => void;
}

function normalizeHex(color: string) {
  if (!color) return '';
  if (color.startsWith('#') && color.length === 7) return color.toUpperCase();
  if (color.startsWith('#') && color.length === 4) {
    const r = color[1];
    const g = color[2];
    const b = color[3];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return color;
}

export function InvitationColorSelector({ basePalette = [], suggestions = [], value, onChange }: InvitationColorSelectorProps) {
  const derivedSuggestions = useMemo(() => {
    if (suggestions.length > 0) return suggestions;
    if (basePalette.length === 0) return [];
    const combos: string[][] = [];
    for (let i = 0; i < basePalette.length; i += 2) {
      combos.push(basePalette.slice(i, i + 3));
    }
    return combos.slice(0, 3);
  }, [basePalette, suggestions]);

  const handleColorChange = (index: number, color: string) => {
    const next = [...value];
    next[index] = normalizeHex(color);
    onChange(next);
  };

  const addColorStop = () => {
    if (value.length >= 5) return;
    onChange([...value, '#FFFFFF']);
  };

  const removeColorStop = (index: number) => {
    const next = value.filter((_, idx) => idx !== index);
    onChange(next);
  };

  const applySuggestion = (colors: string[]) => {
    onChange(colors.map(normalizeHex));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Color Direction</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const fallback = basePalette.length ? basePalette : (derivedSuggestions[0] || ['#FFFFFF', '#000000', '#999999']);
            onChange(fallback.map(normalizeHex));
          }}
          disabled={basePalette.length === 0 && derivedSuggestions.length === 0}
        >
          Use style palette
        </Button>
      </div>

      {derivedSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {derivedSuggestions.map((combo, index) => (
            <button
              key={`${combo.join('-')}-${index}`}
              type="button"
              onClick={() => applySuggestion(combo)}
              className="flex gap-1 items-center rounded-full border border-emerald-200 dark:border-emerald-800 px-3 py-1"
            >
              {combo.map((color) => (
                <span
                  key={color}
                  className="h-5 w-5 rounded-full border border-white shadow"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              <span className="text-xs text-muted-foreground">Apply</span>
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {value.map((color, index) => (
          <motion.div
            key={`${color}-${index}`}
            layout
            className="flex items-center gap-2"
          >
            <Input
              type="color"
              value={color}
              onChange={(event) => handleColorChange(index, event.target.value)}
              className="h-10 w-16"
            />
            <Input
              value={color}
              onChange={(event) => handleColorChange(index, event.target.value)}
              className="font-mono text-sm"
            />
            {value.length > 2 && (
              <Button variant="ghost" size="icon" onClick={() => removeColorStop(index)}>
                ×
              </Button>
            )}
          </motion.div>
        ))}

        {value.length < 5 && (
          <Button variant="outline" size="sm" onClick={addColorStop}>
            Add Color
          </Button>
        )}
      </div>
    </div>
  );
}
