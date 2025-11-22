'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Video, Layers, Sparkles, Clock, Users, Images } from 'lucide-react';
import { useCallback } from 'react';

export type OutputFormat = 'image' | 'video' | 'series' | 'combined' | 'image-series';

interface OutputOption {
  id: OutputFormat;
  label: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  duration?: string;
  socialPlatforms?: string[];
}

interface OutputFormatSelectorProps {
  selectedFormats: OutputFormat[];
  onSelectionChange: (formats: OutputFormat[]) => void;
  isGenerating?: boolean;
}

const OUTPUT_OPTIONS: OutputOption[] = [
  {
    id: 'image',
    label: 'Static Image',
    description: 'High-quality concept visualization',
    icon: <Camera className="h-5 w-5" />,
    badge: 'Fast',
    duration: '~30s',
    socialPlatforms: ['Instagram Post', 'Pinterest', 'Facebook']
  },
  {
    id: 'image-series',
    label: 'Image Series',
    description: 'Professional 3-10 image storytelling sequence',
    icon: <Images className="h-5 w-5" />,
    badge: 'Professional',
    duration: '~2-5min',
    socialPlatforms: ['Instagram Carousel', 'Portfolio', 'Blog', 'Marketing Campaign']
  },
  {
    id: 'video',
    label: 'Single Video',
    description: 'Cinematic 3-15 second video clip',
    icon: <Video className="h-5 w-5" />,
    badge: 'Popular',
    duration: '~3-5min',
    socialPlatforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts']
  },
  {
    id: 'series',
    label: 'Video Series',
    description: 'Multi-part storytelling sequence',
    icon: <Layers className="h-5 w-5" />,
    badge: 'Premium',
    duration: '~15-25min',
    socialPlatforms: ['TikTok Series', 'Instagram Stories', 'YouTube']
  },
  {
    id: 'combined',
    label: 'Complete Package',
    description: 'Image + Video + Series for full campaign',
    icon: <Sparkles className="h-5 w-5" />,
    badge: 'Pro',
    duration: '~20-30min',
    socialPlatforms: ['All Platforms', 'Marketing Campaign', 'Portfolio']
  }
];

export function OutputFormatSelector({ 
  selectedFormats, 
  onSelectionChange, 
  isGenerating = false 
}: OutputFormatSelectorProps) {

  const toggleFormat = useCallback((format: OutputFormat) => {
    if (isGenerating) return;
    
    const isSelected = selectedFormats.includes(format);
    
    if (isSelected) {
      // Remove if already selected
      onSelectionChange(selectedFormats.filter(f => f !== format));
    } else {
      // Add to selection
      onSelectionChange([...selectedFormats, format]);
    }
  }, [selectedFormats, onSelectionChange, isGenerating]);

  const getSelectionSummary = () => {
    if (selectedFormats.length === 0) return "No format selected";
    if (selectedFormats.length === 1) return `${selectedFormats.length} format selected`;
    return `${selectedFormats.length} formats selected`;
  };

  const getTotalDuration = () => {
    if (selectedFormats.length === 0) return "";
    
    // Rough duration estimates in seconds
    const durations: Record<OutputFormat, number> = {
      image: 30,
      'image-series': 210, // 3.5 minutes average (for 5-6 images)
      video: 240, // 4 minutes average
      series: 1200, // 20 minutes
      combined: 1500 // 25 minutes
    };

    const totalSeconds = selectedFormats.reduce((sum, format) => sum + (durations[format] || 0), 0);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (minutes === 0) return `~${seconds}s`;
    if (seconds === 0) return `~${minutes}m`;
    return `~${minutes}m ${seconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Choose Output Format
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Select what to generate from your color palette and customizations
          </p>
        </div>
        
        {selectedFormats.length > 0 && (
          <div className="text-right">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {getSelectionSummary()}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-500">
              {getTotalDuration()} estimated
            </div>
          </div>
        )}
      </div>

      {/* Format Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {OUTPUT_OPTIONS.map((option) => {
          const isSelected = selectedFormats.includes(option.id);
          
          return (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all duration-200 border-2 ${
                isSelected
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950/50 dark:to-emerald-950/50 shadow-lg'
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
              } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => toggleFormat(option.id)}
            >
              <CardContent className="p-6">
                {/* Header with Icon and Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isSelected 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {option.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {option.label}
                      </h4>
                      {option.badge && (
                        <Badge variant={isSelected ? "default" : "secondary"} className="mt-1">
                          {option.badge}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {option.duration && (
                    <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-500">
                      <Clock className="h-4 w-4" />
                      {option.duration}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {option.description}
                </p>

                {/* Social Platforms */}
                {option.socialPlatforms && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500">
                      <Users className="h-4 w-4" />
                      <span>Best for:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {option.socialPlatforms.map((platform) => (
                        <Badge
                          key={platform}
                          variant="outline"
                          className="text-xs border-slate-300 dark:border-slate-600"
                        >
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="mt-4 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Selected</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selection Summary */}
      {selectedFormats.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/50 dark:to-emerald-950/50 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300 mb-2">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold text-lg">Ready to Generate</span>
          </div>
          <p className="text-blue-600 dark:text-blue-400">
            {selectedFormats.length === 1 
              ? `Your ${OUTPUT_OPTIONS.find(o => o.id === selectedFormats[0])?.label.toLowerCase()} will be generated using your color palette and customizations.`
              : `Your ${selectedFormats.length} selected formats will be generated with visual continuity and consistent styling.`
            }
          </p>
          {selectedFormats.length > 1 && (
            <p className="text-blue-500 dark:text-blue-400 mt-1 text-sm">
              💡 Multiple formats will share visual elements for cohesive branding across platforms.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
