'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
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
  CheckCircle2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PaletteEntry } from '@/lib/anthropic';
import type { CreativeResult } from '@/lib/agents';

interface ColorStoryModeProps {
  originalImage: string;
  palette: PaletteEntry[];
  creativePath: string;
  result?: CreativeResult | null;
}

interface StoryChapter {
  id: string;
  title: string;
  content: string;
  icon: LucideIcon;
  visual?: string;
  colors?: string[];
}

export function ColorStoryMode({
  originalImage,
  palette,
  creativePath,
  result,
}: ColorStoryModeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);

  const chapters = useMemo<StoryChapter[]>(() => {
    const colorNames = palette.map((entry) => entry.name).join(', ');
    return [
      {
        id: 'inspiration',
        title: 'The Inspiration',
        content:
          'Your journey began with a simple image—an instant that begged to be transformed into something new.',
        icon: ImageIcon,
        visual: originalImage,
      },
      {
        id: 'extraction',
        title: 'Color Discovery',
        content: `From this image, AI extracted ${palette.length} distinct colors: ${colorNames}. Each tone carries its own personality, and together they form a harmonious palette ready for storytelling.`,
        icon: PaletteIcon,
        colors: palette.map((entry) => entry.hex),
      },
      {
        id: 'transformation',
        title: 'The Vision',
        content: `You chose the ${creativePath} path, guiding AI to interpret how shades like ${palette[0]?.name ?? 'the lead hue'} set the emotional temperature for the work.`,
        icon: Wand2,
        colors: palette.slice(0, 3).map((entry) => entry.hex),
      },
      {
        id: 'creation',
        title: 'Bringing It to Life',
        content: `Your palette danced across the canvas, each color finding its perfect place to create ${
          result?.image_url ? 'a tangible output' : 'a vivid concept'
        } worthy of your inspiration.`,
        icon: Sparkles,
        visual: result?.image_url,
      },
      {
        id: 'completion',
        title: 'Creative Milestone',
        content:
          "This isn't just an output—it’s a color expedition from spark to spectacle. Your creative journey is complete, but the palette’s potential never ends.",
        icon: CheckCircle2,
      },
    ];
  }, [originalImage, palette, creativePath, result]);

  const chaptersCount = chapters.length;
  const currentChapterData = chapters[currentChapter];

  const nextChapter = () => {
    setCurrentChapter((prev) => Math.min(prev + 1, chaptersCount - 1));
  };

  const prevChapter = () => {
    setCurrentChapter((prev) => Math.max(prev - 1, 0));
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    if (currentChapter === chaptersCount - 1) {
      setCurrentChapter(0);
    }
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying) return undefined;
    if (currentChapter >= chaptersCount - 1) {
      setIsPlaying(false);
      return undefined;
    }

    const timer = setTimeout(() => {
      setCurrentChapter((prev) => Math.min(prev + 1, chaptersCount - 1));
    }, 5000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentChapter, chaptersCount]);

  const ActionIcon = currentChapterData.icon;

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
              A narrated timeline from inspiration to creation
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
                  <div className="relative w-[80%] h-[80%] max-w-full max-h-full">
                    <Image
                      src={currentChapterData.visual}
                      alt={currentChapterData.title}
                      fill
                      sizes="(max-width: 1024px) 80vw, 600px"
                      unoptimized
                      className="object-contain rounded-lg shadow-2xl"
                    />
                  </div>
                ) : currentChapterData.colors ? (
                  <div className="flex gap-4">
                    {currentChapterData.colors.map((color, index) => (
                      <motion.div
                        key={color}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="w-24 h-24 rounded-full shadow-2xl"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-12">
                    <ActionIcon className="h-32 w-32 text-indigo-300" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="absolute top-4 left-4">
              <Badge className="bg-black/70 text-white">
                Chapter {currentChapter + 1} of {chaptersCount}
              </Badge>
            </div>
          </div>

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
                  <ActionIcon className="h-6 w-6 text-indigo-600" />
                  <h3 className="text-2xl font-bold">{currentChapterData.title}</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {currentChapterData.content}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" size="sm" onClick={prevChapter} disabled={currentChapter === 0}>
                Previous
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={togglePlay}
                className="bg-gradient-to-r from-indigo-600 to-purple-600"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" /> Play Story
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={nextChapter}
                disabled={currentChapter === chaptersCount - 1}
              >
                Next
              </Button>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                Inspired by your palette
              </div>
              <div>
                Chapter {currentChapter + 1}/{chaptersCount}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
