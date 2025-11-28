import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Sparkles, Wand2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ImageUpload';
import { ColorPalette } from '@/components/ColorPalette';
import { OutputFormatSelector } from '@/components/OutputFormatSelector';
import { CreativeResults } from '@/components/CreativeResults';
import { AdaptiveBackground } from '@/components/AdaptiveBackground';
import { FloatingColorOrbs } from '@/components/FloatingColorOrbs';
import { EnhancedCreativePathSelector } from '@/components/EnhancedCreativePathSelector';
import { CustomizationWizard } from '@/components/CustomizationWizard';
import { EnhancedGenerationProgress } from '@/components/EnhancedGenerationProgress';
import { ColorStoryTimeline } from '@/components/ColorStoryTimeline';
import { PalettePlayground } from '@/components/PalettePlayground';
import { SessionSharing } from '@/components/SessionSharing';
import { AnimatedJourneyShowcase } from '@/components/AnimatedJourneyShowcase';
import { AspectRatioSelector } from '@/features/aspect-ratio/AspectRatioSelector';
import { ImageSeriesConfigPanel } from '@/features/image-series/ImageSeriesConfig';
import { CREATIVE_PATHS } from '@/lib/agents';
import { PaletteEntry } from '@/lib/anthropic';
import { ColorModeState } from './useColorMode';
import { AppMode } from '@/hooks/useAppSession';
import { GeminiModelType } from '@/lib/geminiV2';

interface ColorModeProps extends ColorModeState {
    sessionId: string | null;
    selectedModel: GeminiModelType;
    setAppMode: (mode: AppMode) => void;
    setInvitationColorPalette: (palette: string[]) => void;
    setAssetPickerTarget: (target: 'color' | 'product') => void;
    setIsAssetLibraryOpen: (isOpen: boolean) => void;
}

export function ColorMode({
    sessionId,
    selectedModel,
    setAppMode,
    setInvitationColorPalette,
    setAssetPickerTarget,
    setIsAssetLibraryOpen,
    // Hook state props
    currentImage, setCurrentImage,
    handleImageSelect,
    palette, setPalette,
    isExtractingPalette,
    swatchCount, setSwatchCount,
    selectedPath, setSelectedPath,
    selectedImageAngle, setSelectedImageAngle,
    customizations, setCustomizations,
    selectedFormats, setSelectedFormats,
    isGenerating,
    generationProgress,
    results, setResults,
    showPalettePlayground, setShowPalettePlayground,
    showColorStory, setShowColorStory,
    aspectRatio,
    imageSeries,
    extractPalette,
    generateIdeas,
    handleCreateSeries,
    handlePathChange,
    getImageAngles,
    getGenerateButtonText,
    getTimelineStep,
    resetColorExperience
}: ColorModeProps) {

    return (
        <>
            {/* Adaptive background based on palette */}
            <AdaptiveBackground palette={palette?.palette || null} intensity={0.15} />

            {/* Floating color orbs */}
            <FloatingColorOrbs palette={palette?.palette || null} enabled={!!palette} />

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
                                onImageSelect={handleImageSelect}
                                currentImage={currentImage}
                            />
                            {sessionId && (
                                <Button
                                    variant="outline"
                                    className="mt-3 w-full"
                                    onClick={() => {
                                        setAssetPickerTarget('color');
                                        setIsAssetLibraryOpen(true);
                                    }}
                                >
                                    Browse Saved Assets
                                </Button>
                            )}
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
                                        {sessionId && (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => {
                                                    setInvitationColorPalette((palette?.palette || []).map((entry: PaletteEntry) => entry.hex));
                                                    setAppMode('invitation');
                                                }}
                                            >
                                                Apply to Invitations
                                            </Button>
                                        )}
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
                                                            <p className={`text-sm font-medium line-clamp-2 ${selectedImageAngle === angle ? 'text-blue-900 dark:text-blue-100' : ''
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
                        {results && palette && sessionId && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <SessionSharing
                                    sessionId={sessionId!}
                                    palette={palette}
                                    creativePath={selectedPath}
                                    result={results}
                                />
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
