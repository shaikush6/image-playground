'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  Share2,
  Download,
  BookOpen,
  Sparkles,
  Image as ImageIcon,
  Palette as PaletteIcon,
  Wand2,
  CheckCircle2
} from 'lucide-react';
import { PaletteEntry } from '@/lib/anthropic';

interface ColorStoryModeProps {
  originalImage: string;
  palette: PaletteEntry[];
  creativePath: string;
  customizations: any;
  result: any;
}

interface StoryChapter {
  id: string;
  title: string;
  content: string;
  icon: any;
  visual?: string;
  colors?: string[];
}

export function ColorStoryMode({
  originalImage,
  palette,
  creativePath,
  customizations,
  result,
}: ColorStoryModeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showNarration, setShowNarration] = useState(true);

  const generateStory = (): StoryChapter[] => {
    const colorNames = palette.map(c => c.name).join(', ');

    return [
      {
        id: 'inspiration',
        title: 'The Inspiration',
        content: `Your journey began with a simple image - a captured moment that held within it a universe of color possibilities. This image spoke to you, calling out to be transformed into something new.`,
        icon: ImageIcon,
        visual: originalImage,
      },
      {
        id: 'extraction',
        title: 'Color Discovery',
        content: `From this image, AI extracted ${palette.length} distinct colors: ${colorNames}. Each color tells its own story - together, they form a harmonious palette that reflects the essence of your inspiration.`,
        icon: PaletteIcon,
        colors: palette.map(c => c.hex),
      },
      {
        id: 'transformation',
        title: 'The Vision',
        content: `You chose to explore ${creativePath}, guided by your creative intuition. The AI analyzed the emotional resonance of your palette, understanding how ${palette[0]?.name} brings ${palette[0]?.name.toLowerCase().includes('blue') ? 'calm and trust' : palette[0]?.name.toLowerCase().includes('red') ? 'passion and energy' : 'unique character'} to the composition.`,
        icon: Wand2,
        colors: palette.slice(0, 3).map(c => c.hex),
      },
      {
        id: 'creation',
        title: 'Bringing It to Life',
        content: `Through the fusion of your vision and AI creativity, something extraordinary emerged. Your palette danced across the canvas, each color finding its perfect place, creating ${result ? 'a stunning result' : 'magic'} that honors both your inspiration and imagination.`,
        icon: Sparkles,
        visual: result?.image_url,
      },
      {
        id: 'completion',
        title: 'Your Creative Journey',
        content: `This is more than just an image - it's a story of transformation. From inspiration to creation, you've turned color into emotion, vision into reality. Your creative journey is complete, but the possibilities are endless.`,
        icon: CheckCircle2,
      },
    ];
  };

  const [chapters] = useState<StoryChapter[]>(generateStory());

  const nextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(prev => prev - 1);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && currentChapter === chapters.length - 1) {
      setCurrentChapter(0);
    }
  };

  // Auto-advance when playing
  useState(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        nextChapter();
      }, 5000);
      return () => clearTimeout(timer);
    }
  });

  const currentChapterData = chapters[currentChapter];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Color Story</h3>
            <p className="text-sm text-muted-foreground">
              Your creative journey from inspiration to creation
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share Story
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card className="border-2 border-indigo-200 dark:border-indigo-800 overflow-hidden">
        <CardContent className="p-0">
          {/* Visual Section */}
          <div className="relative h-96 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentChapter}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {currentChapterData.visual ? (
                  <img
                    src={currentChapterData.visual}
                    alt={currentChapterData.title}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
                  />
                ) : currentChapterData.colors ? (
                  <div className="flex gap-4">
                    {currentChapterData.colors.map((color, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="w-24 h-24 rounded-full shadow-2xl"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-12">
                    {React.createElement(currentChapterData.icon, {
                      className: "h-32 w-32 text-indigo-300",
                    })}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Chapter Indicator */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-black/70 text-white">
                Chapter {currentChapter + 1} of {chapters.length}
              </Badge>
            </div>
          </div>

          {/* Narration Section */}
          {showNarration && (
            <div className="p-6 bg-white dark:bg-slate-900">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentChapter}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    {React.createElement(currentChapterData.icon, {
                      className: "h-6 w-6 text-indigo-600",
                    })}
                    <h3 className="text-2xl font-bold">{currentChapterData.title}</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {currentChapterData.content}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Controls */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevChapter}
                disabled={currentChapter === 0}
              >
                Previous
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={togglePlay}
                className="bg-gradient-to-r from-indigo-600 to-purple-600"
              >
                {isPlaying ? (
                  <><Pause className="h-4 w-4 mr-2" /> Pause</>
                ) : (
                  <><Play className="h-4 w-4 mr-2" /> Play Story</>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={nextChapter}
                disabled={currentChapter === chapters.length - 1}
              >
                Next
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${((currentChapter + 1) / chapters.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
