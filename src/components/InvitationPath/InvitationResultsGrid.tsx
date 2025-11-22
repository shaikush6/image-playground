'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Eye, X, Image as ImageIcon, Video as VideoIcon, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface InvitationResultItem {
  id: string;
  type: 'image' | 'video';
  url?: string;
  dataUrl?: string;
  promptUsed?: string;
  categoryName?: string;
  styleName?: string;
  aspectRatio?: string;
  formatLabel?: string;
}

interface InvitationResultsGridProps {
  results: InvitationResultItem[];
}

export function InvitationResultsGrid({ results }: InvitationResultsGridProps) {
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [selectedItem, setSelectedItem] = useState<InvitationResultItem | null>(null);

  const filteredResults = filter === 'all' ? results : results.filter(result => result.type === filter);
  const imageCount = results.filter(result => result.type === 'image').length;
  const videoCount = results.filter(result => result.type === 'video').length;

  const handleDownload = (item: InvitationResultItem) => {
    const link = document.createElement('a');
    link.href = item.dataUrl || item.url || '';
    link.download = `${item.styleName || 'invitation'}-${item.id}.${item.type === 'video' ? 'mp4' : 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-muted-foreground">AI output</p>
          <p className="text-2xl font-semibold">Invitation Results</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
          {(['all', 'image', 'video'] as const).map((option) => {
            const isActive = filter === option;
            const labelMap: Record<typeof option, string> = {
              all: `All ${results.length}`,
              image: `${imageCount} Images`,
              video: `${videoCount} Videos`,
            };

            if (option !== 'all' && ((option === 'image' && imageCount === 0) || (option === 'video' && videoCount === 0))) {
              return null;
            }

            const Icon = option === 'image' ? ImageIcon : option === 'video' ? VideoIcon : Sparkles;

            return (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                  isActive ? 'bg-white text-slate-900 shadow' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {labelMap[option]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredResults.map((result) => (
          <motion.div
            key={result.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm"
          >
            <button
              className="w-full h-full flex flex-col text-left"
              onClick={() => setSelectedItem(result)}
            >
              <div className="relative aspect-square bg-slate-100 dark:bg-slate-800">
                  {result.type === 'image' ? (
                    <Image
                      src={result.dataUrl || result.url || ''}
                      alt={result.styleName || 'Invitation result'}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                  <video
                    src={result.dataUrl || result.url}
                    className="object-cover w-full h-full"
                    muted
                    loop
                    playsInline
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="p-3 space-y-1">
                {result.categoryName && (
                  <p className="text-xs text-muted-foreground">{result.categoryName}</p>
                )}
                <p className="text-sm font-semibold">{result.styleName || 'Generated'}</p>
                {result.aspectRatio && (
                  <Badge variant="outline">Aspect {result.aspectRatio}</Badge>
                )}
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-lg font-semibold">{selectedItem.styleName || 'Invitation'}</p>
                  <p className="text-sm text-muted-foreground">{selectedItem.categoryName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDownload(selectedItem)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedItem(null)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="p-6 flex flex-col lg:flex-row gap-6">
                <div className="flex-1 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                  {selectedItem.type === 'image' ? (
                    <div className="relative w-full h-full min-h-[300px]">
                      <Image
                        src={selectedItem.dataUrl || selectedItem.url || ''}
                        alt={selectedItem.styleName || 'Invitation result'}
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <video
                      src={selectedItem.dataUrl || selectedItem.url}
                      controls
                      className="w-full h-full"
                    />
                  )}
                </div>
                <div className="w-full lg:w-80 space-y-4">
                  {selectedItem.promptUsed && (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/40">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Prompt</p>
                      <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                        {selectedItem.promptUsed}
                      </p>
                    </div>
                  )}
                  {selectedItem.formatLabel && (
                    <Badge variant="secondary">{selectedItem.formatLabel}</Badge>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
