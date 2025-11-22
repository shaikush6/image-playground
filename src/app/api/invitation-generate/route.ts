import { NextRequest, NextResponse } from 'next/server';
import {
  EventDetails,
  getInvitationCategoryById,
  getInvitationStyleById,
  formatEventDetails,
} from '@/config/invitations';
import { getTemplateById } from '@/config/invitationTemplates';
import { getVariationById } from '@/config/invitationVariations';
import { generateImage } from '@/lib/geminiV2';
import { recordGeneratedAsset } from '@/lib/persistence';
import type { GeminiModelType } from '@/lib/geminiV2';

interface InvitationGenerationPayload {
  eventDetails: EventDetails;
  categoryId: string;
  styleId: string;
  aspectRatio?: string;
  variantCount?: number;
  model?: GeminiModelType;
  sessionId?: string;
  templateId?: string;
  colorPalette?: string[];
  variationModes?: string[];
}

const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAADUlEQVR42mN88OQnBwADLwH+zbVb6QAAAABJRU5ErkJggg==';

export async function POST(request: NextRequest) {
  try {
    const {
      eventDetails,
      categoryId,
      styleId,
      aspectRatio = '4:5',
      variantCount = 3,
      model = 'pro',
      sessionId,
      templateId,
      colorPalette,
      variationModes,
    }: InvitationGenerationPayload = await request.json();

    if (!eventDetails?.title) {
      return NextResponse.json({ error: 'Event title is required' }, { status: 400 });
    }

    if (!categoryId || !styleId) {
      return NextResponse.json({ error: 'Category and style are required' }, { status: 400 });
    }

    const category = getInvitationCategoryById(categoryId);
    const style = getInvitationStyleById(categoryId, styleId);

    if (!category || !style) {
      return NextResponse.json({ error: 'Invalid category or style' }, { status: 400 });
    }

    const template = templateId ? getTemplateById(templateId) : undefined;

    const safeVariantCount = Math.min(Math.max(variantCount, 1), 5);
    const results = [];
    const variationSequence = variationModes && variationModes.length ? variationModes : null;

    for (let index = 0; index < safeVariantCount; index++) {
      const variationDirectiveId = variationSequence ? variationSequence[index % variationSequence.length] : undefined;
      const variationDirective = variationDirectiveId ? getVariationById(variationDirectiveId) : undefined;

      const prompt = buildInvitationPrompt({
        eventDetails,
        categoryName: category.name,
        categoryDescription: category.description,
        styleName: style.name,
        styleDescription: style.description,
        styleTemplate: style.promptTemplate,
        aspectRatio,
        colorPalette: style.colorScheme,
        variationIndex: index,
        customPalette: colorPalette,
        templateCues: template?.promptCues,
        templateName: template?.title,
        variationDirective,
      });

      let imageData = PLACEHOLDER_IMAGE;
      let promptUsed = prompt;

      if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        const imageResult = await generateImage(prompt, { model });
        if (imageResult.success && imageResult.imageData) {
          imageData = imageResult.imageData;
        } else {
          console.warn('Invitation generation fallback triggered:', imageResult.error);
        }
        promptUsed = imageResult.textResponse ? `${prompt}\n\nAssistant notes: ${imageResult.textResponse}` : prompt;
      } else {
        console.warn('GOOGLE_GENERATIVE_AI_API_KEY missing - using placeholder invitation output.');
      }

      const assetRecord = {
        id: `invitation-${category.id}-${style.id}-${Date.now()}-${index}`,
        imageData,
        promptUsed,
        modelUsed: model,
        categoryName: category.name,
        styleName: style.name,
      };

      results.push(assetRecord);

      try {
        await recordGeneratedAsset({
          sessionKey: sessionId,
          appMode: 'invitation',
          kind: 'image',
          source: 'invitation-generate',
          url: null,
          dataUrl: imageData,
          prompt: promptUsed,
          metadata: {
            categoryId: category.id,
            styleId: style.id,
            aspectRatio,
            variantIndex: index,
            model,
            templateId,
            variationDirectiveId,
          },
        });
      } catch (persistError) {
        console.error('Failed to persist invitation asset', persistError);
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Invitation generation error:', error);
    return NextResponse.json({ error: 'Failed to generate invitations' }, { status: 500 });
  }
}

interface PromptBuilderOptions {
  eventDetails: EventDetails;
  categoryName: string;
  categoryDescription: string;
  styleName: string;
  styleDescription: string;
  styleTemplate: string;
  aspectRatio: string;
  colorPalette?: string[];
  variationIndex: number;
  customPalette?: string[];
  templateCues?: string[];
  templateName?: string;
  variationDirective?: ReturnType<typeof getVariationById>;
}

function buildInvitationPrompt(options: PromptBuilderOptions): string {
  const {
    eventDetails,
    categoryName,
    categoryDescription,
    styleName,
    styleDescription,
    styleTemplate,
    aspectRatio,
    colorPalette,
    variationIndex,
    customPalette,
    templateCues,
    templateName,
    variationDirective,
  } = options;

  const detailLines = [
    eventDetails.title,
    eventDetails.subtitle,
    eventDetails.date && eventDetails.time ? `${eventDetails.date} • ${eventDetails.time}` : eventDetails.date,
    eventDetails.location,
    eventDetails.hostName ? `Hosted by ${eventDetails.hostName}` : undefined,
    eventDetails.rsvpInfo ? `RSVP: ${eventDetails.rsvpInfo}` : undefined,
  ].filter(Boolean);

  const context = {
    eventTitle: eventDetails.title || `${categoryName} Celebration`,
    eventSubtitle: eventDetails.subtitle || '',
    eventDescription: eventDetails.description || categoryDescription,
    categoryName,
    styleName,
    toneDescription: styleDescription,
    detailsBlock: formatEventDetails(eventDetails),
    colorPalette: customPalette?.length
      ? customPalette.join(', ')
      : colorPalette?.join(', ') || 'designer-selected palette',
  };

  const stylePrompt = applyTemplate(styleTemplate, context);
  const paletteLine = customPalette?.length
    ? `Use this palette: ${customPalette.join(', ')}.`
    : '';
  const templateLine = templateCues?.length
    ? `Template inspiration "${templateName ?? 'reference'}": ${templateCues.join('; ')}.`
    : '';
  const variationLine = variationDirective?.promptCue
    ? `Variation focus: ${variationDirective.promptCue}.`
    : '';

  return `Design a ${styleName} ${categoryName.toLowerCase()} invitation in aspect ratio ${aspectRatio}.
${stylePrompt}
${paletteLine}
${templateLine}
${variationLine}
Typography must clearly communicate:
${detailLines.length ? detailLines.map(line => `- ${line}`).join('\n') : '- Event details TBD'}
Layout should feel ${styleDescription.toLowerCase()}. Include painterly imperfections for variation ${variationIndex + 1}.
Avoid spelling errors. Export as high-resolution, print-ready artwork.`;
}

function applyTemplate(template: string, context: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => context[key] ?? '');
}
