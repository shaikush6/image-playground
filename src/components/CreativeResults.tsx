'use client';

import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Camera,
  Video,
  Layers,
  Download,
  Share2,
  Heart,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Volume2,
  VolumeX,
  Images,
  Sparkles
} from 'lucide-react';
import { useState, useRef } from 'react';
import { OutputFormat } from './OutputFormatSelector';
import { CreativeResult } from '@/lib/agents';
import { MasonryResultsGrid } from './MasonryResultsGrid';
import type { AspectRatioId } from '@/config/aspectRatios';
import { ImageSeriesConfigPanel } from '@/features/image-series/ImageSeriesConfig';
import type { ImageSeriesConfig } from '@/features/image-series/useImageSeries';

interface CreativeResultsProps {
  result: CreativeResult | null;
  isGenerating: boolean;
  selectedFormats: OutputFormat[];
  imageAspectRatio?: AspectRatioId;
  videoAspectRatio?: AspectRatioId;
  domain?: string;
  onRegenerate?: () => void;
  onCreateSeries?: (config: ImageSeriesConfig) => Promise<void>;
}

// Helper function to get aspect ratio CSS class
function getAspectRatioClass(aspectRatio: AspectRatioId = '1:1'): string {
  switch (aspectRatio) {
    case '9:16':
      return 'aspect-[9/16]';
    case '16:9':
      return 'aspect-[16/9]';
    case '1:1':
      return 'aspect-square';
    default:
      return 'aspect-square';
  }
}

interface VideoPlayerProps {
  src: string;
  title: string;
  className?: string;
}

function VideoPlayer({ src, title, className = '' }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const togglePlay = async () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
        setIsPlaying(true);
      }
      setPlaybackError(null);
    } catch (error) {
      console.error('Video playback failed:', error);
      setIsPlaying(false);
      setPlaybackError('Video playback is not supported in this browser. Please download the file instead.');
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    try {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    } catch (error) {
      console.error('Fullscreen request failed:', error);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setPlaybackError(null);
      setIsLoading(false);
    }
  };

  const handleVideoError = () => {
    setPlaybackError('Unable to load the generated video. Try downloading it to view locally.');
    setIsPlaying(false);
    setIsLoading(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative group bg-black rounded-lg overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
        controls={Boolean(playbackError)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleVideoError}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {isLoading && !playbackError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-white/30 border-t-white"></div>
            <p className="text-white text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {playbackError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 text-white text-center px-6">
          <p className="text-sm">{playbackError}</p>
          <a
            href={src}
            download
            className="inline-flex items-center gap-2 rounded-md border border-white/40 px-3 py-1 text-sm font-medium hover:bg-white/10"
          >
            <Download className="h-4 w-4" />
            Download video
          </a>
        </div>
      )}
      
      {/* Video Controls Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-200 ${playbackError ? 'pointer-events-none' : 'group-hover:opacity-100'}`}>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-1 mb-3">
            <div 
              className="bg-white rounded-full h-1 transition-all duration-100"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}% `}}
            />
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                disabled={Boolean(playbackError)}
                className="text-white hover:bg-white/20 p-2 disabled:opacity-50"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRestart}
                className="text-white hover:bg-white/20 p-2"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:bg-white/20 p-2"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              
              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20 p-2"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Title Overlay */}
      <div className="absolute top-4 left-4 right-4">
        <Badge variant="secondary" className="bg-black/50 text-white border-0">
          {title}
        </Badge>
      </div>
    </div>
  );
}

