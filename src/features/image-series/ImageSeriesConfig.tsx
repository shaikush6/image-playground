'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Images, Sparkles } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatioSelector } from '@/features/aspect-ratio/AspectRatioSelector';
import { getDomainThemes } from '@/config/themes';
import { AspectRatioId } from '@/config/aspectRatios';
import type { ImageSeriesConfig } from './useImageSeries';

interface ImageSeriesConfigProps {
  domain: string;
  config: ImageSeriesConfig;
  onCountChange: (count: number) => void;
  onThemeChange: (themeId: string) => void;
  onAspectRatioChange: (ratio: AspectRatioId) => void;
  disabled?: boolean;
}

export function ImageSeriesConfigPanel({
  domain,
  config,
  onCountChange,
  onThemeChange,
  onAspectRatioChange,
  disabled = false
}: ImageSeriesConfigProps) {
  const domainThemes = getDomainThemes(domain);

  if (!domainThemes) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            No image series themes available for this domain.
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentTheme = config.themeId === 'auto'
    ? domainThemes.autoTheme
    : domainThemes.themes.find(t => t.id === config.themeId) || domainThemes.autoTheme;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Images className="h-5 w-5 text-purple-600" />
            Image Series Configuration
            <Badge variant="secondary" className="ml-auto">
              <Sparkles className="h-3 w-3 mr-1" />
              Professional
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Series Theme</Label>
            <Select
              value={config.themeId}
              onValueChange={onThemeChange}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <div>
                      <div className="font-medium">Smart Auto (Recommended)</div>
                      <div className="text-xs text-muted-foreground">
                        {domainThemes.autoTheme.label}
                      </div>
                    </div>
                  </div>
                </SelectItem>
                {domainThemes.themes.map((theme) => (
                  <SelectItem key={theme.id} value={theme.id}>
                    <div>
                      <div className="font-medium">{theme.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {theme.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentTheme && (
              <p className="text-xs text-muted-foreground">
                {currentTheme.description}
              </p>
            )}
          </div>

          {/* Series Count */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Number of Images</Label>
              <motion.div
                key={config.count}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full"
              >
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                  {config.count} images
                </span>
              </motion.div>
            </div>
            <Slider
              value={[config.count]}
              onValueChange={(values) => onCountChange(values[0])}
              min={3}
              max={10}
              step={1}
              disabled={disabled}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>3</span>
              <span>Quick</span>
              <span>Comprehensive</span>
              <span>10</span>
            </div>
          </div>

          {/* Aspect Ratio for Series */}
          <div className="border-t pt-4">
            <AspectRatioSelector
              label="Series Aspect Ratio"
              value={config.aspectRatio}
              onChange={onAspectRatioChange}
              disabled={disabled}
            />
          </div>

          {/* Series Info */}
          <div className="bg-white/50 dark:bg-slate-900/50 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <p className="text-xs text-muted-foreground">
              <strong className="text-purple-700 dark:text-purple-300">Estimated generation time:</strong>{' '}
              ~{Math.ceil(config.count * 0.5)}-{Math.ceil(config.count * 0.8)} minutes
              <br />
              <strong className="text-purple-700 dark:text-purple-300">Best for:</strong>{' '}
              Professional portfolios, social media carousels, storytelling
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
