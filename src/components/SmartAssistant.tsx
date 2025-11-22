'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  TrendingUp,
  Brain,
  Lightbulb,
  X,
  ChevronDown,
  ChevronUp,
  Heart,
} from 'lucide-react';
import { PaletteEntry } from '@/lib/anthropic';
import type { LucideIcon } from 'lucide-react';

interface SmartAssistantProps {
  palette: PaletteEntry[];
  creativePath?: string;
  onSuggestionClick?: (suggestion: string) => void;
}

interface Suggestion {
  type: 'trend' | 'psychology' | 'recommendation' | 'tip';
  icon: LucideIcon;
  title: string;
  content: string;
  action?: string;
  color: string;
}

export function SmartAssistant({ palette, creativePath, onSuggestionClick }: SmartAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'tips' | 'insights'>('all');
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

  const suggestions = useMemo(() => {
    const suggestions: Suggestion[] = [];

    // Analyze dominant colors
    const isDark = palette.some(c => {
      const rgb = hexToRgb(c.hex);
      const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
      return luminance < 0.3;
    });

    const isWarm = palette.some(c => {
      const rgb = hexToRgb(c.hex);
      return rgb.r > rgb.b;
    });

    // Psychology insights
    if (isWarm) {
      suggestions.push({
        type: 'psychology',
        icon: Heart,
        title: 'Warm & Inviting',
        content: 'Your palette evokes feelings of warmth, energy, and passion. Perfect for creating engaging, emotional content.',
        color: 'orange',
      });
    } else {
      suggestions.push({
        type: 'psychology',
        icon: Heart,
        title: 'Cool & Calming',
        content: 'Your palette suggests serenity, trust, and professionalism. Ideal for creating sophisticated, peaceful designs.',
        color: 'blue',
      });
    }

    // Trend insights
    if (creativePath) {
      suggestions.push({
        type: 'trend',
        icon: TrendingUp,
        title: `Trending in ${creativePath}`,
        content: `This color combination is currently popular in ${creativePath.toLowerCase()}. Users are creating 2.3x more content with similar palettes this month.`,
        color: 'green',
      });
    }

    // Recommendations
    if (palette.length >= 5) {
      suggestions.push({
        type: 'recommendation',
        icon: Brain,
        title: 'Rich Palette Detected',
        content: 'With 5+ colors, consider using 2-3 dominant colors and the rest as accents for better visual hierarchy.',
        action: 'Learn More',
        color: 'purple',
      });
    }

    // Contextual tips
    if (isDark && creativePath?.includes('Fashion')) {
      suggestions.push({
        type: 'tip',
        icon: Lightbulb,
        title: 'Dark Fashion Tip',
        content: 'Dark palettes work exceptionally well for evening wear and formal fashion. Consider adding metallic accents for luxury appeal.',
        color: 'yellow',
      });
    }

    if (creativePath?.includes('Interior')) {
      suggestions.push({
        type: 'tip',
        icon: Lightbulb,
        title: 'Interior Design Pro Tip',
        content: 'Apply the 60-30-10 rule: 60% dominant color, 30% secondary, 10% accent. This creates balanced, professional spaces.',
        action: 'Apply Rule',
        color: 'yellow',
      });
    }

    return suggestions;
  }, [palette, creativePath]);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const filteredSuggestions = suggestions.filter(s => {
    if (dismissedSuggestions.has(s.title)) return false;
    if (activeTab === 'tips') return s.type === 'tip';
    if (activeTab === 'insights') return s.type === 'psychology' || s.type === 'trend';
    return true;
  });

  const colorMap: Record<string, string> = {
    orange: 'from-orange-500 to-red-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    yellow: 'from-yellow-500 to-orange-500',
  };

  if (filteredSuggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
    >
      <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-2xl">
        {/* Header */}
        <div
          className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-white/80">
                  {filteredSuggestions.length} insight{filteredSuggestions.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="p-4 max-h-96 overflow-y-auto">
                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={activeTab === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('all')}
                    className="flex-1"
                  >
                    All
                  </Button>
                  <Button
                    variant={activeTab === 'insights' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('insights')}
                    className="flex-1"
                  >
                    Insights
                  </Button>
                  <Button
                    variant={activeTab === 'tips' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('tips')}
                    className="flex-1"
                  >
                    Tips
                  </Button>
                </div>

                {/* Suggestions */}
                <div className="space-y-3">
                  {filteredSuggestions.map((suggestion, index) => {
                    const Icon = suggestion.icon;
                    return (
                      <motion.div
                        key={suggestion.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:shadow-md transition-shadow"
                      >
                        <button
                          onClick={() =>
                            setDismissedSuggestions(prev => new Set(prev).add(suggestion.title))
                          }
                          className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          <X className="h-4 w-4" />
                        </button>

                        <div className="flex items-start gap-3 mb-3">
                          <div className={`p-2 bg-gradient-to-br ${colorMap[suggestion.color]} rounded-lg flex-shrink-0`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{suggestion.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {suggestion.type}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">{suggestion.content}</p>

                        {suggestion.action && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => onSuggestionClick?.(suggestion.action!)}
                          >
                            {suggestion.action}
                          </Button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
