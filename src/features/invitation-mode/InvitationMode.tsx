import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, BookOpen } from 'lucide-react';
import { EventDetailsForm } from '@/components/InvitationPath/EventDetailsForm';
import { InvitationCategorySelector } from '@/components/InvitationPath/InvitationCategorySelector';
import { InvitationStylePanel } from '@/components/InvitationPath/InvitationStylePanel';
import { InvitationTemplateGallery } from '@/components/InvitationPath/InvitationTemplateGallery';
import { InvitationColorSelector } from '@/components/InvitationPath/InvitationColorSelector';
import { InvitationVariationSelector } from '@/components/InvitationPath/InvitationVariationSelector';
import { InvitationPreview } from '@/components/InvitationPath/InvitationPreview';
import { InvitationResultsGrid } from '@/components/InvitationPath/InvitationResultsGrid';
import { InvitationJourneyShowcase } from '@/components/InvitationJourneyShowcase';
import { INVITATION_CATEGORIES } from '@/config/invitations';
import { INVITATION_VARIATIONS } from '@/config/invitationVariations';
import { getTemplatesForCategory } from '@/config/invitationTemplates';
import { InvitationModeState } from './useInvitationMode';
import { GeminiModelType } from '@/lib/geminiV2';

interface InvitationModeProps extends InvitationModeState {
    sessionId: string | null;
    selectedModel: GeminiModelType;
}

export function InvitationMode({
    sessionId,
    selectedModel,
    // Hook state props
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
}: InvitationModeProps) {

    // Derive template name for preview
    const templateName = selectedInvitationTemplate
        ? getTemplatesForCategory(invitationCategory?.id || '').find(t => t.id === selectedInvitationTemplate)?.name
        : undefined;

    return (
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
                                    templateName={templateName}
                                // variationModes not used in preview?
                                />

                                <div className="space-y-6">
                                    {/* Configuration controls would go here if needed */}
                                    <Button
                                        onClick={generateInvitations}
                                        disabled={isGeneratingInvitation}
                                        className="w-full h-14 text-lg bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 transition-all duration-200"
                                        size="lg"
                                    >
                                        {isGeneratingInvitation ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="h-5 w-5 border-2 border-current border-t-transparent rounded-full mr-3"
                                                />
                                                Crafting {invitationGenerationProgress.total > 0 ? `(${invitationGenerationProgress.current}/${invitationGenerationProgress.total})` : '...'}
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="h-5 w-5 mr-3" />
                                                Generate Invitations
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {(invitationResults.length > 0 || isGeneratingInvitation) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <InvitationResultsGrid
                        results={invitationResults}
                    />
                </motion.div>
            )}
        </>
    );
}