export function CreativeResults({
  result,
  isGenerating,
  selectedFormats,
  imageAspectRatio = '1:1',
  videoAspectRatio = '9:16',
  domain,
  onRegenerate,
  onCreateSeries
}: CreativeResultsProps) {
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [showRemixModal, setShowRemixModal] = useState(false);
  const [isCreatingSeries, setIsCreatingSeries] = useState(false);
  const [seriesConfig, setSeriesConfig] = useState<ImageSeriesConfig>({
    count: 5,
    themeId: 'auto',
    aspectRatio: imageAspectRatio
  });

  const toggleLike = (itemId: string) => {
    const newLiked = new Set(likedItems);
    if (newLiked.has(itemId)) {
      newLiked.delete(itemId);
    } else {
      newLiked.add(itemId);
    }
    setLikedItems(newLiked);
  };

  const downloadContent = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const shareContent = async (url: string, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        // You could show a toast notification here
      } catch (error) {
        console.error('Copy to clipboard failed:', error);
      }
    }
  };

  const handleCreateSeries = async () => {
    if (!onCreateSeries) return;

    setIsCreatingSeries(true);
    try {
      await onCreateSeries(seriesConfig);
      setShowRemixModal(false);
    } catch (error) {
      console.error('Failed to create series:', error);
    } finally {
      setIsCreatingSeries(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3 text-lg font-medium text-slate-700 dark:text-slate-300">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            Generating your creative content...
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Creating {selectedFormats.join(', ').replace(/,([^,]*)$/, ' and$1')} for you
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-12 text-slate-500">
        <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Select your preferences and generate creative content to see results here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Generated Content
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {result.formats_generated.length} format{result.formats_generated.length > 1 ? 's' : ''} created
          </p>
        </div>
        
        {onRegenerate && (
          <Button onClick={onRegenerate} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
        )}
      </div>

      {/* Errors */}
      {result.errors && result.errors.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-orange-800 dark:text-orange-200">
                  Some formats couldn't be generated
                </h4>
                <ul className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  {result.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Creative Ideas */}
      {result.ideas && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Creative Concept
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="mb-4" {...props} />,
                  h2: ({node, ...props}) => <h2 className="mb-4" {...props} />,
                  h3: ({node, ...props}) => <h3 className="mb-4" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4" {...props} />,
                }}
              >
                {result.ideas}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Static Image */}
        {result.image_url && (
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Camera className="h-5 w-5 text-blue-600" />
                Static Image
                <Badge variant="secondary">Image</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative group">
                <img
                  src={result.image_url}
                  alt="Generated creative image"
                  className={`w-full ${getAspectRatioClass(imageAspectRatio)} object-cover`}
                />
                
                {/* Action Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-4">
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => toggleLike('image')}
                      className={likedItems.has('image') ? 'bg-red-100 text-red-600' : ''}
                    >
                      <Heart className={`h-4 w-4 ${likedItems.has('image') ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => downloadContent(result.image_url!, 'creative-image.png')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => shareContent(result.image_url!, 'Creative Image')}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Create Series Button */}
                  {onCreateSeries && domain && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setShowRemixModal(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Create Series from This
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Single Video */}
        {result.video_url && (
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Video className="h-5 w-5 text-green-600" />
                Creative Video
                <Badge variant="secondary">Video</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative group">
                <VideoPlayer
                  src={result.video_url}
                  title="Creative Video"
                  className={`w-full ${getAspectRatioClass(videoAspectRatio)}`}
                />
                
                {/* Action Overlay */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => toggleLike('video')}
                      className={likedItems.has('video') ? 'bg-red-100 text-red-600' : ''}
                    >
                      <Heart className={`h-4 w-4 ${likedItems.has('video') ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => downloadContent(result.video_url!, 'creative-video.mp4')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => shareContent(result.video_url!, 'Creative Video')}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Video Series - Masonry Grid */}
      {result.series_urls && result.series_urls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-purple-600" />
              Video Series
              <Badge variant="secondary">Series</Badge>
              <Badge variant="outline">{result.series_urls.length} parts</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MasonryResultsGrid
              items={result.series_urls.map((url, index) => ({
                id: `series-${index}`,
                type: 'video' as const,
                url,
                title: `Part ${index + 1}`,
                description: `Series part ${index + 1} of ${result.series_urls!.length}`
              }))}
              onItemClick={(item) => {
                // Optional: could open in fullscreen or modal
                console.log('Clicked item:', item);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Image Series - Masonry Grid */}
      {result.image_series_urls && result.image_series_urls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Images className="h-5 w-5 text-pink-600" />
              Image Series
              <Badge variant="secondary">Professional Gallery</Badge>
              <Badge variant="outline">{result.image_series_urls.length} images</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MasonryResultsGrid
              items={result.image_series_urls.map((url, index) => ({
                id: `image-series-${index}`,
                type: 'image' as const,
                url,
                title: `Image ${index + 1}`,
                description: `Series image ${index + 1} of ${result.image_series_urls!.length}`
              }))}
              onItemClick={(item) => {
                // Optional: could open in lightbox or modal
                console.log('Clicked item:', item);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Format Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/50 dark:to-emerald-950/50 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-200">
              Content Package Complete
            </h4>
          </div>
          <p className="text-blue-700 dark:text-blue-300 mb-4">
            Your creative content is ready for use across multiple platforms. Each format is optimized for different social media channels and use cases.
          </p>
          <div className="flex flex-wrap gap-2">
            {result.formats_generated.map((format) => (
              <Badge key={format} variant="outline" className="border-blue-300 dark:border-blue-600">
                {format === 'image' && <Camera className="h-3 w-3 mr-1" />}
                {format === 'video' && <Video className="h-3 w-3 mr-1" />}
                {format === 'series' && <Layers className="h-3 w-3 mr-1" />}
                {format === 'image-series' && <Images className="h-3 w-3 mr-1" />}
                {format}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Remix Modal */}
      <Dialog open={showRemixModal} onOpenChange={setShowRemixModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Create Image Series
            </DialogTitle>
            <DialogDescription>
              Generate a professional image series based on your current image's style and colors.
              Perfect for social media campaigns, portfolios, and storytelling.
            </DialogDescription>
          </DialogHeader>

          {domain && (
            <div className="py-4">
              <ImageSeriesConfigPanel
                domain={domain}
                config={seriesConfig}
                onCountChange={(count) => setSeriesConfig(prev => ({ ...prev, count }))}
                onThemeChange={(themeId) => {
                  setSeriesConfig(prev => ({ ...prev, themeId }));
                }}
                onAspectRatioChange={(aspectRatio) => {
                  setSeriesConfig(prev => ({ ...prev, aspectRatio }));
                }}
                disabled={isCreatingSeries}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRemixModal(false)}
              disabled={isCreatingSeries}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSeries}
              disabled={isCreatingSeries}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isCreatingSeries ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
                  Creating Series...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create {seriesConfig.count} Images
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
