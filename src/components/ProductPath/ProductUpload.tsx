'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Loader2, Package, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateImageFile, previewImageFile } from '@/lib/backgroundRemoval';

interface ProductUploadProps {
  onProductSelect: (imageData: string, extractedData?: string) => void;
  currentImage?: string;
  extractedImage?: string;
  isExtracting?: boolean;
}

export function ProductUpload({
  onProductSelect,
  currentImage,
  extractedImage,
  isExtracting = false,
}: ProductUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        await handleFile(e.dataTransfer.files[0]);
      }
    },
    [onProductSelect]
  );

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        await handleFile(e.target.files[0]);
      }
    },
    [onProductSelect]
  );

  const handleFile = async (file: File) => {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Preview file
    try {
      const dataUrl = await previewImageFile(file);
      onProductSelect(dataUrl);
    } catch (error) {
      console.error('Error previewing file:', error);
      alert('Failed to load image. Please try again.');
    }
  };

  const handleRemove = () => {
    onProductSelect('', '');
  };

  return (
    <div className="space-y-4">
      {!currentImage ? (
        /* Upload Area */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 text-center
            ${dragActive
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20'
              : 'border-slate-300 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-500'
            }
          `}
        >
          <input
            type="file"
            id="product-upload"
            className="hidden"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleChange}
          />

          <label
            htmlFor="product-upload"
            className="cursor-pointer flex flex-col items-center gap-4"
          >
            <div className="p-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
              <Package className="h-12 w-12 text-purple-600 dark:text-purple-400" />
            </div>

            <div>
              <p className="text-lg font-semibold mb-1">
                Upload Product Image
              </p>
              <p className="text-sm text-muted-foreground">
                Drag & drop or click to select
              </p>
            </div>

            <p className="text-xs text-muted-foreground max-w-md">
              Supported formats: PNG, JPEG, WebP • Max size: 10MB
              <br />
              Works best with products on plain backgrounds
            </p>
          </label>
        </div>
      ) : (
        /* Image Preview */
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            {/* Original Image */}
            <div className="relative group">
              <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
                <img
                  src={currentImage}
                  alt="Product"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Remove Button */}
              <Button
                onClick={handleRemove}
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>

              {/* Badge */}
              <div className="absolute bottom-2 left-2">
                <div className="px-2 py-1 rounded-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-medium">
                  Original
                </div>
              </div>
            </div>

            {/* Extraction Status */}
            {isExtracting && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800"
              >
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Extracting product...
                </span>
              </motion.div>
            )}

            {/* Extracted Image */}
            {extractedImage && !isExtracting && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2 border-green-500">
                  {/* Checkerboard pattern for transparency */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%),
                                       linear-gradient(-45deg, #ccc 25%, transparent 25%),
                                       linear-gradient(45deg, transparent 75%, #ccc 75%),
                                       linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                    }}
                  />
                  <img
                    src={extractedImage}
                    alt="Extracted Product"
                    className="relative w-full h-full object-contain"
                  />
                </div>

                {/* Badge */}
                <div className="absolute bottom-2 left-2">
                  <div className="px-2 py-1 rounded-md bg-green-500 text-white text-xs font-medium flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Extracted
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
