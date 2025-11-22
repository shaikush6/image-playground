'use client';

import { motion } from 'framer-motion';
import { Camera, Video, Layers, Minus, Plus, Sparkles, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export type ProductOutputFormat = 'image' | 'video' | 'image-series';

interface SceneConfig {
  categoryId: string;
  variationId?: string;
  customPrompt?: string;
  imageCount: number;
}

interface ProductGenerationConfigProps {
  selectedScenes: SceneConfig[];
  onScenesChange: (scenes: SceneConfig[]) => void;
  selectedFormats: ProductOutputFormat[];
  onFormatsChange: (formats: ProductOutputFormat[]) => void;
  disabled?: boolean;
}

const FORMAT_OPTIONS = [
  {
    id: 'image' as ProductOutputFormat,
    label: 'Images',
    description: 'High-quality product placement images',
    icon: <Camera className="h-5 w-5" />,
    badge: 'Fast',
    duration: '~30s each',
  },
  {
    id: 'video' as ProductOutputFormat,
    label: 'Video',
    description: 'Cinematic product showcase video',
    icon: <Video className="h-5 w-5" />,
    badge: 'Premium',
    duration: '~3-5min',
  },
  {
    id: 'image-series' as ProductOutputFormat,
    label: 'Image Series',
    description: 'Coordinated multi-angle product shots',
    icon: <Layers className="h-5 w-5" />,
    badge: 'Professional',
    duration: '~2-3min',
  },
];

export function ProductGenerationConfig({
  selectedScenes,
  onScenesChange,
  selectedFormats,
  onFormatsChange,
  disabled = false,
}: ProductGenerationConfigProps) {
  const toggleFormat = (format: ProductOutputFormat) => {
    if (disabled) return;

    if (selectedFormats.includes(format)) {
      onFormatsChange(selectedFormats.filter(f => f !== format));
    } else {
      onFormatsChange([...selectedFormats, format]);
    }
  };

  const updateSceneImageCount = (categoryId: string, count: number) => {
    const clampedCount = Math.max(1, Math.min(5, count));
    onScenesChange(
      selectedScenes.map(scene =>
        scene.categoryId === categoryId
          ? { ...scene, imageCount: clampedCount }
          : scene
      )
    );
  };

  const getTotalImages = () => {
    if (!selectedFormats.includes('image')) return 0;
    return selectedScenes.reduce((sum, scene) => sum + scene.imageCount, 0);
  };

  const getEstimatedTime = () => {
    let totalSeconds = 0;

    if (selectedFormats.includes('image')) {
      totalSeconds += getTotalImages() * 30;
    }
    if (selectedFormats.includes('video')) {
      totalSeconds += selectedScenes.length * 240;
    }
    if (selectedFormats.includes('image-series')) {
      totalSeconds += selectedScenes.length * 150;
    }

    const minutes = Math.floor(totalSeconds / 60);
    if (minutes < 1) return `~${totalSeconds}s`;
    return `~${minutes}min`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Output Format Selection */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Output Formats</h3>
          <p className="text-sm text-muted-foreground">
            Select what types of content to generate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FORMAT_OPTIONS.map((option) => {
            const isSelected = selectedFormats.includes(option.id);

            return (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all duration-200 border-2 ${
                  isSelected
                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 shadow-lg'
                    : 'border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => toggleFormat(option.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${
                      isSelected
                        ? 'bg-purple-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {option.icon}
                    </div>
                    <Badge variant={isSelected ? "default" : "secondary"}>
                      {option.badge}
                    </Badge>
                  </div>

                  <h4 className="font-semibold mb-1">{option.label}</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {option.description}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {option.duration}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Per-Scene Image Count (only if images selected) */}
      {selectedFormats.includes('image') && selectedScenes.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Images Per Scene</h3>
            <p className="text-sm text-muted-foreground">
              Configure how many image variations to generate for each scene
            </p>
          </div>

          <div className="space-y-3">
            {selectedScenes.map((scene, index) => (
              <div
                key={scene.categoryId}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">
                    Scene {index + 1}
                  </Badge>
                  <span className="text-sm font-medium">
                    {scene.categoryId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateSceneImageCount(scene.categoryId, scene.imageCount - 1)}
                    disabled={disabled || scene.imageCount <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="w-8 text-center font-semibold">
                    {scene.imageCount}
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateSceneImageCount(scene.categoryId, scene.imageCount + 1)}
                    disabled={disabled || scene.imageCount >= 5}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generation Summary */}
      {selectedFormats.length > 0 && selectedScenes.length > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3 text-purple-700 dark:text-purple-300 mb-3">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold text-lg">Generation Summary</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-purple-600 dark:text-purple-400">Scenes</span>
              <p className="font-semibold text-purple-900 dark:text-purple-100">
                {selectedScenes.length}
              </p>
            </div>

            {selectedFormats.includes('image') && (
              <div>
                <span className="text-purple-600 dark:text-purple-400">Total Images</span>
                <p className="font-semibold text-purple-900 dark:text-purple-100">
                  {getTotalImages()}
                </p>
              </div>
            )}

            {selectedFormats.includes('video') && (
              <div>
                <span className="text-purple-600 dark:text-purple-400">Videos</span>
                <p className="font-semibold text-purple-900 dark:text-purple-100">
                  {selectedScenes.length}
                </p>
              </div>
            )}

            <div>
              <span className="text-purple-600 dark:text-purple-400">Est. Time</span>
              <p className="font-semibold text-purple-900 dark:text-purple-100">
                {getEstimatedTime()}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export type { SceneConfig };
