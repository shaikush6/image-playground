'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Loader2, Package, Check, Sparkles, Scissors, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { validateImageFile } from '@/lib/backgroundRemoval';

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
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        onProductSelect(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  }, [onProductSelect]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: false
  });

  const handleRemove = () => {
    onProductSelect('', '');
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {currentImage ? (
          <motion.div
            key="image-preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, type: 'spring' }}
            className="space-y-4"
          >
            {/* Original Image */}
            <div className="relative group">
              <Card className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-700">
                <div className="relative aspect-square w-full">
                  <Image
                    src={currentImage}
                    alt="Product"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-contain"
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Remove button */}
                  <Button
                    onClick={handleRemove}
                    size="sm"
                    className="absolute top-4 right-4 h-10 w-10 p-0 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <X className="h-5 w-5" />
                  </Button>

                  {/* Image info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2 text-white">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-sm font-medium">Original uploaded</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Extraction Status */}
            {isExtracting && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800"
              >
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                    Magic in progress...
                  </p>
                  <p className="text-xs text-purple-700 dark:text-purple-300">
                    Extracting product from background
                  </p>
                </div>
              </motion.div>
            )}

            {/* Extracted Image */}
            {extractedImage && !isExtracting && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group"
              >
                <Card className="relative overflow-hidden border-2 border-green-500">
                  <div className="aspect-square relative">
                    {/* Checkerboard pattern for transparency */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
                                         linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
                                         linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
                                         linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)`,
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                      }}
                    />
                    <Image
                      src={extractedImage}
                      alt="Extracted Product"
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="relative object-contain"
                    />
                  </div>

                  {/* Success badge */}
                  <div className="absolute bottom-3 left-3">
                    <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-lg">
                      <Check className="h-3.5 w-3.5" />
                      Background removed
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="upload-area"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Drag and Drop Area */}
            <motion.div
              {...getRootProps()}
              className="relative overflow-hidden rounded-2xl"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <input {...getInputProps()} />

              {/* Animated gradient background */}
              <div className={`
                absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-orange-950/30
                transition-all duration-500
                ${isDragActive ? 'opacity-100 scale-105' : 'opacity-70'}
              `}>
                {/* Floating gradient orbs */}
                <motion.div
                  animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute top-0 left-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{
                    x: [0, -80, 0],
                    y: [0, 60, 0],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute bottom-0 right-0 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl"
                />
              </div>

              {/* Content */}
              <div className={`
                relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
                transition-all duration-300
                ${isDragActive
                  ? 'border-purple-500 bg-purple-500/10 shadow-2xl'
                  : 'border-slate-300 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-xl'
                }
              `}>
                <motion.div
                  animate={isDragActive ? { scale: 1.1, y: -10 } : { scale: 1, y: 0 }}
                  transition={{ duration: 0.3, type: 'spring' }}
                  className="space-y-6"
                >
                  {/* Animated upload icon */}
                  <div className="relative mx-auto w-24 h-24">
                    <motion.div
                      animate={{
                        scale: isDragActive ? [1, 1.2, 1] : 1,
                        rotate: isDragActive ? [0, 10, -10, 0] : 0,
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: isDragActive ? Infinity : 0,
                      }}
                      className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
                    >
                      <Package className="h-12 w-12 text-white" />
                    </motion.div>

                    {/* Pulse effect */}
                    {!isDragActive && (
                      <motion.div
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl"
                      />
                    )}
                  </div>

                  <div>
                    <p className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {isDragActive ? 'Drop it here!' : 'Upload your product'}
                    </p>
                    <p className="text-base text-muted-foreground mb-2">
                      Drag & drop an image or click to browse
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">PNG</span>
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">JPG</span>
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">WebP</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Up to 10MB • Works best with plain backgrounds
                    </p>
                  </div>

                  {/* Features list */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    {[
                      { icon: Scissors, text: 'Auto Cutout', color: 'text-purple-600' },
                      { icon: Wand2, text: 'AI Polish', color: 'text-pink-600' },
                      { icon: Sparkles, text: 'Studio Ready', color: 'text-orange-600' },
                    ].map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="text-center"
                      >
                        <feature.icon className={`h-6 w-6 mx-auto mb-1 ${feature.color}`} />
                        <p className="text-xs text-muted-foreground">{feature.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
