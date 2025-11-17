import { useState, useEffect } from 'react';
import { AspectRatioId, getDomainDefaults } from '@/config/aspectRatios';

export interface AspectRatioState {
  imageAspectRatio: AspectRatioId;
  videoAspectRatio: AspectRatioId;
}

export function useAspectRatio(domain: string) {
  const [aspectRatios, setAspectRatios] = useState<AspectRatioState>(() => {
    const defaults = getDomainDefaults(domain);
    return {
      imageAspectRatio: defaults.image,
      videoAspectRatio: defaults.video
    };
  });

  // Update defaults when domain changes
  useEffect(() => {
    const defaults = getDomainDefaults(domain);
    setAspectRatios({
      imageAspectRatio: defaults.image,
      videoAspectRatio: defaults.video
    });
  }, [domain]);

  const setImageAspectRatio = (ratio: AspectRatioId) => {
    setAspectRatios(prev => ({ ...prev, imageAspectRatio: ratio }));
  };

  const setVideoAspectRatio = (ratio: AspectRatioId) => {
    setAspectRatios(prev => ({ ...prev, videoAspectRatio: ratio }));
  };

  return {
    ...aspectRatios,
    setImageAspectRatio,
    setVideoAspectRatio
  };
}
