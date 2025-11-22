import { NextRequest, NextResponse } from 'next/server';
import { VeoVideoService } from '@/lib/veo';
import { getCategoryById, getVariationById } from '@/config/environments';
import { recordGeneratedAsset } from '@/lib/persistence';

export async function POST(request: NextRequest) {
  try {
    const {
      categoryId,
      variationId,
      customPrompt,
      aspectRatio = '9:16',
      productDescription,
      sessionId,
      colorPalette,
    } = await request.json();

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Get category and variation details
    const category = getCategoryById(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const variation = variationId ? getVariationById(categoryId, variationId) : null;

    // Build video prompt for product placement
    const videoPrompt = buildProductVideoPrompt({
      categoryName: category.name,
      categoryDescription: category.description,
      variationName: variation?.name,
      variationPrompt: variation?.promptTemplate,
      customPrompt,
      productDescription,
      colorPalette,
    });

    console.log('Generating product video with prompt:', videoPrompt.substring(0, 200) + '...');

    // Generate video using VeoVideoService
    const videoUrl = await VeoVideoService.generateVideo(videoPrompt, {
      aspectRatio: aspectRatio as '9:16' | '16:9' | '1:1',
      resolution: '720p',
      duration: 'short',
      style: 'professional',
    });

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Failed to generate video' },
        { status: 500 }
      );
    }

    try {
      await recordGeneratedAsset({
        sessionKey: sessionId,
        appMode: 'product',
        kind: 'video',
        source: 'product-video',
        url: videoUrl,
        dataUrl: videoUrl,
        prompt: videoPrompt,
        metadata: {
          categoryId,
          variationId,
          aspectRatio,
          colorPalette,
        },
      });
    } catch (persistError) {
      console.error('Failed to persist product video asset', persistError);
    }

    return NextResponse.json({
      success: true,
      videoUrl,
      promptUsed: videoPrompt,
      categoryName: category.name,
      variationName: variation?.name,
    });
  } catch (error) {
    console.error('Product video generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error during video generation' },
      { status: 500 }
    );
  }
}

interface ProductVideoPromptOptions {
  categoryName: string;
  categoryDescription: string;
  variationName?: string;
  variationPrompt?: string;
  customPrompt?: string;
  productDescription?: string;
  colorPalette?: string[];
}

function buildProductVideoPrompt(options: ProductVideoPromptOptions): string {
  const {
    categoryName,
    categoryDescription,
    variationName,
    variationPrompt,
    customPrompt,
    productDescription,
    colorPalette,
  } = options;

  const paletteLine = colorPalette?.length
    ? `Color direction: ${colorPalette.join(', ')} applied to lighting, wardrobe, and set dressing.`
    : '';

  // Use custom prompt if provided
  if (customPrompt) {
    return `Professional product showcase video. ${customPrompt}.
${paletteLine}
The video should feature smooth camera movements, professional lighting, and highlight the product naturally within the scene.
Style: cinematic, high-end commercial quality, 4K resolution aesthetic.`;
  }

  // Build prompt from category and variation
  const productContext = productDescription
    ? `featuring a ${productDescription}`
    : 'featuring the product';

  const sceneDescription = variationPrompt || categoryDescription;
  const sceneName = variationName || categoryName;

  return `Professional product showcase video ${productContext} in a ${sceneName} setting.
Scene: ${sceneDescription}
${paletteLine}
The video should feature:
- Smooth, cinematic camera movements (slow dolly, gentle pan, or subtle zoom)
- Professional lighting that highlights the product
- Natural integration of the product within the environment
- High-end commercial quality aesthetic
- Clean, modern visual style
Duration: 5-8 seconds, loopable if possible.
Style: cinematic, professional commercial, 4K resolution aesthetic.`;
}
