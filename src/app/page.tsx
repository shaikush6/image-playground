'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Sparkles, Wand2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ImageUpload';
import { ColorPalette } from '@/components/ColorPalette';
import { DynamicCustomizationPanel } from '@/components/DynamicCustomizationPanel';
import { OutputFormatSelector, OutputFormat } from '@/components/OutputFormatSelector';
import { CreativeResults } from '@/components/CreativeResults';
import { ThemeToggle } from '@/components/theme-toggle';
import { PaletteOutput, PaletteEntry } from '@/lib/anthropic';
import { CREATIVE_PATHS, IMAGE_PROMPT_OPTIONS, CreativeCustomizations, CreativeResult } from '@/lib/agents';
import Image from 'next/image';

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

  const handlePathChange = (newPath: CreativePath) => {
    setSelectedPath(newPath);
    setSelectedImageAngle('');
    setCustomizations({});
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
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

        {/* Top Section - Image Upload and Palette Extraction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Image Upload and Palette Extraction */}
          <div className="space-y-6">
            {/* Image Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
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

            {/* Palette Extraction */}
            {currentImage && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
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
          </div>

          {/* Right Column - Palette Display and Creative Path Selection */}
          <div className="space-y-6">
            {/* Color Palette Display */}
            {palette && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Extracted Palette</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ColorPalette 
                      palette={palette.palette}
                      moodDescription={palette.mood_description}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Creative Path Selection */}
            {palette && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>3. Choose Your Creative Path</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {CREATIVE_PATHS.map((path) => (
                        <Button
                          key={path}
                          variant={selectedPath === path ? "default" : "outline"}
                          onClick={() => handlePathChange(path)}
                          className="justify-start h-auto p-3"
                        >
                          <span className="text-left">{path}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Wide Customization Panel */}
        {palette && selectedPath && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">4. Customize Your Vision</CardTitle>
                <p className="text-muted-foreground">
                  Fine-tune your {selectedPath.toLowerCase()} concept with these style preferences
                </p>
              </CardHeader>
              <CardContent>
                {/* Full Width Customization Options */}
                <div className="space-y-8">
                  <DynamicCustomizationPanel
                    selectedPath={selectedPath}
                    customizations={customizations}
                    onCustomizationChange={setCustomizations}
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
                  
                  {/* Visual Style Section */}
                  <div className="border-t pt-8">
                    <h3 className="text-xl font-semibold mb-6">Visual Style</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Label className="text-lg">Choose Your Visual Style</Label>
                        <Select value={selectedImageAngle} onValueChange={setSelectedImageAngle}>
                          <SelectTrigger className="h-14 text-lg">
                            <SelectValue placeholder="Select image style..." />
                          </SelectTrigger>
                          <SelectContent>
                            {getImageAngles().map((angle) => (
                              <SelectItem key={angle} value={angle} className="text-lg">
                                {angle}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Generate Button */}
                      <div className="flex items-end">
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
                    
                    {/* Progress Section */}
                    {isGenerating && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6"
                      >
                        <Progress value={generationProgress} className="h-3" />
                        <p className="text-lg text-muted-foreground mt-3 text-center">
                          {generationProgress < 20 && "Analyzing your palette..."}
                          {generationProgress >= 20 && generationProgress < 40 && "Generating creative concepts..."}
                          {generationProgress >= 40 && generationProgress < 70 && `Creating your ${selectedFormats.join(', ').replace(/,([^,]*)$/, ' and$1')}...`}
                          {generationProgress >= 70 && generationProgress < 90 && "Finalizing content..."}
                          {generationProgress >= 90 && "Almost done!"}
                        </p>
                      </motion.div>
                    )}
                  </div>
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
            >
              <CreativeResults
                result={results}
                isGenerating={isGenerating}
                selectedFormats={selectedFormats}
                onRegenerate={generateIdeas}
              />
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
