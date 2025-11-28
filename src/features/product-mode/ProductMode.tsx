import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { ProductUpload } from '@/components/ProductPath/ProductUpload';
import { EnvironmentCategorySelector } from '@/components/ProductPath/EnvironmentCategorySelector';
import { ProductGenerationConfig } from '@/components/ProductPath/ProductGenerationConfig';
import { ProductResultsGrid } from '@/components/ProductPath/ProductResultsGrid';
import { ProductColorPaletteSelector } from '@/components/ProductPath/ProductColorPaletteSelector';
import { ProductJourneyShowcase } from '@/components/ProductJourneyShowcase';
import { ProductModeState } from './useProductMode';
import { GeminiModelType } from '@/lib/geminiV2';

interface ProductModeProps extends ProductModeState {
    sessionId: string | null;
    selectedModel: GeminiModelType;
    setAssetPickerTarget: (target: 'color' | 'product') => void;
    setIsAssetLibraryOpen: (isOpen: boolean) => void;
    currentImage?: string;
    onImageChange?: (image: string) => void;
}

export function ProductMode({
    sessionId,
    selectedModel,
    setAssetPickerTarget,
    setIsAssetLibraryOpen,
    currentImage: externalImage,
    onImageChange,
    // Hook state props
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
}: ProductModeProps) {

    // Sync external image if provided (for asset picker integration)
    React.useEffect(() => {
        if (externalImage && externalImage !== productImage) {
            handleProductSelect(externalImage);
        }
    }, [externalImage]);

    // Notify parent of image changes
    React.useEffect(() => {
        if (onImageChange) {
            onImageChange(productImage);
        }
    }, [productImage, onImageChange]);

    return (
        <>
            {!productImage && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.05 }}
                    className="mb-10"
                >
                    <ProductJourneyShowcase />
                </motion.div>
            )}

            {/* 1. Upload Product */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-8"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>1. Upload Product Image</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProductUpload
                            currentImage={productImage}
                            extractedImage={extractedProduct}
                            isExtracting={isExtractingProduct}
                            onProductSelect={handleProductSelect}
                        />
                        {sessionId && (
                            <Button
                                variant="outline"
                                className="mt-3 w-full"
                                onClick={() => {
                                    setAssetPickerTarget('product');
                                    setIsAssetLibraryOpen(true);
                                }}
                            >
                                Browse Saved Assets
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* 2. Select Environments */}
            {extractedProduct && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-8"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>2. Choose Environments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EnvironmentCategorySelector
                                selectedCategories={selectedScenes.map(s => s.categoryId)}
                                onCategoriesChange={handleScenesChange}
                                multiSelect={true}
                                maxSelections={5}
                            />
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* 3. Configure Generation */}
            {extractedProduct && selectedScenes.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mb-8"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>3. Configure Generation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <ProductGenerationConfig
                                selectedScenes={selectedScenes}
                                onScenesChange={setSelectedScenes}
                                selectedFormats={productOutputFormats}
                                onFormatsChange={setProductOutputFormats}
                                disabled={isGeneratingProduct}
                            />

                            <div className="pt-6 border-t">
                                <ProductColorPaletteSelector
                                    value={productColorPalette}
                                    onChange={setProductColorPalette}
                                    disabled={isGeneratingProduct}
                                />
                            </div>

                            <div className="pt-6 border-t">
                                <Button
                                    onClick={generateMultipleProductPlacements}
                                    disabled={isGeneratingProduct}
                                    className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                    size="lg"
                                >
                                    {isGeneratingProduct ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="h-5 w-5 border-2 border-current border-t-transparent rounded-full mr-3"
                                            />
                                            Generating {productGenerationProgress.total > 0 ? `(${productGenerationProgress.current}/${productGenerationProgress.total})` : '...'}
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-5 w-5 mr-3" />
                                            Generate Product Placements
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* 4. Results */}
            {(productResultItems.length > 0 || isGeneratingProduct) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <ProductResultsGrid
                        results={productResultItems}
                        isRegenerating={false} // Todo: Implement regeneration
                    />
                </motion.div>
            )}
        </>
    );
}
