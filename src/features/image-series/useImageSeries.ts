import { useState, useEffect } from 'react';
import { getDomainThemes } from '@/config/themes';
import { AspectRatioId } from '@/config/aspectRatios';

export interface ImageSeriesConfig {
  count: number; // 3-10
  themeId: string; // 'auto' or specific theme ID
  aspectRatio: AspectRatioId;
}

export function useImageSeries(domain: string) {
  const [config, setConfig] = useState<ImageSeriesConfig>(() => {
    const domainThemes = getDomainThemes(domain);
    const autoTheme = domainThemes?.autoTheme;

    return {
      count: autoTheme?.seriesSize.default || 5,
      themeId: 'auto',
      aspectRatio: autoTheme?.preferredAspectRatio || '1:1'
    };
  });

  // Update when domain changes
  useEffect(() => {
    const domainThemes = getDomainThemes(domain);
    const autoTheme = domainThemes?.autoTheme;

    setConfig({
      count: autoTheme?.seriesSize.default || 5,
      themeId: 'auto',
      aspectRatio: autoTheme?.preferredAspectRatio || '1:1'
    });
  }, [domain]);

  const setCount = (count: number) => {
    setConfig(prev => ({ ...prev, count: Math.max(3, Math.min(10, count)) }));
  };

  const setTheme = (themeId: string) => {
    setConfig(prev => ({ ...prev, themeId }));

    // Update aspect ratio to theme's preferred ratio
    const domainThemes = getDomainThemes(domain);
    if (domainThemes) {
      const theme = themeId === 'auto'
        ? domainThemes.autoTheme
        : domainThemes.themes.find(t => t.id === themeId);

      if (theme) {
        setConfig(prev => ({
          ...prev,
          aspectRatio: theme.preferredAspectRatio,
          count: theme.seriesSize.default
        }));
      }
    }
  };

  const setAspectRatio = (aspectRatio: AspectRatioId) => {
    setConfig(prev => ({ ...prev, aspectRatio }));
  };

  return {
    config,
    setCount,
    setTheme,
    setAspectRatio
  };
}
