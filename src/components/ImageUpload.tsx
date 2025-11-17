'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, X, Link as LinkIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

interface ImageUploadProps {
  onImageSelect: (imageData: string) => void;
  currentImage?: string;
}

export function ImageUpload({ onImageSelect, currentImage }: ImageUploadProps) {
  const [urlInput, setUrlInput] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          onImageSelect(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: false
  });

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;

    setIsLoadingUrl(true);
    try {
      const response = await fetch(urlInput);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          onImageSelect(reader.result as string);
          setUrlInput('');
        }
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error loading image from URL:', error);
    } finally {
      setIsLoadingUrl(false);
    }
  };

  const clearImage = () => {
    onImageSelect('');
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
            className="relative group"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-700">
              <div className="relative aspect-video w-full">
                <Image
                  src={currentImage}
                  alt="Selected inspiration"
                  fill
                  className="object-cover rounded-lg"
                />
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Remove button */}
                <Button
                  onClick={clearImage}
                  size="sm"
                  className="absolute top-4 right-4 h-10 w-10 p-0 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <X className="h-5 w-5" />
                </Button>

                {/* Image info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-2 text-white">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-medium">Ready to extract colors!</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="upload-area"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Drag and Drop Area */}
            <motion.div
              {...getRootProps()}
              className="relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <input {...getInputProps()} />

              {/* Animated gradient background */}
              <div className={`
                absolute inset-0 bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50 dark:from-blue-950/30 dark:via-emerald-950/30 dark:to-cyan-950/30
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
                  className="absolute top-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"
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
                  className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"
                />
              </div>

              {/* Content */}
              <div className={`
                relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
                transition-all duration-300
                ${isDragActive
                  ? 'border-blue-500 bg-blue-500/10 shadow-2xl'
                  : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl'
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
                      className="absolute inset-0 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg"
                    >
                      <Upload className="h-12 w-12 text-white" />
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
                        className="absolute inset-0 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl"
                      />
                    )}
                  </div>

                  <div>
                    <p className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                      {isDragActive ? 'Drop it here!' : 'Upload your inspiration image'}
                    </p>
                    <p className="text-base text-muted-foreground mb-2">
                      Drag & drop an image or click to browse
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">PNG</span>
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">JPG</span>
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">JPEG</span>
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">WebP</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Up to 10MB
                    </p>
                  </div>

                  {/* Features list */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    {[
                      { icon: '🎨', text: 'AI Color Analysis' },
                      { icon: '✨', text: 'Smart Extraction' },
                      { icon: '🚀', text: 'Instant Results' },
                    ].map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="text-center"
                      >
                        <div className="text-2xl mb-1">{feature.icon}</div>
                        <p className="text-xs text-muted-foreground">{feature.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* URL Input Section */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-4 text-muted-foreground font-medium">
                  Or use an image URL
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                  className="pl-10 h-12 border-2 focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
              <Button
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim() || isLoadingUrl}
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-medium shadow-lg"
              >
                {isLoadingUrl ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="h-5 w-5 border-2 border-current border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <ImageIcon className="h-5 w-5 mr-2" />
                    Load
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
