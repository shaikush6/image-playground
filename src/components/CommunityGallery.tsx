'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  TrendingUp,
  Clock,
  Heart,
  Eye,
  Shuffle,
  Search,
  Filter,
  Grid3x3,
  List,
  Palette as PaletteIcon
} from 'lucide-react';

interface CommunityItem {
  id: string;
  title: string;
  author: string;
  palette: string[];
  creativePath: string;
  imageUrl: string;
  likes: number;
  views: number;
  createdAt: Date;
  isLiked?: boolean;
}

interface CommunityGalleryProps {
  onRemix?: (item: CommunityItem) => void;
  onItemClick?: (item: CommunityItem) => void;
}

export function CommunityGallery({ onRemix, onItemClick }: CommunityGalleryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'trending' | 'recent' | 'popular'>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPath, setFilterPath] = useState<string | null>(null);

  // Mock data - would come from DB in production
  const mockItems: CommunityItem[] = [
    {
      id: '1',
      title: 'Sunset Pasta Delight',
      author: 'ChefMaria',
      palette: ['#FF6B6B', '#FFA07A', '#FFD93D', '#6BCB77'],
      creativePath: '🍽️ Cooking',
      imageUrl: '/api/placeholder/400/300',
      likes: 234,
      views: 1203,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isLiked: false,
    },
    {
      id: '2',
      title: 'Modern Minimalist Living',
      author: 'DesignPro',
      palette: ['#2C3E50', '#ECF0F1', '#95A5A6', '#BDC3C7'],
      creativePath: '🛋️ Interior Design',
      imageUrl: '/api/placeholder/400/300',
      likes: 456,
      views: 2341,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isLiked: true,
    },
    {
      id: '3',
      title: 'Vibrant Fashion Forward',
      author: 'StyleIcon',
      palette: ['#E74C3C', '#9B59B6', '#3498DB', '#F39C12'],
      creativePath: '👗 Fashion',
      imageUrl: '/api/placeholder/400/300',
      likes: 678,
      views: 3456,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isLiked: false,
    },
  ];

  const [items, setItems] = useState<CommunityItem[]>(mockItems);

  const filteredItems = items.filter(item => {
    if (filterPath && item.creativePath !== filterPath) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return (b.likes + b.views * 0.1) - (a.likes + a.views * 0.1);
      case 'recent':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'popular':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  const toggleLike = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, isLiked: !item.isLiked, likes: item.likes + (item.isLiked ? -1 : 1) }
          : item
      )
    );
  };

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community Gallery</h2>
          <p className="text-sm text-muted-foreground">
            {filteredItems.length} creative projects from the community
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search creations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={sortBy === 'trending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('trending')}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </Button>
          <Button
            variant={sortBy === 'recent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('recent')}
          >
            <Clock className="h-4 w-4 mr-2" />
            Recent
          </Button>
          <Button
            variant={sortBy === 'popular' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('popular')}
          >
            <Heart className="h-4 w-4 mr-2" />
            Popular
          </Button>
        </div>
      </div>

      {/* Grid/List View */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {sortedItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
              <div onClick={() => onItemClick?.(item)}>
                {/* Image */}
                <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PaletteIcon className="h-16 w-16 text-slate-300" />
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemix?.(item);
                      }}
                      className="bg-white hover:bg-white/90"
                    >
                      <Shuffle className="h-5 w-5 mr-2" />
                      Remix This
                    </Button>
                  </div>

                  {/* Trending Badge */}
                  {sortBy === 'trending' && index < 3 && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        #{index + 1} Trending
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  {/* Title & Author */}
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">by {item.author}</p>
                  </div>

                  {/* Palette */}
                  <div className="flex gap-1 mb-3">
                    {item.palette.map((color, i) => (
                      <div
                        key={i}
                        className="flex-1 h-8 rounded shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(item.id);
                        }}
                        className="flex items-center gap-1 text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Heart
                          className={`h-4 w-4 ${item.isLiked ? 'fill-red-500 text-red-500' : ''}`}
                        />
                        {item.likes}
                      </button>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        {item.views}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {item.creativePath}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(item.createdAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {sortedItems.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No creations found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}
