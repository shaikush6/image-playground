'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Download, RefreshCw, ChevronLeft, ChevronRight, Play, Image as ImageIcon, Video, X, Maximize2 } from 'lucide-react';
import NextImage from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export interface ProductResultItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  dataUrl?: string;
  promptUsed: string;
  categoryName: string;
  variationName?: string;
  aspectRatio: string;
  sceneIndex: number;
  imageIndex?: number;
}

interface ProductResultsGridProps {
  results: ProductResultItem[];
  onRegenerate?: (item: ProductResultItem) => void;
  isRegenerating?: boolean;
  regeneratingId?: string;
}

export function ProductResultsGrid({
  results,
  onRegenerate,
  isRegenerating = false,
  regeneratingId,
}: ProductResultsGridProps) {
  const [selectedItem, setSelectedItem] = useState<ProductResultItem | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');

  const filteredResults = filterType === 'all'
    ? results
    : results.filter(r => r.type === filterType);

  const imageCount = results.filter(r => r.type === 'image').length;
  const videoCount = results.filter(r => r.type === 'video').length;

  const handleDownload = (item: ProductResultItem) => {
    const link = document.createElement('a');
    link.href = item.dataUrl || item.url;
    const extension = item.type === 'video' ? 'mp4' : 'png';
    link.download = `product-${item.categoryName.toLowerCase().replace(/\s+/g, '-')}-${item.id}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    filteredResults.forEach((item, index) => {
      setTimeout(() => handleDownload(item), index * 500);
    });
  };

  const navigateItem = (direction: 'prev' | 'next') => {
    if (!selectedItem) return;
    const currentIndex = filteredResults.findIndex(r => r.id === selectedItem.id);
    const newIndex = direction === 'prev'
      ? (currentIndex - 1 + filteredResults.length) % filteredResults.length
      : (currentIndex + 1) % filteredResults.length;
    setSelectedItem(filteredResults[newIndex]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-2xl font-semibold">Generated Results</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {results.length} item{results.length !== 1 ? 's' : ''} generated
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Type Filter */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                filterType === 'all'
                  ? 'bg-white dark:bg-slate-700 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({results.length})
            </button>
            {imageCount > 0 && (
              <button
                onClick={() => setFilterType('image')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-1 ${
                  filterType === 'image'
                    ? 'bg-white dark:bg-slate-700 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                {imageCount}
              </button>
            )}
            {videoCount > 0 && (
              <button
                onClick={() => setFilterType('video')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-1 ${
                  filterType === 'video'
                    ? 'bg-white dark:bg-slate-700 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Video className="h-3.5 w-3.5" />
                {videoCount}
              </button>
            )}
          </div>

          {/* Download All */}
          <Button onClick={handleDownloadAll} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredResults.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`group cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-lg ${
                  regeneratingId === item.id ? 'opacity-50' : ''
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative aspect-square bg-slate-100 dark:bg-slate-800">
                  {item.type === 'image' ? (
                    <div className="relative w-full h-full">
                      <NextImage
                        src={item.dataUrl || item.url || ''}
                        alt={`Product in ${item.categoryName ?? 'selected scene'}`}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 50vw, 200px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <video
                        src={item.dataUrl || item.url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(item);
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {onRegenerate && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRegenerate(item);
                        }}
                        disabled={isRegenerating}
                      >
                        <RefreshCw className={`h-4 w-4 ${regeneratingId === item.id ? 'animate-spin' : ''}`} />
                      </Button>
                    )}
                  </div>

                  {/* Type badge */}
                  <Badge
                    className="absolute top-2 right-2"
                    variant={item.type === 'video' ? 'default' : 'secondary'}
                  >
                {item.type === 'video' ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                  </Badge>
                </div>

                <CardContent className="p-3">
                  <p className="text-sm font-medium truncate">{item.categoryName}</p>
                  {item.variationName && (
                    <p className="text-xs text-muted-foreground truncate">{item.variationName}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-white hover:text-slate-300 transition-colors"
              onClick={() => setSelectedItem(null)}
            >
              <X className="h-8 w-8" />
            </button>

            {/* Navigation */}
            {filteredResults.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 transition-colors p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateItem('prev');
                  }}
                >
                  <ChevronLeft className="h-10 w-10" />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 transition-colors p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateItem('next');
                  }}
                >
                  <ChevronRight className="h-10 w-10" />
                </button>
              </>
            )}

            {/* Content */}
            <motion.div
              key={selectedItem.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl max-h-[80vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === 'image' ? (
                <div className="relative max-w-full max-h-[70vh] min-h-[300px]">
                  <NextImage
                    src={selectedItem.dataUrl || selectedItem.url || ''}
                    alt={`Product in ${selectedItem.categoryName ?? 'scene'}`}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 90vw, 700px"
                    className="object-contain rounded-lg"
                  />
                </div>
              ) : (
                <video
                  src={selectedItem.dataUrl || selectedItem.url}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  controls
                  autoPlay
                />
              )}

              {/* Info panel */}
              <div className="mt-4 p-4 bg-white/10 backdrop-blur-md rounded-lg text-white">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{selectedItem.categoryName}</h4>
                    {selectedItem.variationName && (
                      <p className="text-sm text-slate-300">{selectedItem.variationName}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDownload(selectedItem)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    {onRegenerate && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onRegenerate(selectedItem)}
                        disabled={isRegenerating}
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${regeneratingId === selectedItem.id ? 'animate-spin' : ''}`} />
                        Regenerate
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {selectedItem.promptUsed}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
