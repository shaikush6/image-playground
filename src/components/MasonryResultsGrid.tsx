'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { Camera, Video, Heart, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MasonryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description?: string;
}

interface MasonryResultsGridProps {
  items: MasonryItem[];
  onItemClick?: (item: MasonryItem) => void;
}

export function MasonryResultsGrid({ items, onItemClick }: MasonryResultsGridProps) {
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="break-inside-avoid mb-4"
        >
          <div className="group relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300">
            {/* Content */}
            {item.type === 'image' ? (
              <div className="relative w-full min-h-[200px]">
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
            ) : (
              <video
                src={item.url}
                className="w-full h-auto"
                controls
                preload="metadata"
                playsInline
                loop
                muted
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                {item.description && (
                  <p className="text-white/80 text-sm line-clamp-2">{item.description}</p>
                )}
              </div>

              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 hover:bg-white"
                  onClick={() => toggleLike(item.id)}
                >
                  <Heart
                    className={`h-4 w-4 ${likedItems.has(item.id) ? 'fill-red-500 text-red-500' : ''}`}
                  />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 hover:bg-white"
                  onClick={() => onItemClick?.(item)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Type Badge */}
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-black/70 text-white border-0">
                {item.type === 'image' ? (
                  <Camera className="h-3 w-3 mr-1" />
                ) : (
                  <Video className="h-3 w-3 mr-1" />
                )}
                {item.type}
              </Badge>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
