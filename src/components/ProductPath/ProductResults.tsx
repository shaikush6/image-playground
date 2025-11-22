'use client';

import { motion } from 'framer-motion';
import { Download, RefreshCw, Eye } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductResult {
  imageUrl: string;
  imageData?: string;
  promptUsed: string;
  categoryName: string;
  variationName?: string;
  aspectRatio: string;
}

interface ProductResultsProps {
  result: ProductResult;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function ProductResults({
  result,
  onRegenerate,
  isRegenerating = false,
}: ProductResultsProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = result.imageData || result.imageUrl;
    link.download = `product-${result.categoryName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(result.imageData || result.imageUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold">Generated Result</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your product in {result.categoryName}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleOpenInNewTab}
            variant="outline"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Full
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          {onRegenerate && (
            <Button
              onClick={onRegenerate}
              disabled={isRegenerating}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isRegenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Image Display */}
      <div className="relative group">
        <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 relative">
          <Image
            src={result.imageData || result.imageUrl || ''}
            alt="Generated Product Placement"
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-contain"
          />
        </div>

        {/* Metadata Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="space-y-2">
            <Badge className="bg-purple-600 text-white">
              {result.categoryName}
            </Badge>
            {result.variationName && (
              <Badge variant="secondary">
                {result.variationName}
              </Badge>
            )}
          </div>
          <Badge variant="secondary">
            {result.aspectRatio}
          </Badge>
        </div>
      </div>

      {/* Prompt Used */}
      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-semibold mb-2">Prompt Used</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {result.promptUsed}
        </p>
      </div>

      {/* Before/After Toggle (optional future enhancement) */}
      {/* <div className="flex gap-4">
        <button className="flex-1 p-4 rounded-lg border-2 border-purple-500 bg-purple-50 dark:bg-purple-950/30">
          <Image src={result.originalProduct || ''} alt="Original product" width={320} height={160} unoptimized className="w-full h-40 object-contain" />
          <p className="text-sm font-medium mt-2">Original</p>
        </button>
        <button className="flex-1 p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500">
          <Image src={result.imageUrl || ''} alt="Generated product" width={320} height={160} unoptimized className="w-full h-40 object-contain" />
          <p className="text-sm font-medium mt-2">Generated</p>
        </button>
      </div> */}
    </motion.div>
  );
}
