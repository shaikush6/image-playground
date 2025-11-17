'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { PaletteEntry } from '@/lib/anthropic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Palette,
  Lock,
  Unlock,
  Shuffle,
  Droplet,
  Sparkles,
  Download,
  Copy,
  RefreshCw,
  Lightbulb,
  Info
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface PalettePlaygroundProps {
  palette: PaletteEntry[];
  onPaletteChange: (palette: PaletteEntry[]) => void;
  onRefresh?: () => void;
}

type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'tetradic';

interface ColorHarmony {
  name: string;
  colors: string[];
  description: string;
}

export function PalettePlayground({ palette, onPaletteChange, onRefresh }: PalettePlaygroundProps) {
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [lockedColors, setLockedColors] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<'edit' | 'mix' | 'harmonies'>('edit');
  const [mixedColor, setMixedColor] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);

  // Color manipulation utilities
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
  };

  // Mix two colors
  const mixColors = useCallback((hex1: string, hex2: string, ratio: number = 0.5): string => {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);

    const mixed = {
      r: rgb1.r * (1 - ratio) + rgb2.r * ratio,
      g: rgb1.g * (1 - ratio) + rgb2.g * ratio,
      b: rgb1.b * (1 - ratio) + rgb2.b * ratio,
    };

    return rgbToHex(mixed.r, mixed.g, mixed.b);
  }, []);

  // Generate color harmonies
  const generateHarmonies = useCallback((baseColor: string): Record<HarmonyType, ColorHarmony> => {
    const rgb = hexToRgb(baseColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    const createColorFromHue = (hue: number) => {
      const rgb = hslToRgb(hue % 360, hsl.s, hsl.l);
      return rgbToHex(rgb.r, rgb.g, rgb.b);
    };

    return {
      complementary: {
        name: 'Complementary',
        colors: [baseColor, createColorFromHue(hsl.h + 180)],
        description: 'Opposite on color wheel - high contrast',
      },
      analogous: {
        name: 'Analogous',
        colors: [
          createColorFromHue(hsl.h - 30),
          baseColor,
          createColorFromHue(hsl.h + 30),
        ],
        description: 'Adjacent colors - harmonious blend',
      },
      triadic: {
        name: 'Triadic',
        colors: [
          baseColor,
          createColorFromHue(hsl.h + 120),
          createColorFromHue(hsl.h + 240),
        ],
        description: 'Evenly spaced - balanced and vibrant',
      },
      'split-complementary': {
        name: 'Split Complementary',
        colors: [
          baseColor,
          createColorFromHue(hsl.h + 150),
          createColorFromHue(hsl.h + 210),
        ],
        description: 'Variation of complementary - softer contrast',
      },
      tetradic: {
        name: 'Tetradic',
        colors: [
          baseColor,
          createColorFromHue(hsl.h + 90),
          createColorFromHue(hsl.h + 180),
          createColorFromHue(hsl.h + 270),
        ],
        description: 'Two complementary pairs - rich palette',
      },
    };
  }, []);

  // Handle color selection for mixing
  const toggleColorSelection = (index: number) => {
    setSelectedColors(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      if (prev.length < 2) {
        return [...prev, index];
      }
      return [prev[1], index];
    });
  };

  // Mix selected colors
  const handleMixColors = () => {
    if (selectedColors.length === 2) {
      const mixed = mixColors(
        palette[selectedColors[0]].hex,
        palette[selectedColors[1]].hex
      );
      setMixedColor(mixed);
    }
  };

  // Toggle color lock
  const toggleLock = (index: number) => {
    setLockedColors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Adjust color property
  const adjustColor = (index: number, property: 'h' | 's' | 'l', value: number) => {
    const rgb = hexToRgb(palette[index].hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    const newHsl = { ...hsl, [property]: value };
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);

    const newPalette = [...palette];
    newPalette[index] = { ...newPalette[index], hex: newHex };
    onPaletteChange(newPalette);
  };

  // Export palette
  const exportPalette = (format: 'css' | 'tailwind' | 'json') => {
    let content = '';
    const colors = palette.map((c, i) => ({ name: c.name || `color-${i + 1}`, hex: c.hex }));

    switch (format) {
      case 'css':
        content = `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`;
        break;
      case 'tailwind':
        content = `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colors.map((c, i) => `        'palette-${i + 1}': '${c.hex}',`).join('\n')}\n      }\n    }\n  }\n}`;
        break;
      case 'json':
        content = JSON.stringify(colors, null, 2);
        break;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette.${format === 'tailwind' ? 'js' : format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="border-2 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Palette Playground</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Experiment with your colors before generating content
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExport(!showExport)}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Re-extract
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Export Menu */}
        <AnimatePresence>
          {showExport && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800"
            >
              <Label className="text-sm font-semibold mb-3 block">Export Format</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportPalette('css')}
                  className="flex-1"
                >
                  CSS Variables
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportPalette('tailwind')}
                  className="flex-1"
                >
                  Tailwind Config
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportPalette('json')}
                  className="flex-1"
                >
                  JSON
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'edit'
                ? 'bg-white dark:bg-slate-700 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Droplet className="h-4 w-4 inline mr-2" />
            Edit Colors
          </button>
          <button
            onClick={() => setActiveTab('mix')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'mix'
                ? 'bg-white dark:bg-slate-700 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Shuffle className="h-4 w-4 inline mr-2" />
            Mix Colors
          </button>
          <button
            onClick={() => setActiveTab('harmonies')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'harmonies'
                ? 'bg-white dark:bg-slate-700 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-4 w-4 inline mr-2" />
            Harmonies
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'edit' && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {palette.map((color, index) => {
                const rgb = hexToRgb(color.hex);
                const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                const isLocked = lockedColors.has(index);

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isLocked
                        ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-16 h-16 rounded-lg shadow-lg border-4 border-white dark:border-slate-700 flex-shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{color.name}</h4>
                          <button
                            onClick={() => copyToClipboard(color.hex)}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Copy className="h-3 w-3 inline mr-1" />
                            {color.hex}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          RGB({Math.round(rgb.r)}, {Math.round(rgb.g)}, {Math.round(rgb.b)})
                        </p>
                      </div>
                      <Button
                        variant={isLocked ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleLock(index)}
                        className={isLocked ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                      >
                        {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </Button>
                    </div>

                    {!isLocked && (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs">Hue: {Math.round(hsl.h)}°</Label>
                          <Slider
                            value={[hsl.h]}
                            onValueChange={([v]) => adjustColor(index, 'h', v)}
                            max={360}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Saturation: {Math.round(hsl.s)}%</Label>
                          <Slider
                            value={[hsl.s]}
                            onValueChange={([v]) => adjustColor(index, 's', v)}
                            max={100}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Lightness: {Math.round(hsl.l)}%</Label>
                          <Slider
                            value={[hsl.l]}
                            onValueChange={([v]) => adjustColor(index, 'l', v)}
                            max={100}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'mix' && (
            <motion.div
              key="mix"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Select two colors to mix
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Click on two colors below, then hit the mix button to create a blend
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {palette.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => toggleColorSelection(index)}
                    className={`aspect-square rounded-lg shadow-lg transition-all hover:scale-105 ${
                      selectedColors.includes(index)
                        ? 'ring-4 ring-blue-500 scale-105'
                        : 'hover:ring-2 hover:ring-slate-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {selectedColors.includes(index) && (
                      <Badge className="bg-blue-600 text-white">
                        {selectedColors.indexOf(index) + 1}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>

              {selectedColors.length === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <Button
                    onClick={handleMixColors}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    <Shuffle className="h-5 w-5 mr-2" />
                    Mix Colors
                  </Button>
                </motion.div>
              )}

              {mixedColor && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800"
                >
                  <Label className="text-sm font-semibold mb-3 block">Mixed Result</Label>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-24 h-24 rounded-lg shadow-xl border-4 border-white dark:border-slate-700"
                      style={{ backgroundColor: mixedColor }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{mixedColor}</p>
                      <p className="text-sm text-muted-foreground">
                        Blend of {palette[selectedColors[0]].name} and {palette[selectedColors[1]].name}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => copyToClipboard(mixedColor)}
                      >
                        <Copy className="h-3 w-3 mr-2" />
                        Copy Color
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'harmonies' && (
            <motion.div
              key="harmonies"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                      Explore color harmonies
                    </p>
                    <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                      See what colors work well together based on color theory
                    </p>
                  </div>
                </div>
              </div>

              {palette.map((color, index) => {
                const harmonies = generateHarmonies(color.hex);

                return (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg shadow-lg border-2 border-white dark:border-slate-700"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div>
                        <h4 className="font-semibold">{color.name}</h4>
                        <p className="text-xs text-muted-foreground">Base color</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                      {Object.entries(harmonies).map(([type, harmony]) => (
                        <div
                          key={type}
                          className="p-3 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                        >
                          <p className="text-sm font-medium mb-2">{harmony.name}</p>
                          <p className="text-xs text-muted-foreground mb-3">{harmony.description}</p>
                          <div className="flex gap-2">
                            {harmony.colors.map((c, i) => (
                              <div
                                key={i}
                                className="flex-1 h-12 rounded shadow-md border-2 border-white dark:border-slate-700 cursor-pointer hover:scale-105 transition-transform"
                                style={{ backgroundColor: c }}
                                onClick={() => copyToClipboard(c)}
                                title={`Click to copy ${c}`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
