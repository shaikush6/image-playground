import { NextRequest, NextResponse } from 'next/server';
import { CreativeAgentsService } from '@/lib/agents';

export async function POST(request: NextRequest) {
  try {
    const { path, palette, customizations = {}, imagePromptChoice } = await request.json();

    if (!path || !palette || !imagePromptChoice) {
      return NextResponse.json(
        { error: 'Path, palette, and image prompt choice are required' },
        { status: 400 }
      );
    }

    const result = await CreativeAgentsService.generateCreativeIdeas(
      path,
      palette,
      customizations,
      imagePromptChoice
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in generate-ideas API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}