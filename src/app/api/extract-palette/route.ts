import { NextRequest, NextResponse } from 'next/server';
import { AnthropicService } from '@/lib/anthropic';

export async function POST(request: NextRequest) {
  try {
    console.log('🎨 Starting palette extraction...');
    
    const { imageBase64, swatches = 5 } = await request.json();

    if (!imageBase64) {
      console.error('No image data provided');
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    console.log(`📊 Extracting ${swatches} colors from image (${imageBase64.length} chars)`);

    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    
    console.log(`🔧 Cleaned base64 data: ${base64Data.length} chars`);

    const palette = await AnthropicService.extractPalette(base64Data, swatches);

    if (!palette) {
      console.error('❌ Anthropic service returned null palette');
      return NextResponse.json(
        { error: 'Failed to extract color palette from image' },
        { status: 500 }
      );
    }

    console.log('✅ Successfully extracted palette:', palette);
    return NextResponse.json(palette);
  } catch (error) {
    console.error('💥 Error in extract-palette API:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}