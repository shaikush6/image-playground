import { NextRequest, NextResponse } from 'next/server';
import { VeoVideoService } from '@/lib/veo';
import {
  EventDetails,
  getInvitationCategoryById,
  getInvitationStyleById,
} from '@/config/invitations';
import { recordGeneratedAsset } from '@/lib/persistence';

interface InvitationVideoPayload {
  eventDetails: EventDetails;
  categoryId: string;
  styleId: string;
  aspectRatio?: string;
  sessionId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const {
      eventDetails,
      categoryId,
      styleId,
      aspectRatio = '9:16',
      sessionId,
    }: InvitationVideoPayload = await request.json();

    if (!eventDetails?.title) {
      return NextResponse.json({ error: 'Event title is required' }, { status: 400 });
    }

    const category = getInvitationCategoryById(categoryId);
    const style = getInvitationStyleById(categoryId, styleId);

    if (!category || !style) {
      return NextResponse.json({ error: 'Invalid category or style' }, { status: 400 });
    }

    const prompt = buildInvitationVideoPrompt({
      eventDetails,
      categoryName: category.name,
      styleName: style.name,
      styleDescription: style.description,
      aspectRatio,
    });

    const videoUrl = await VeoVideoService.generateVideo(prompt, {
      aspectRatio: normalizeVideoAspectRatio(aspectRatio),
      duration: 'short',
      style: 'artistic',
    });

    if (!videoUrl) {
      return NextResponse.json({ error: 'Video generation failed' }, { status: 500 });
    }

    try {
      await recordGeneratedAsset({
        sessionKey: sessionId,
        appMode: 'invitation',
        kind: 'video',
        source: 'invitation-video',
        url: videoUrl,
        dataUrl: videoUrl,
        prompt,
        metadata: {
          categoryId: category.id,
          styleId: style.id,
          aspectRatio,
        },
      });
    } catch (persistError) {
      console.error('Failed to persist invitation video asset', persistError);
    }

    return NextResponse.json({
      success: true,
      videoUrl,
      promptUsed: prompt,
      categoryName: category.name,
      styleName: style.name,
    });
  } catch (error) {
    console.error('Invitation video generation error:', error);
    return NextResponse.json({ error: 'Failed to generate invitation video' }, { status: 500 });
  }
}

interface VideoPromptOptions {
  eventDetails: EventDetails;
  categoryName: string;
  styleName: string;
  styleDescription: string;
  aspectRatio: string;
}

function buildInvitationVideoPrompt(options: VideoPromptOptions): string {
  const { eventDetails, categoryName, styleName, styleDescription, aspectRatio } = options;
  const detailLines = [
    eventDetails.title,
    eventDetails.subtitle,
    eventDetails.date && eventDetails.time ? `${eventDetails.date} • ${eventDetails.time}` : eventDetails.date,
    eventDetails.location,
    eventDetails.hostName ? `Hosted by ${eventDetails.hostName}` : undefined,
    eventDetails.rsvpInfo ? `RSVP ${eventDetails.rsvpInfo}` : undefined,
  ].filter(Boolean);

  return `Animated ${categoryName.toLowerCase()} invitation video for "${eventDetails.title}" in ${aspectRatio} aspect ratio.
Style: ${styleName} • ${styleDescription}.
Scene direction: start with establishing textures, reveal hero typography, animate supporting illustrations, add soft particle motion. Use camera pushes and parallax.
Copy to display:
${detailLines.map((line) => `- ${line}`).join('\n')}
Tone should feel premium and loop seamlessly. No audio, subtitles, or brand watermarks.`;
}

function normalizeVideoAspectRatio(aspectRatio: string): '9:16' | '16:9' | '1:1' {
  if (aspectRatio === '1:1') return '1:1';
  if (aspectRatio === '16:9' || aspectRatio === '3:2') return '16:9';
  return '9:16';
}
