import { NextRequest, NextResponse } from 'next/server';
import {
  generateProductPlacement,
  enhancePromptWithClaude,
  ProductPlacementOptions,
} from '@/lib/productPlacement';
import { recordGeneratedAsset } from '@/lib/persistence';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productImage,
      categoryId,
      variationId,
      customPrompt,
      aspectRatio,
      productDescription,
      enhanceWithClaude = false,
      model = 'pro', // 'flash' or 'pro'
      sessionId,
      colorPalette,
    } = body;

    // Validate required fields
    if (!productImage) {
      return NextResponse.json(
        { error: 'Product image is required' },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    if (!variationId && !customPrompt) {
      return NextResponse.json(
        { error: 'Either variation ID or custom prompt is required' },
        { status: 400 }
      );
    }

    // Build options
    const options: ProductPlacementOptions = {
      productImage,
      categoryId,
      variationId,
      customPrompt,
      aspectRatio,
      productDescription,
      model,
      colorPalette,
    };

    // Optionally enhance prompt with Claude
    let finalPrompt = customPrompt;
    if (enhanceWithClaude && customPrompt && productDescription) {
      finalPrompt = await enhancePromptWithClaude(customPrompt, productDescription);
      options.customPrompt = finalPrompt;
    }

    // Generate product placement
    const result = await generateProductPlacement(options);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Product placement generation failed' },
        { status: 500 }
      );
    }

    if (result.success) {
      try {
        await recordGeneratedAsset({
          sessionKey: sessionId,
          appMode: 'product',
          kind: 'image',
          source: 'product-placement',
          url: result.imageUrl,
          dataUrl: result.imageData,
          prompt: result.promptUsed,
          metadata: {
            categoryId,
            variationId,
            aspectRatio,
            productDescription,
            model,
            colorPalette,
          },
        });
      } catch (persistError) {
        console.error('Failed to persist product image asset', persistError);
      }
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      imageData: result.imageData,
      promptUsed: result.promptUsed,
    });
  } catch (error) {
    console.error('Product placement API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
