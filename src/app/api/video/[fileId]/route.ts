import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const { fileId } = await params;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GOOGLE_GENERATIVE_AI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    if (!fileId) {
      return NextResponse.json({ error: 'Missing file id' }, { status: 400 });
    }

    const downloadUrl = `https://generativelanguage.googleapis.com/v1beta/files/${fileId}:download?alt=media&key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(downloadUrl);

    if (!response.ok) {
      console.error('Video proxy failed:', await response.text());
      return NextResponse.json(
        { error: 'Failed to fetch video from Gemini' },
        { status: response.status }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const mimeType = response.headers.get('content-type') || 'video/mp4';
    const contentLength = arrayBuffer.byteLength;

    return new NextResponse(Buffer.from(arrayBuffer), {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': contentLength.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Video proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
