import { useState } from 'react';
import { SceneConfig, ProductOutputFormat } from '@/components/ProductPath/ProductGenerationConfig';
import { ProductResultItem } from '@/components/ProductPath/ProductResultsGrid';
import { getCategoryById } from '@/config/environments';
import { GeminiModelType } from '@/lib/geminiV2';
import { useAspectRatio } from '@/features/aspect-ratio/useAspectRatio';

export function useProductMode(selectedModel: GeminiModelType, sessionId: string | null) {
    const [productImage, setProductImage] = useState<string>('');
    const [extractedProduct, setExtractedProduct] = useState<string>('');
    const [isExtractingProduct, setIsExtractingProduct] = useState(false);
    const [isGeneratingProduct, setIsGeneratingProduct] = useState(false);

    // Multi-scene product path states
    const [selectedScenes, setSelectedScenes] = useState<SceneConfig[]>([]);
    const [productOutputFormats, setProductOutputFormats] = useState<ProductOutputFormat[]>(['image']);
    const [productResultItems, setProductResultItems] = useState<ProductResultItem[]>([]);
    const [productGenerationProgress, setProductGenerationProgress] = useState({ current: 0, total: 0 });
    const [productColorPalette, setProductColorPalette] = useState<string[]>([]);

    // We reuse the aspect ratio hook, though we might hardcode or pass a default path
    const aspectRatio = useAspectRatio('Product');

    const extractProductBackground = async (imageData: string) => {
        setIsExtractingProduct(true);
        try {
            const response = await fetch('/api/remove-background', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageData, model: selectedModel }),
            });

            if (response.ok) {
                const result = await response.json();
                setExtractedProduct(result.imageData || result.imageUrl);
            } else {
                console.error('Failed to extract product');
                alert('Failed to extract product. Please try again.');
            }
        } catch (error) {
            console.error('Error extracting product:', error);
            alert('Error extracting product. Please try again.');
        } finally {
            setIsExtractingProduct(false);
        }
    };

    const handleProductSelect = async (imageData: string, extracted?: string) => {
        setProductImage(imageData);
        if (extracted) {
            setExtractedProduct(extracted);
        } else if (imageData) {
            // Auto-extract background
            await extractProductBackground(imageData);
        } else {
            // Reset when image is removed
            setExtractedProduct('');
            setSelectedScenes([]);
            setProductResultItems([]);
        }
    };

    const handleScenesChange = (categoryIds: string[]) => {
        setSelectedScenes(
            categoryIds.map(id => ({
                categoryId: id,
                imageCount: 1,
            }))
        );
        setProductResultItems([]);
    };

    const generateMultipleProductPlacements = async () => {
        if (!extractedProduct || selectedScenes.length === 0 || productOutputFormats.length === 0) return;

        setIsGeneratingProduct(true);
        setProductResultItems([]);

        const totalImages = productOutputFormats.includes('image')
            ? selectedScenes.reduce((sum, scene) => sum + scene.imageCount, 0)
            : 0;
        const totalVideos = productOutputFormats.includes('video') ? selectedScenes.length : 0;
        const total = totalImages + totalVideos;
        let completed = 0;

        setProductGenerationProgress({ current: 0, total });

        const results: ProductResultItem[] = [];

        try {
            for (const scene of selectedScenes) {
                const category = getCategoryById(scene.categoryId);
                if (!category) continue;

                // Generate images for this scene
                if (productOutputFormats.includes('image')) {
                    for (let i = 0; i < scene.imageCount; i++) {
                        try {
                            // Use first variation or custom prompt
                            const variation = category.variations[i % category.variations.length];

                            const response = await fetch('/api/product-placement', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    productImage: extractedProduct,
                                    categoryId: scene.categoryId,
                                    variationId: variation?.id,
                                    customPrompt: scene.customPrompt,
                                    aspectRatio: aspectRatio.imageAspectRatio,
                                    model: selectedModel,
                                    sessionId,
                                    colorPalette: productColorPalette.length ? productColorPalette : undefined,
                                }),
                            });

                            if (response.ok) {
                                const result = await response.json();
                                results.push({
                                    id: `${scene.categoryId}-img-${i}-${Date.now()}`,
                                    type: 'image',
                                    url: result.imageUrl || '',
                                    dataUrl: result.imageData,
                                    promptUsed: result.promptUsed,
                                    categoryName: category.name,
                                    variationName: variation?.name,
                                    aspectRatio: aspectRatio.imageAspectRatio,
                                    sceneIndex: selectedScenes.indexOf(scene),
                                    imageIndex: i,
                                });
                            }
                        } catch (error) {
                            console.error('Error generating image:', error);
                        }

                        completed++;
                        setProductGenerationProgress({ current: completed, total });
                        // Update results progressively
                        setProductResultItems([...results]);
                    }
                }

                // Generate video for this scene
                if (productOutputFormats.includes('video')) {
                    try {
                        // Use first variation for video
                        const variation = category.variations[0];

                        const response = await fetch('/api/product-video', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                productImage: extractedProduct,
                                categoryId: scene.categoryId,
                                variationId: variation?.id,
                                customPrompt: scene.customPrompt,
                                aspectRatio: aspectRatio.videoAspectRatio || '9:16',
                                colorPalette: productColorPalette.length ? productColorPalette : undefined,
                                sessionId,
                            }),
                        });

                        if (response.ok) {
                            const result = await response.json();
                            results.push({
                                id: `${scene.categoryId}-video-${Date.now()}`,
                                type: 'video',
                                url: result.videoUrl || '',
                                promptUsed: result.promptUsed,
                                categoryName: category.name,
                                variationName: variation?.name,
                                aspectRatio: aspectRatio.videoAspectRatio || '9:16',
                                sceneIndex: selectedScenes.indexOf(scene),
                            });
                        } else {
                            console.error('Failed to generate video for scene:', scene.categoryId);
                        }
                    } catch (error) {
                        console.error('Error generating video:', error);
                    }

                    completed++;
                    setProductGenerationProgress({ current: completed, total });
                    setProductResultItems([...results]);
                }
            }

            setProductResultItems(results);
        } catch (error) {
            console.error('Error in multi-product generation:', error);
        } finally {
            setIsGeneratingProduct(false);
            // Reset progress after a short delay to show completion
            setTimeout(() => setProductGenerationProgress({ current: 0, total: 0 }), 1000);
        }
    };

    const resetProductExperience = () => {
        setProductImage('');
        setExtractedProduct('');
        setSelectedScenes([]);
        setProductResultItems([]);
        setProductColorPalette([]);
    };

    return {
        productImage, setProductImage,
        extractedProduct, setExtractedProduct,
        isExtractingProduct,
        isGeneratingProduct,
        selectedScenes, setSelectedScenes,
        productOutputFormats, setProductOutputFormats,
        productResultItems, setProductResultItems,
        productGenerationProgress,
        productColorPalette, setProductColorPalette,
        aspectRatio,
        handleProductSelect,
        handleScenesChange,
        generateMultipleProductPlacements,
        resetProductExperience
    };
}

export type ProductModeState = ReturnType<typeof useProductMode>;
