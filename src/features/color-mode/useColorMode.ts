import { useState } from 'react';
import { PaletteOutput } from '@/lib/anthropic';
import { CREATIVE_PATHS, IMAGE_PROMPT_OPTIONS, CreativeCustomizations, CreativeResult } from '@/lib/agents';
import { OutputFormat } from '@/components/OutputFormatSelector';
import { useAspectRatio } from '@/features/aspect-ratio/useAspectRatio';
import { useImageSeries, ImageSeriesConfig } from '@/features/image-series/useImageSeries';

export type CreativePath = typeof CREATIVE_PATHS[number];

export function useColorMode() {
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

    // Custom hooks
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

    const handlePathChange = (newPath: string) => {
        setSelectedPath(newPath as CreativePath);
        setSelectedImageAngle('');
        setCustomizations({});
        setResults(null);
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

    const getTimelineStep = () => {
        if (results) return 'complete';
        if (isGenerating) return 'generate';
        if (selectedImageAngle && selectedFormats.length > 0) return 'generate';
        if (selectedPath && palette) return 'customize';
        if (palette) return 'extract';
        return 'upload';
    };

    const resetColorExperience = () => {
        setPalette(null);
        setResults(null);
    };

    const handleImageSelect = (imageData: string) => {
        setCurrentImage(imageData);
        setPalette(null);
        setResults(null);
    };

    return {
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
    };
}

export type ColorModeState = ReturnType<typeof useColorMode>;
