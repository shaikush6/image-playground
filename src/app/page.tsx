'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Sparkles, Wand2, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ImageUpload';
import { ColorPalette } from '@/components/ColorPalette';
import { OutputFormatSelector, OutputFormat } from '@/components/OutputFormatSelector';
import { CreativeResults } from '@/components/CreativeResults';
import { ThemeToggle } from '@/components/theme-toggle';
import { PaletteOutput, PaletteEntry } from '@/lib/anthropic';
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
import { ModeToggle } from '@/components/ModeToggle';
import { ProductUpload } from '@/components/ProductPath/ProductUpload';
import { EnvironmentCategorySelector } from '@/components/ProductPath/EnvironmentCategorySelector';
import { ProductGenerationConfig, SceneConfig, ProductOutputFormat } from '@/components/ProductPath/ProductGenerationConfig';
import { ProductResultsGrid, ProductResultItem } from '@/components/ProductPath/ProductResultsGrid';
import { ProductColorPaletteSelector } from '@/components/ProductPath/ProductColorPaletteSelector';
import { getCategoryById } from '@/config/environments';
import { ModelToggle } from '@/components/ModelToggle';
import type { GeminiModelType } from '@/lib/geminiV2';
import { EventDetailsForm } from '@/components/InvitationPath/EventDetailsForm';
import { InvitationCategorySelector } from '@/components/InvitationPath/InvitationCategorySelector';
import { InvitationStylePanel } from '@/components/InvitationPath/InvitationStylePanel';
import { InvitationPreview } from '@/components/InvitationPath/InvitationPreview';
import { InvitationResultsGrid, InvitationResultItem } from '@/components/InvitationPath/InvitationResultsGrid';
import {
  INVITATION_CATEGORIES,
  EventDetails as InvitationDetails,
  InvitationAspectRatio,
  getInvitationCategoryById as getInvitationCategory,
  getInvitationStyleById as getInvitationStyle,
} from '@/config/invitations';
import { InvitationTemplateGallery } from '@/components/InvitationPath/InvitationTemplateGallery';
import { getTemplatesForCategory, getTemplateById } from '@/config/invitationTemplates';
import { InvitationColorSelector } from '@/components/InvitationPath/InvitationColorSelector';
import { InvitationVariationSelector } from '@/components/InvitationPath/InvitationVariationSelector';
import { INVITATION_VARIATIONS } from '@/config/invitationVariations';
import { AssetLibrarySheet, AssetItem } from '@/components/AssetLibrarySheet';
import { ProductJourneyShowcase } from '@/components/ProductJourneyShowcase';
import { InvitationJourneyShowcase } from '@/components/InvitationJourneyShowcase';

type CreativePath = typeof CREATIVE_PATHS[number];
type AppMode = 'color' | 'product' | 'invitation';
type InvitationOutputFormat = 'image' | 'video';
type InvitationGenerationResponse = {
  error?: string;
  results?: Array<{
    id?: string;
    imageUrl?: string;
    imageData?: string;
    promptUsed?: string;
    categoryName?: string;
    styleName?: string;
  }>;
};
type InvitationVideoResponse = {
  error?: string;
  id?: string;
  videoUrl?: string;
  promptUsed?: string;
  categoryName?: string;
  styleName?: string;
};
type SessionSnapshot = {
  appMode: AppMode;
  eventDetails: InvitationDetails;
  selectedInvitationCategory: string;
  selectedInvitationStyle: string;
  invitationAspectRatio: InvitationAspectRatio;
  invitationOutputFormats: InvitationOutputFormat[];
  invitationVariantCount: number;
  selectedScenes: SceneConfig[];
  productOutputFormats: ProductOutputFormat[];
  selectedInvitationTemplate?: string;
  invitationColorPalette?: string[];
  invitationVariationModes?: string[];
  productColorPalette?: string[];
};

const SESSION_STORAGE_KEY = 'creative-studio-session';

const INITIAL_EVENT_DETAILS: InvitationDetails = {
  title: '',
  subtitle: '',
  date: '',
  time: '',
  location: '',
  description: '',
  hostName: '',
  rsvpInfo: '',
  moodKeywords: '',
  dressCode: '',
};


