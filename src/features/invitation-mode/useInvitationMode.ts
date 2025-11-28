import { useState, useEffect } from 'react';
import {
    EventDetails as InvitationDetails,
    InvitationAspectRatio,
    getInvitationCategoryById as getInvitationCategory,
    getInvitationStyleById as getInvitationStyle,
    INVITATION_ASPECT_OPTIONS,
} from '@/config/invitations';
import { getTemplateById } from '@/config/invitationTemplates';
import { InvitationResultItem } from '@/components/InvitationPath/InvitationResultsGrid';
import { GeminiModelType } from '@/lib/geminiV2';
import { INITIAL_EVENT_DETAILS, InvitationOutputFormat } from '@/hooks/useAppSession';

export type InvitationGenerationResponse = {
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

export type InvitationVideoResponse = {
    error?: string;
    id?: string;
    videoUrl?: string;
    promptUsed?: string;
    categoryName?: string;
    styleName?: string;
};

export function useInvitationMode(selectedModel: GeminiModelType, sessionId: string | null) {
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

    // Derived state
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

    // Effects
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

    // Handlers
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

    const resetInvitationExperience = () => {
        setInvitationResults([]);
        setInvitationGenerationProgress({ current: 0, total: 0 });
    };

    return {
        eventDetails, setEventDetails,
        selectedInvitationCategory, setSelectedInvitationCategory,
        selectedInvitationStyle, setSelectedInvitationStyle,
        invitationAspectRatio, setInvitationAspectRatio,
        invitationOutputFormats, setInvitationOutputFormats,
        invitationVariantCount, setInvitationVariantCount,
        invitationResults, setInvitationResults,
        isGeneratingInvitation,
        invitationGenerationProgress,
        selectedInvitationTemplate, setSelectedInvitationTemplate,
        invitationColorPalette, setInvitationColorPalette,
        invitationVariationModes, setInvitationVariationModes,
        invitationCategory,
        invitationStyle,
        effectiveInvitationVariantCount,
        appliedInvitationColors,
        handleInvitationCategorySelect,
        handleInvitationStyleSelect,
        toggleInvitationFormat,
        generateInvitations,
        resetInvitationExperience
    };
}

export type InvitationModeState = ReturnType<typeof useInvitationMode>;
