'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Sparkles, Wand2, BookOpen, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ImageUpload';
import { ColorPalette } from '@/components/ColorPalette';
import { OutputFormatSelector, OutputFormat } from '@/components/OutputFormatSelector';
import { CreativeResults } from '@/components/CreativeResults';
import { ThemeToggle } from '@/components/theme-toggle';
import { PaletteOutput } from '@/lib/anthropic';
import { CREATIVE_PATHS, IMAGE_PROMPT_OPTIONS, CreativeCustomizations, CreativeResult } from '@/lib/agents';
import { useAspectRatio } from '@/features/aspect-ratio/useAspectRatio';
import { useImageSeries } from '@/features/image-series/useImageSeries';
import { AspectRatioSelector } from '@/features/aspect-ratio/AspectRatioSelector';
import { ImageSeriesConfigPanel } from '@/features/image-series/ImageSeriesConfig';
import type { ImageSeriesConfig } from '@/features/image-series/useImageSeries';
import { AdaptiveBackground } from '@/components/AdaptiveBackground';
import { FloatingColorOrbs } from '@/components/FloatingColorOrbs';
import { EnhancedCreativePathSelector } from '@/components/EnhancedCreativePathSelector';
import { CustomizationWizard } from '@/components/CustomizationWizard';
import { EnhancedGenerationProgress } from '@/components/EnhancedGenerationProgress';
import { ColorStoryTimeline } from '@/components/ColorStoryTimeline';
import { PalettePlayground } from '@/components/PalettePlayground';
import { ColorStoryMode } from '@/components/ColorStoryMode';
import { SessionSharing } from '@/components/SessionSharing';
import { AnimatedJourneyShowcase } from '@/components/AnimatedJourneyShowcase';
import { usePaletteHistory } from '@/hooks/usePaletteHistory';

type CreativePath = typeof CREATIVE_PATHS[number];