const INVITATION_ASPECT_OPTIONS: InvitationAspectRatio[] = ['4:5', '3:2', '1:1', '9:16', '16:9'];

const INVITATION_OUTPUT_OPTIONS: Array<{
  id: InvitationOutputFormat;
  label: string;
  description: string;
  accent: string;
}> = [
  {
    id: 'image',
    label: 'Static Image',
    description: 'High-resolution PNG, perfect for print or social sharing',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'video',
    label: 'Animated Loop',
    description: 'Short Veo animation with dynamic typography',
    accent: 'from-rose-500 to-amber-500',
  },
];

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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSessionHydrated, setIsSessionHydrated] = useState(false);

  // Product Path mode states
  const [appMode, setAppMode] = useState<AppMode>('color');
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

  // Invitation path states
  const [eventDetails, setEventDetails] = useState<InvitationDetails>(() => ({ ...INITIAL_EVENT_DETAILS }));
  const [selectedInvitationCategory, setSelectedInvitationCategory] = useState<string>('');
  const [selectedInvitationStyle, setSelectedInvitationStyle] = useState<string>('');
  const [invitationAspectRatio, setInvitationAspectRatio] = useState<InvitationAspectRatio>('4:5');
  const [invitationOutputFormats, setInvitationOutputFormats] = useState<InvitationOutputFormat[]>(['image']);
  const [invitationVariantCount, setInvitationVariantCount] = useState(3);
  const [invitationResults, setInvitationResults] = useState<InvitationResultItem[]>([]);
  const [isGeneratingInvitation, setIsGeneratingInvitation] = useState(false);
  const [invitationGenerationProgress, setInvitationGenerationProgress] = useState({ current: 0, total: 0 });
  const [selectedInvitationTemplate, setSelectedInvitationTemplate] = useState<string>('');
  const [invitationColorPalette, setInvitationColorPalette] = useState<string[]>([]);
  const [invitationVariationModes, setInvitationVariationModes] = useState<string[]>([]);

  // Model selection state (applies to both paths)
  const [selectedModel, setSelectedModel] = useState<GeminiModelType>('pro');

  // Asset library state
  const [isAssetLibraryOpen, setIsAssetLibraryOpen] = useState(false);
  const [assetPickerTarget, setAssetPickerTarget] = useState<'color' | 'product'>('color');

  // Custom hooks for modular features
  const aspectRatio = useAspectRatio(selectedPath);
  const imageSeries = useImageSeries(selectedPath);
  const invitationCategory = selectedInvitationCategory
    ? getInvitationCategory(selectedInvitationCategory)
    : undefined;
  const invitationStyle = invitationCategory && selectedInvitationStyle
    ? getInvitationStyle(selectedInvitationCategory, selectedInvitationStyle)
    : undefined;
  const invitationTemplate = selectedInvitationTemplate
    ? getTemplateById(selectedInvitationTemplate)
    : undefined;
  const effectiveInvitationVariantCount = invitationVariationModes.length > 0
    ? invitationVariationModes.length
    : invitationVariantCount;
  const appliedInvitationColors = invitationColorPalette.length > 0
    ? invitationColorPalette
    : invitationStyle?.colorScheme;
  const invitationStylePaletteSignature = invitationStyle?.colorScheme?.join(',') ?? '';
  const shouldAutoApplyStylePalette = Boolean(invitationStyle?.colorScheme && invitationColorPalette.length === 0);
  const invitationCategoryId = invitationCategory?.id ?? '';
  const canGenerateInvitations = Boolean(
    eventDetails.title &&
    eventDetails.date &&
    invitationCategory &&
    invitationStyle &&
    invitationOutputFormats.length > 0
  );

  // Initialize session ID from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) {
      setSessionId(existing);
    } else {
      const newId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      window.localStorage.setItem(SESSION_STORAGE_KEY, newId);
      setSessionId(newId);
    }
  }, []);

  // Hydrate last session snapshot
  useEffect(() => {
    if (!sessionId || !sessionId.length) return;
    let cancelled = false;

    const hydrate = async () => {
      try {
        const response = await fetch(`/api/session?sessionId=${sessionId}`);
        if (!response.ok) return;
        const data = await response.json();
        const snapshot = (data?.session?.state || null) as Partial<SessionSnapshot> | null;
        if (!snapshot) return;

        if (snapshot.appMode) setAppMode(snapshot.appMode);
        if (snapshot.eventDetails) {
          setEventDetails(prev => ({ ...prev, ...snapshot.eventDetails }));
        }
        if (typeof snapshot.selectedInvitationCategory === 'string') {
          setSelectedInvitationCategory(snapshot.selectedInvitationCategory);
        }
        if (typeof snapshot.selectedInvitationStyle === 'string') {
          setSelectedInvitationStyle(snapshot.selectedInvitationStyle);
        }
        if (snapshot.invitationAspectRatio) {
          setInvitationAspectRatio(snapshot.invitationAspectRatio);
        }
        if (Array.isArray(snapshot.invitationOutputFormats) && snapshot.invitationOutputFormats.length > 0) {
          setInvitationOutputFormats(snapshot.invitationOutputFormats as InvitationOutputFormat[]);
        }
        if (typeof snapshot.invitationVariantCount === 'number') {
          setInvitationVariantCount(snapshot.invitationVariantCount);
        }
        if (Array.isArray(snapshot.selectedScenes)) {
          setSelectedScenes(snapshot.selectedScenes as SceneConfig[]);
        }
        if (Array.isArray(snapshot.productOutputFormats) && snapshot.productOutputFormats.length > 0) {
          setProductOutputFormats(snapshot.productOutputFormats as ProductOutputFormat[]);
        }
        if (Array.isArray(snapshot.productColorPalette)) {
          setProductColorPalette(snapshot.productColorPalette as string[]);
        }
        if (typeof snapshot.selectedInvitationTemplate === 'string') {
          setSelectedInvitationTemplate(snapshot.selectedInvitationTemplate);
        }
        if (Array.isArray(snapshot.invitationColorPalette)) {
          setInvitationColorPalette(snapshot.invitationColorPalette as string[]);
        }
        if (Array.isArray(snapshot.invitationVariationModes)) {
          setInvitationVariationModes(snapshot.invitationVariationModes as string[]);
        }
      } catch (error) {
        console.error('Failed to hydrate session state', error);
      } finally {
        if (!cancelled) {
          setIsSessionHydrated(true);
        }
      }
    };

    hydrate();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  useEffect(() => {
    if (selectedInvitationTemplate && invitationCategoryId) {
      const template = getTemplateById(selectedInvitationTemplate);
      if (!template || template.categoryId !== invitationCategoryId) {
        setSelectedInvitationTemplate('');
      }
    }
  }, [selectedInvitationTemplate, invitationCategoryId]);

  useEffect(() => {
    if (shouldAutoApplyStylePalette && invitationStyle?.colorScheme) {
      setInvitationColorPalette(invitationStyle.colorScheme.slice(0, 4));
    }
  }, [shouldAutoApplyStylePalette, invitationStylePaletteSignature, invitationStyle]);

  // Persist snapshot when key inputs change
  useEffect(() => {
    if (!sessionId || !isSessionHydrated) return;

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      const payload: SessionSnapshot = {
        appMode,
        eventDetails,
        selectedInvitationCategory,
        selectedInvitationStyle,
        invitationAspectRatio,
        invitationOutputFormats,
        invitationVariantCount,
        selectedScenes,
        productOutputFormats,
        selectedInvitationTemplate,
        invitationColorPalette,
        invitationVariationModes,
        productColorPalette,
      };

      fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          mode: appMode,
          state: payload,
        }),
        signal: controller.signal,
      }).catch(error => {
        if (error && typeof error === 'object' && 'name' in error && (error as DOMException).name === 'AbortError') {
          return;
        }
        console.error('Failed to persist session state', error);
      });
    }, 1200);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [
    sessionId,
    isSessionHydrated,
    appMode,
    eventDetails,
    selectedInvitationCategory,
    selectedInvitationStyle,
    invitationAspectRatio,
    invitationOutputFormats,
    invitationVariantCount,
    selectedScenes,
    productOutputFormats,
    selectedInvitationTemplate,
    invitationColorPalette,
    invitationVariationModes,
    productColorPalette,
  ]);

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

  // Product Path handlers
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

  const resetColorExperience = () => {
    setPalette(null);
    setResults(null);
  };

  const resetProductExperience = () => {
    setProductImage('');
    setExtractedProduct('');
    setSelectedScenes([]);
    setProductResultItems([]);
    setProductColorPalette([]);
  };

  const resetInvitationExperience = () => {
    setInvitationResults([]);
    setInvitationGenerationProgress({ current: 0, total: 0 });
  };

  const handleModeChange = (mode: AppMode) => {
    setAppMode(mode);
    if (mode === 'color') {
      resetProductExperience();
      resetInvitationExperience();
    } else if (mode === 'product') {
      resetColorExperience();
      resetInvitationExperience();
    } else {
      resetColorExperience();
      resetProductExperience();
    }
  };

  // Handler for multi-scene selection
  const handleScenesChange = (categoryIds: string[]) => {
    setSelectedScenes(
      categoryIds.map(id => ({
        categoryId: id,
        imageCount: 1,
      }))
    );
    setProductResultItems([]);
  };

  const handleAssetSelect = (asset: AssetItem) => {
    const assetData = asset.data_url || asset.url || '';
    if (!assetData) return;
    if (assetPickerTarget === 'color') {
      setCurrentImage(assetData);
    } else {
      setProductImage(assetData);
      setExtractedProduct('');
    }
  };

  const handleInvitationCategorySelect = (categoryId: string) => {
    setSelectedInvitationCategory(categoryId);
    setSelectedInvitationStyle('');
    setInvitationResults([]);

    const category = getInvitationCategory(categoryId);
    if (category?.suggestedAspectRatios.length) {
      const [firstRatio] = category.suggestedAspectRatios;
      if (firstRatio) {
        const candidate = firstRatio as InvitationAspectRatio;
        if (INVITATION_ASPECT_OPTIONS.includes(candidate)) {
          setInvitationAspectRatio(candidate);
        }
      }
    }
  };

  const handleInvitationStyleSelect = (styleId: string) => {
    setSelectedInvitationStyle(styleId);
    setInvitationResults([]);
    setSelectedInvitationTemplate('');
    setInvitationVariationModes([]);
    setInvitationColorPalette([]);
  };

  const toggleInvitationFormat = (format: InvitationOutputFormat) => {
    if (invitationOutputFormats.includes(format)) {
      setInvitationOutputFormats(invitationOutputFormats.filter(f => f !== format));
    } else {
      setInvitationOutputFormats([...invitationOutputFormats, format]);
    }
  };

  // Generate multiple product placements
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
          // Update results progressively
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

  const generateInvitations = async () => {
    if (!invitationCategory || !invitationStyle) return;
    if (invitationOutputFormats.length === 0) return;

    const plannedImageVariants = invitationVariationModes.length > 0 ? invitationVariationModes.length : invitationVariantCount;
    const total = (invitationOutputFormats.includes('image') ? plannedImageVariants : 0) +
      (invitationOutputFormats.includes('video') ? 1 : 0);

    setIsGeneratingInvitation(true);
    setInvitationResults([]);
    setInvitationGenerationProgress({ current: 0, total });

    let completed = 0;
    const newResults: InvitationResultItem[] = [];

    try {
      if (invitationOutputFormats.includes('image')) {
        const response = await fetch('/api/invitation-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventDetails,
            categoryId: invitationCategory.id,
            styleId: invitationStyle.id,
            aspectRatio: invitationAspectRatio,
            variantCount: plannedImageVariants,
            model: selectedModel,
            templateId: selectedInvitationTemplate || undefined,
            colorPalette: appliedInvitationColors ?? [],
            variationModes: invitationVariationModes,
            sessionId,
          }),
        });

        const data: InvitationGenerationResponse = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || 'Failed to generate invitations');
        }

        const imageResults = data.results ?? [];
        imageResults.forEach((result, index) => {
          newResults.push({
            id: result.id || `invitation-${Date.now()}-${index}`,
            type: 'image',
            url: result.imageUrl || result.imageData,
            dataUrl: result.imageData || result.imageUrl,
            promptUsed: result.promptUsed,
            categoryName: result.categoryName || invitationCategory.name,
            styleName: result.styleName || invitationStyle.name,
            aspectRatio: invitationAspectRatio,
            formatLabel: 'Image',
          });
        });

        completed += imageResults.length;
        setInvitationGenerationProgress({ current: completed, total });
        setInvitationResults([...newResults]);
      }

      if (invitationOutputFormats.includes('video')) {
        const response = await fetch('/api/invitation-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventDetails,
            categoryId: invitationCategory.id,
            styleId: invitationStyle.id,
            aspectRatio: invitationAspectRatio,
            sessionId,
          }),
        });

        const data: InvitationVideoResponse = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || 'Failed to generate invitation video');
        }

        newResults.push({
          id: data.id || `invitation-video-${Date.now()}`,
          type: 'video',
          url: data.videoUrl,
          dataUrl: data.videoUrl,
          promptUsed: data.promptUsed,
          categoryName: data.categoryName || invitationCategory.name,
          styleName: data.styleName || invitationStyle.name,
          aspectRatio: invitationAspectRatio,
          formatLabel: 'Video',
        });

        completed += 1;
        setInvitationGenerationProgress({ current: completed, total });
        setInvitationResults([...newResults]);
      }
    } catch (error) {
      console.error('Error generating invitations:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate invitations. Please try again.');
    } finally {
      setIsGeneratingInvitation(false);
      setTimeout(() => setInvitationGenerationProgress({ current: 0, total: 0 }), 1000);
    }
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
          <div className="absolute top-0 right-0 flex items-center gap-4">
            <ModelToggle
              model={selectedModel}
              onChange={setSelectedModel}
              disabled={isGenerating || isGeneratingProduct || isGeneratingInvitation}
              size="sm"
            />
            <ThemeToggle />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            🎨 Creative Studio
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform visual inspiration into creative content - generate images, videos, and series using AI-powered color analysis
          </p>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <ModeToggle
            mode={appMode}
            onChange={handleModeChange}
            disabled={isGenerating || isGeneratingProduct || isGeneratingInvitation}
          />
        </motion.div>

        {/* Color Story Timeline - Color Palette Mode Only */}
        {appMode === 'color' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <ColorStoryTimeline currentStep={getTimelineStep()} compact={true} />
          </motion.div>
        )}

        {/* Animated Journey Showcase - shown when no palette yet in Color Mode */}
        {appMode === 'color' && !palette && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <AnimatedJourneyShowcase />
          </motion.div>
        )}

        {/* COLOR PALETTE MODE */}
        {appMode === 'color' && (
          <>
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
        )}

        {/* INVITATION MODE */}
        {appMode === 'invitation' && (
          <>
            {!eventDetails.title && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mb-10"
              >
                <InvitationJourneyShowcase />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-rose-500" />
                    1. Event Details
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Share the essentials so the AI can personalize your invitation copy and layout.
                  </p>
                </CardHeader>
                <CardContent>
                  <EventDetailsForm
                    value={eventDetails}
                    onChange={setEventDetails}
                    disabled={isGeneratingInvitation}
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-indigo-500" />
                    2. Choose Event Category
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Pick the event type to unlock curated style palettes and prompts.
                  </p>
                </CardHeader>
                <CardContent>
                  <InvitationCategorySelector
                    categories={INVITATION_CATEGORIES}
                    selectedCategoryId={selectedInvitationCategory}
                    onSelectCategory={handleInvitationCategorySelect}
                    disabled={isGeneratingInvitation}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {invitationCategory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>3. Select Style & Mood</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Choose a visual direction to guide the AI prompt.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <InvitationStylePanel
                      styles={invitationCategory.styles}
                      selectedStyleId={selectedInvitationStyle}
                      onSelectStyle={handleInvitationStyleSelect}
                      disabled={isGeneratingInvitation}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {invitationStyle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mb-8"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>4. Template & Color Direction</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Layer templates, palettes, and variation cues for more diverse outputs.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <InvitationTemplateGallery
                      templates={getTemplatesForCategory(invitationCategory?.id || '')}
                      selectedTemplateId={selectedInvitationTemplate}
                      onSelect={(id) =>
                        setSelectedInvitationTemplate(prev => (prev === id ? '' : id))
                      }
                    />
                    <InvitationColorSelector
                      basePalette={invitationStyle.colorScheme}
                      suggestions={invitationStyle.colorPresets}
                      value={appliedInvitationColors || []}
                      onChange={setInvitationColorPalette}
                    />
                    <InvitationVariationSelector
                      variations={INVITATION_VARIATIONS}
                      selected={invitationVariationModes}
                      onChange={setInvitationVariationModes}
                      max={6}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {invitationStyle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>5. Preview & Generate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 lg:grid-cols-2">
                      <InvitationPreview
                        details={eventDetails}
                        category={invitationCategory}
                        style={invitationStyle}
                        aspectRatio={invitationAspectRatio}
                        outputFormats={invitationOutputFormats}
                        variantCount={effectiveInvitationVariantCount}
                        colorPalette={appliedInvitationColors}
                        templateName={invitationTemplate?.title}
                      />

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-semibold">Output Formats</p>
                            <p className="text-xs text-muted-foreground">Choose what to generate</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {INVITATION_OUTPUT_OPTIONS.map((option) => {
                              const isSelected = invitationOutputFormats.includes(option.id);
                              return (
                                <button
                                  key={option.id}
                                  type="button"
                                  onClick={() => toggleInvitationFormat(option.id)}
                                  disabled={isGeneratingInvitation}
                                  className={`
                                    relative p-4 rounded-2xl border-2 transition-all text-left
                                    ${isSelected
                                      ? 'border-transparent text-white'
                                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                                    }
                                    ${isGeneratingInvitation ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
                                  `}
                                >
                                  {isSelected && (
                                    <motion.div
                                      layoutId={`invitation-format-${option.id}`}
                                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${option.accent}`}
                                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                  )}
                                  <div className="relative z-10">
                                    <p className="font-semibold">{option.label}</p>
                                    <p className="text-xs opacity-80">{option.description}</p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-semibold">Aspect Ratio</p>
                          <div className="flex flex-wrap gap-2">
                            {INVITATION_ASPECT_OPTIONS.map((ratio) => {
                              const isActive = invitationAspectRatio === ratio;
                              return (
                                <button
                                  key={ratio}
                                  type="button"
                                  disabled={isGeneratingInvitation}
                                  onClick={() => setInvitationAspectRatio(ratio)}
                                  className={`
                                    px-3 py-1.5 rounded-full text-sm border transition-colors
                                    ${isActive
                                      ? 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:text-emerald-200 dark:bg-emerald-950/40'
                                      : 'border-slate-200 dark:border-slate-700'
                                    }
                                    ${isGeneratingInvitation ? 'opacity-50 cursor-not-allowed' : ''}
                                  `}
                                >
                                  {ratio}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {invitationOutputFormats.includes('image') && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold">Image Variations</p>
                                {invitationVariationModes.length > 0 && (
                                  <p className="text-xs text-muted-foreground">
                                    Variation styles selected: using {effectiveInvitationVariantCount} unique prompts.
                                  </p>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {effectiveInvitationVariantCount} variations
                              </span>
                            </div>
                            <Slider
                              value={[invitationVariantCount]}
                              onValueChange={(value) => setInvitationVariantCount(value[0] ?? invitationVariantCount)}
                              min={1}
                              max={5}
                              step={1}
                              disabled={isGeneratingInvitation}
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <Button
                            onClick={generateInvitations}
                            disabled={!canGenerateInvitations || isGeneratingInvitation}
                            className="w-full bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 hover:from-rose-600 hover:to-indigo-600"
                            size="lg"
                          >
                            {isGeneratingInvitation ? (
                              <>
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                Crafting invitations...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-5 w-5 mr-2" />
                                Generate Invitation Suite
                              </>
                            )}
                          </Button>

                          {(!eventDetails.title || !eventDetails.date) && (
                            <p className="text-xs text-muted-foreground text-center">
                              Add an event title and date to enable generation.
                            </p>
                          )}
                        </div>

                        {isGeneratingInvitation && invitationGenerationProgress.total > 0 && (
                          <div className="space-y-2">
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                              <motion.div
                                className="bg-gradient-to-r from-rose-500 to-indigo-500 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(invitationGenerationProgress.current / invitationGenerationProgress.total) * 100}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                            <p className="text-sm text-muted-foreground text-center">
                              Processing {invitationGenerationProgress.current} of {invitationGenerationProgress.total}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {invitationResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mb-8"
              >
                <Card>
                  <CardContent className="pt-6">
                    <InvitationResultsGrid results={invitationResults} />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </>
        )}

        {/* PRODUCT PATH MODE */}
        {appMode === 'product' && (
          <>
            {!productImage && selectedScenes.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mb-10"
              >
                <ProductJourneyShowcase />
              </motion.div>
            )}

            {/* Product Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8 max-w-2xl mx-auto"
            >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wand2 className="h-5 w-5 text-purple-600" />
                      1. Upload Product Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProductUpload
                      onProductSelect={handleProductSelect}
                      currentImage={productImage}
                      extractedImage={extractedProduct}
                      isExtracting={isExtractingProduct}
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

            {/* Scene Selection - Multi-select */}
            {extractedProduct && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>2. Select Scenes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnvironmentCategorySelector
                      multiSelect={true}
                      selectedCategories={selectedScenes.map(s => s.categoryId)}
                      onCategoriesChange={handleScenesChange}
                      maxSelections={5}
                      disabled={isGeneratingProduct}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Generation Configuration */}
            {selectedScenes.length > 0 && (
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
                  <CardContent>
                    <ProductGenerationConfig
                      selectedScenes={selectedScenes}
                      onScenesChange={setSelectedScenes}
                      selectedFormats={productOutputFormats}
                      onFormatsChange={setProductOutputFormats}
                      disabled={isGeneratingProduct}
                    />

                    <div className="mt-6">
                      <ProductColorPaletteSelector
                        value={productColorPalette}
                        onChange={setProductColorPalette}
                        disabled={isGeneratingProduct}
                      />
                    </div>

                    {/* Aspect Ratio Selector */}
                    <div className="mt-6">
                      <AspectRatioSelector
                        label="Image Aspect Ratio"
                        value={aspectRatio.imageAspectRatio}
                        onChange={aspectRatio.setImageAspectRatio}
                        disabled={isGeneratingProduct}
                      />
                    </div>

                    {/* Generate Button */}
                    <div className="mt-6">
                      <Button
                        onClick={generateMultipleProductPlacements}
                        disabled={isGeneratingProduct || selectedScenes.length === 0 || productOutputFormats.length === 0}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        size="lg"
                      >
                        {isGeneratingProduct ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Generating {productGenerationProgress.current}/{productGenerationProgress.total}...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-5 w-5 mr-2" />
                            Generate {selectedScenes.reduce((sum, s) => sum + s.imageCount, 0)} Product Placements
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Progress Bar */}
                    {isGeneratingProduct && productGenerationProgress.total > 0 && (
                      <div className="mt-4">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(productGenerationProgress.current / productGenerationProgress.total) * 100}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 text-center">
                          Processing image {productGenerationProgress.current} of {productGenerationProgress.total}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Product Results Grid */}
            {productResultItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8"
              >
                <Card>
                  <CardContent className="pt-6">
                    <ProductResultsGrid
                      results={productResultItems}
                      isRegenerating={isGeneratingProduct}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </>
        )}

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

      <AssetLibrarySheet
        sessionId={sessionId}
        open={isAssetLibraryOpen}
        onOpenChange={setIsAssetLibraryOpen}
        onSelect={handleAssetSelect}
        filterKind="image"
      />
    </div>
  );
}
