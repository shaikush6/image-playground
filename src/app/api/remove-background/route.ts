import { NextRequest, NextResponse } from 'next/server';
import { removeBackground } from '@/lib/backgroundRemoval';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData, format, size } = body;

    if (!imageData) {
      return NextResponse.json(
        { error: 'No image data provided' },
        { status: 400 }
      );
    }

    // Remove background
    const result = await removeBackground(imageData, { format, size });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Background removal failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      imageData: result.imageData,
    });
  } catch (error) {
    console.error('Background removal API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