export default function HomePage() {
  const [currentImage, setCurrentImage] = useState<string>('');
  const [palette, setPalette] = useState<PaletteOutput | null>(null);
  const [isExtractingPalette, setIsExtractingPalette] = useState(false);
  const [swatchCount, setSwatchCount] = useState([5]);
  const [selectedPath, setSelectedPath] = useState<CreativePath>('🍽️ Cooking');
  const [selectedImageAngle, setSelectedImageAngle] = useState<string>('');
  const [customizations, setCustomizations] = useState<CreativeCustomizations>({});
  const [selectedFormats, setSelectedFormats] = useState<OutputFormat[]>(['image']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [results, setResults] = useState<CreativeResult | null>(null);

  // New feature states
  const [showPalettePlayground, setShowPalettePlayground] = useState(false);
  const [showColorStory, setShowColorStory] = useState(false);
  const [showSessionSharing, setShowSessionSharing] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  // Custom hooks for modular features
  const aspectRatio = useAspectRatio(selectedPath);
  const imageSeries = useImageSeries(selectedPath);

  const extractPalette = async () => {
    if (!currentImage) return;

    setIsExtractingPalette(true);
    try {
      const response = await fetch('/api/extract-palette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageBase64: currentImage, 
          swatches: swatchCount[0] 
        }),
      });

      if (response.ok) {
        const paletteData = await response.json();
        setPalette(paletteData);
        // Reset image angle when palette changes
        setSelectedImageAngle('');
        setResults(null);
      } else {
        const errorData = await response.json();
        console.error('Failed to extract palette:', response.status, errorData);
        alert(`Failed to extract palette: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error extracting palette:', error);
    } finally {
      setIsExtractingPalette(false);
    }
  };

  const generateIdeas = async () => {
    if (!palette || !selectedImageAngle || selectedFormats.length === 0) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    setResults(null);

    // Simulate progress based on formats selected
    const totalFormats = selectedFormats.includes('combined') ? 3 : selectedFormats.length;
    const progressIncrement = 80 / totalFormats; // Reserve 20% for final processing
    
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 80) {
          clearInterval(progressInterval);
          return 80;
        }
        return prev + Math.random() * progressIncrement * 0.3;
      });
    }, 1000);

    try {
      const response = await fetch('/api/generate-creative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: selectedPath,
          palette: palette.palette,
          customizations,
          imagePromptChoice: selectedImageAngle,
          formats: selectedFormats,
          imageAspectRatio: aspectRatio.imageAspectRatio,
          videoAspectRatio: aspectRatio.videoAspectRatio,
          imageSeriesConfig: {
            themeId: imageSeries.config.themeId,
            count: imageSeries.config.count,
            aspectRatio: imageSeries.config.aspectRatio
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setResults(result);
        setGenerationProgress(100);
        
        // Log successful generation
        console.log('✅ Generation complete:', result.formats_generated?.join(', ') || 'unknown formats');
        
        // Show any errors but don't fail completely
        if (result.errors?.length > 0) {
          console.warn('⚠️ Some formats failed:', result.errors);
        }
      } else {
        console.error('Failed to generate content');
        const errorData = await response.json();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  };

  const handleCreateSeries = async (config: ImageSeriesConfig) => {
    if (!palette || !selectedImageAngle) return;

    try {
      const response = await fetch('/api/generate-creative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: selectedPath,
          palette: palette.palette,
          customizations,
          imagePromptChoice: selectedImageAngle,
          formats: ['image-series'],
          imageSeriesConfig: {
            themeId: config.themeId,
            count: config.count,
            aspectRatio: config.aspectRatio
          }
        }),
      });

      if (response.ok) {
        const seriesResult = await response.json();

        // Append series to existing results
        setResults(prev => {
          if (!prev) return seriesResult;

          return {
            ...prev,
            image_series_urls: seriesResult.image_series_urls || [],
            formats_generated: [...prev.formats_generated, 'image-series'],
            errors: [...(prev.errors || []), ...(seriesResult.errors || [])]
          };
        });

        console.log('✅ Image series created:', seriesResult.image_series_urls?.length || 0, 'images');
      } else {
        console.error('Failed to create series');
        const errorData = await response.json();
        console.error('Error details:', errorData);
        throw new Error('Series generation failed');
      }
    } catch (error) {
      console.error('Error creating series:', error);
      throw error; // Re-throw so the modal can handle it
    }
  };

  const getImageAngles = () => {
    return IMAGE_PROMPT_OPTIONS[selectedPath] || [];
  };

  const getGenerateButtonText = () => {
    if (selectedFormats.length === 1) {
      switch (selectedFormats[0]) {
        case 'image':
          return `${selectedPath} Image`;
        case 'video':
          return `${selectedPath} Video`;
        case 'series':
          return `${selectedPath} Series`;
        case 'combined':
          return `Complete Package`;
        default:
          return `${selectedPath} Content`;
      }
    } else if (selectedFormats.length > 1) {
      return `${selectedFormats.length} Formats`;
    }
    return `${selectedPath} Content`;
  };

  const handlePathChange = (newPath: string) => {
    setSelectedPath(newPath as CreativePath);
    setSelectedImageAngle('');
    setCustomizations({});
    setResults(null);
  };

  const getTimelineStep = () => {
    if (results) return 'complete';
    if (isGenerating) return 'generate';
    if (selectedImageAngle && selectedFormats.length > 0) return 'generate';
    if (selectedPath && palette) return 'customize';
    if (palette) return 'extract';
    return 'upload';
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Adaptive background based on palette */}
      <AdaptiveBackground palette={palette?.palette || null} intensity={0.15} />

      {/* Floating color orbs */}
      <FloatingColorOrbs palette={palette?.palette || null} enabled={!!palette} />

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 relative"
        >
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            🎨 Creative Studio
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform visual inspiration into creative content - generate images, videos, and series using AI-powered color analysis
          </p>
        </motion.div>

        {/* Color Story Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <ColorStoryTimeline currentStep={getTimelineStep()} compact={true} />
        </motion.div>

        {/* Animated Journey Showcase - shown when no palette yet */}
        {!palette && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <AnimatedJourneyShowcase />
          </motion.div>
        )}

        {/* Top Section - Image Upload and Palette Extraction */}
        <div className={`${palette ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : 'max-w-3xl mx-auto'} mb-8`}>
          {/* Image Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  1. Choose Your Inspiration Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  onImageSelect={setCurrentImage}
                  currentImage={currentImage}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Color Palette Display */}
          {palette && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Extracted Palette</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPalettePlayground(!showPalettePlayground)}
                      >
                        <Palette className="h-4 w-4 mr-2" />
                        {showPalettePlayground ? 'Hide' : 'Edit'} Colors
                      </Button>
                      {results && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowColorStory(true)}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          View Story
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ColorPalette
                    palette={palette.palette}
                    moodDescription={palette.mood_description}
                  />
                </CardContent>
              </Card>

              {/* Palette Playground */}
              {showPalettePlayground && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <PalettePlayground
                    palette={palette.palette}
                    onPaletteChange={(newPalette) => {
                      setPalette({ ...palette, palette: newPalette });
                    }}
                    onRefresh={extractPalette}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        {/* Full Width - Number of Colors Selection */}
        {currentImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>2. Extract Color Palette</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Number of colors</Label>
                    <motion.div
                      key={swatchCount[0]}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="px-3 py-1 bg-gradient-to-r from-blue-100 to-emerald-100 dark:from-blue-900/30 dark:to-emerald-900/30 rounded-full"
                    >
                      <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                        {swatchCount[0]} colors
                      </span>
                    </motion.div>
                  </div>
                  <div className="px-2">
                    <Slider
                      value={swatchCount}
                      onValueChange={setSwatchCount}
                      max={8}
                      min={3}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>3</span>
                      <span>5</span>
                      <span>8</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {swatchCount[0] <= 4 && "Minimal palette for clean, focused designs"}
                    {swatchCount[0] === 5 && "Balanced palette perfect for most projects"}
                    {swatchCount[0] === 6 && "Rich palette with good variety"}
                    {swatchCount[0] >= 7 && "Complex palette for vibrant, detailed designs"}
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={extractPalette}
                    disabled={isExtractingPalette}
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 transition-all duration-200"
                    size="lg"
                  >
                    {isExtractingPalette ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"
                        />
                        Extracting Colors...
                      </>
                    ) : (
                      <>
                        <Palette className="h-4 w-4 mr-2" />
                        Extract Palette
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Full Width - Creative Path Selection */}
        {palette && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="border-2 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl">3. Choose Your Creative Path</CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedCreativePathSelector
                  paths={CREATIVE_PATHS}
                  selectedPath={selectedPath}
                  onPathChange={handlePathChange}
                  disabled={isGenerating}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Wide Customization Panel */}
        {palette && selectedPath && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="border-2 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl">4. Customize Your Vision</CardTitle>
                <p className="text-muted-foreground">
                  Fine-tune your {selectedPath.toLowerCase()} concept with these style preferences
                </p>
              </CardHeader>
              <CardContent>
                {/* Full Width Customization Options */}
                <div className="space-y-8">
                  <CustomizationWizard
                    selectedPath={selectedPath}
                    customizations={customizations}
                    onCustomizationChange={setCustomizations}
                    palette={palette?.palette}
                    isGenerating={isGenerating}
                  />
                  
                  {/* Output Format Selection */}
                  <div className="border-t pt-8">
                    <OutputFormatSelector
                      selectedFormats={selectedFormats}
                      onSelectionChange={setSelectedFormats}
                      isGenerating={isGenerating}
                    />
                  </div>

                  {/* Aspect Ratio Selection */}
                  <div className="border-t pt-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Aspect Ratios</h3>
                        <p className="text-sm text-muted-foreground">Configure aspect ratios for images and videos independently</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AspectRatioSelector
                          label="Image Aspect Ratio"
                          value={aspectRatio.imageAspectRatio}
                          onChange={aspectRatio.setImageAspectRatio}
                          disabled={isGenerating}
                        />
                        <AspectRatioSelector
                          label="Video Aspect Ratio"
                          value={aspectRatio.videoAspectRatio}
                          onChange={aspectRatio.setVideoAspectRatio}
                          disabled={isGenerating || !selectedFormats.some(format => ['video', 'series', 'combined'].includes(format))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Image Series Configuration (shown only when image-series format is selected) */}
                  {selectedFormats.includes('image-series') && (
                    <div className="border-t pt-8">
                      <ImageSeriesConfigPanel
                        domain={selectedPath}
                        config={imageSeries.config}
                        onCountChange={imageSeries.setCount}
                        onThemeChange={imageSeries.setTheme}
                        onAspectRatioChange={imageSeries.setAspectRatio}
                        disabled={isGenerating}
                      />
                    </div>
                  )}

                  {/* Visual Style Section */}
                  <div className="border-t pt-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Visual Style</h3>
                        <p className="text-sm text-muted-foreground">Choose how your creation should be visualized</p>
                      </div>

                      {/* Interactive Button Row */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {getImageAngles().map((angle) => (
                          <motion.button
                            key={angle}
                            onClick={() => setSelectedImageAngle(angle)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                              relative p-4 rounded-lg border-2 transition-all duration-300 text-left
                              ${selectedImageAngle === angle
                                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950/50 dark:to-emerald-950/50 shadow-md'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-blue-300 dark:hover:border-blue-600'
                              }
                            `}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`
                                p-2 rounded-lg flex-shrink-0
                                ${selectedImageAngle === angle
                                  ? 'bg-gradient-to-br from-blue-500 to-emerald-500 text-white'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                }
                              `}>
                                <Palette className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium line-clamp-2 ${
                                  selectedImageAngle === angle ? 'text-blue-900 dark:text-blue-100' : ''
                                }`}>
                                  {angle}
                                </p>
                              </div>
                            </div>
                            {selectedImageAngle === angle && (
                              <motion.div
                                layoutId="style-indicator"
                                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-500"
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                              />
                            )}
                          </motion.button>
                        ))}
                      </div>

                      {/* Generate Button */}
                      {selectedImageAngle && selectedFormats.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="w-full"
                        >
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              onClick={generateIdeas}
                              disabled={isGenerating}
                              className="w-full h-14 text-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
                              size="lg"
                            >
                              {isGenerating ? (
                                <>
                                  <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                  >
                                    <Wand2 className="h-5 w-5 mr-3" />
                                  </motion.div>
                                  Generating Magic...
                                </>
                              ) : (
                                <>
                                  <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  >
                                    <Sparkles className="h-5 w-5 mr-3" />
                                  </motion.div>
                                  Generate {getGenerateButtonText()}
                                </>
                              )}
                            </Button>
                          </motion.div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Progress Section */}
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8"
                    >
                      <EnhancedGenerationProgress
                        progress={generationProgress}
                        formats={selectedFormats}
                        palette={palette?.palette}
                        currentPath={selectedPath}
                      />
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {(results || isGenerating) && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <CreativeResults
                result={results}
                isGenerating={isGenerating}
                selectedFormats={selectedFormats}
                imageAspectRatio={aspectRatio.imageAspectRatio}
                videoAspectRatio={aspectRatio.videoAspectRatio}
                domain={selectedPath}
                onRegenerate={generateIdeas}
                onCreateSeries={handleCreateSeries}
              />

              {/* Session Sharing */}
              {results && palette && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <SessionSharing
                    sessionId={sessionId}
                    palette={palette}
                    creativePath={selectedPath}
                    result={results}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Color Story Modal */}
        <AnimatePresence>
          {showColorStory && palette && currentImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
              onClick={() => setShowColorStory(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-4xl w-full max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <ColorStoryMode
                  originalImage={currentImage}
                  palette={palette.palette}
                  creativePath={selectedPath}
                  customizations={customizations}
                  result={results}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center mt-16 text-muted-foreground"
        >
          <p>Powered by Anthropic Claude • Gemini (Nano Banana) • Google Veo 3 • Next.js</p>
        </motion.div>
      </div>
    </div>
  );
}
