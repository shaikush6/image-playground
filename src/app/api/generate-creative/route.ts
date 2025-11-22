import { NextRequest, NextResponse } from 'next/server';
import { CreativeAgentsService } from '@/lib/agents';
import type { CreativeResult } from '@/lib/agents';
import { VeoVideoService } from '@/lib/veo';

export async function POST(request: NextRequest) {
  try {
    const {
      path,
      palette,
      customizations = {},
      imagePromptChoice,
      formats = ['image'],
      imageAspectRatio = '1:1',
      videoAspectRatio = '9:16',
      imageSeriesConfig = { themeId: 'auto', count: 5, aspectRatio: '1:1' }
    } = await request.json();

    if (!path || !palette || !imagePromptChoice || !formats.length) {
      return NextResponse.json(
        { error: 'Path, palette, image prompt choice, and formats are required' },
        { status: 400 }
      );
    }

    console.log(`🎨 Generating ${formats.join(', ')} for ${path}`);

    const result: CreativeResult = {
      ideas: '',
      formats_generated: [],
    };

    // Process each requested format
    for (const format of formats) {
      console.log(`📋 Processing format: ${format}`);
      
      try {
        switch (format) {
          case 'image':
            // Generate static image with aspect ratio
            const imageResult = await CreativeAgentsService.generateCreativeIdeas(
              path,
              palette,
              customizations,
              imagePromptChoice,
              imageAspectRatio
            );

            result.image_url = imageResult.image_url;
            if (!result.ideas) result.ideas = imageResult.ideas;
            result.formats_generated.push('image');
            break;

          case 'video':
            // Generate single video with aspect ratio
            const videoResult = await VeoVideoService.generateCreativeVideo(
              path,
              palette,
              customizations,
              'single',
              imagePromptChoice,
              videoAspectRatio
            );

            if (videoResult.video_url) {
              result.video_url = videoResult.video_url;
              if (!result.ideas) result.ideas = videoResult.ideas;
              result.formats_generated.push('video');
            } else {
              result.errors = result.errors || [];
              result.errors.push('Failed to generate video');
            }
            break;

          case 'series':
            // Generate video series with aspect ratio
            const seriesResult = await VeoVideoService.generateCreativeVideo(
              path,
              palette,
              customizations,
              'series',
              imagePromptChoice,
              videoAspectRatio
            );

            if (seriesResult.series_urls && seriesResult.series_urls.length > 0) {
              result.series_urls = seriesResult.series_urls;
              if (!result.ideas) result.ideas = seriesResult.ideas;
              result.formats_generated.push('series');
            } else {
              result.errors = result.errors || [];
              result.errors.push('Failed to generate video series');
            }
            break;

          case 'image-series':
            // Generate image series
            const imageSeriesResult = await CreativeAgentsService.generateImageSeries(
              path,
              palette,
              customizations,
              imageSeriesConfig.themeId,
              imageSeriesConfig.count,
              imageSeriesConfig.aspectRatio
            );

            if (imageSeriesResult.image_series_urls.length > 0) {
              result.image_series_urls = imageSeriesResult.image_series_urls;
              if (!result.ideas) result.ideas = imageSeriesResult.ideas;
              result.formats_generated.push('image-series');

              if (imageSeriesResult.errors.length > 0) {
                result.errors = result.errors || [];
                result.errors.push(...imageSeriesResult.errors);
              }
            } else {
              result.errors = result.errors || [];
              result.errors.push('Failed to generate image series');
            }
            break;

          case 'combined':
            // Generate all formats with aspect ratios
            console.log('🎬 Generating complete package...');

            // Generate image
            const combinedImageResult = await CreativeAgentsService.generateCreativeIdeas(
              path,
              palette,
              customizations,
              imagePromptChoice,
              imageAspectRatio
            );

            // Generate video
            const combinedVideoResult = await VeoVideoService.generateCreativeVideo(
              path,
              palette,
              customizations,
              'single',
              imagePromptChoice,
              videoAspectRatio
            );

            // Generate series
            const combinedSeriesResult = await VeoVideoService.generateCreativeVideo(
              path,
              palette,
              customizations,
              'series',
              imagePromptChoice,
              videoAspectRatio
            );

            result.image_url = combinedImageResult.image_url;
            result.video_url = combinedVideoResult.video_url;
            result.series_urls = combinedSeriesResult.series_urls;
            result.ideas = combinedImageResult.ideas;
            result.formats_generated.push('image', 'video', 'series');
            break;

          default:
            console.warn(`Unknown format: ${format}`);
        }
      } catch (formatError) {
        console.error(`Error generating ${format}:`, formatError);
        // Continue with other formats even if one fails
        result.errors = result.errors || [];
        result.errors.push(`Failed to generate ${format}: ${formatError instanceof Error ? formatError.message : 'Unknown error'}`);
      }
    }

    // Ensure we have some content
    if (!result.ideas && result.formats_generated.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate any content' },
        { status: 500 }
      );
    }

    console.log(`✅ Successfully generated: ${result.formats_generated.join(', ')}`);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in generate-creative API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
