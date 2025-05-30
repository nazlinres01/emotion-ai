import { useState } from "react";
import { Share, Heart, Download, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface GifData {
  id: string;
  title: string;
  images: {
    fixed_height: {
      url: string;
      width: string;
      height: string;
    };
    original: {
      url: string;
    };
  };
  url: string;
}

interface GifGridProps {
  gifs: GifData[];
  selectedEmotion: string | null;
  isLoading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

export default function GifGrid({ gifs, selectedEmotion, isLoading, onLoadMore, hasMore }: GifGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addFavoriteMutation = useMutation({
    mutationFn: async (gif: GifData) => {
      return apiRequest('POST', '/api/favorites', {
        gifId: gif.id,
        gifUrl: gif.images.original.url,
        title: gif.title,
        userId: undefined
      });
    },
    onSuccess: (_, gif) => {
      setFavorites(prev => new Set([...prev, gif.id]));
      toast({
        title: "Favorilere eklendi!",
        description: "GIF favorilerinize başarıyla eklendi.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "GIF favorilere eklenemedi. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    }
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (gifId: string) => {
      return apiRequest('DELETE', `/api/favorites/${gifId}`);
    },
    onSuccess: (_, gifId) => {
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        newFavorites.delete(gifId);
        return newFavorites;
      });
      toast({
        title: "Favorilerden kaldırıldı",
        description: "GIF favorilerinizden kaldırıldı.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "GIF favorilerden kaldırılamadı. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    }
  });

  const handleShare = async (gif: GifData) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EmotionGIF',
          text: `Bu GIF'i beğendim: ${gif.title}`,
          url: gif.url
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(gif.url);
        toast({
          title: "Bağlantı kopyalandı!",
          description: "GIF bağlantısı panoya kopyalandı.",
        });
      } catch (error) {
        toast({
          title: "Hata",
          description: "Bağlantı kopyalanamadı.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFavorite = (gif: GifData) => {
    if (favorites.has(gif.id)) {
      removeFavoriteMutation.mutate(gif.id);
    } else {
      addFavoriteMutation.mutate(gif);
    }
  };

  const handleDownload = async (gif: GifData) => {
    try {
      const response = await fetch(gif.images.original.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${gif.title || 'gif'}.gif`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "İndirme başlatıldı!",
        description: "GIF indirilmeye başlandı.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "GIF indirilemedi. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    }
  };

  if (isLoading && gifs.length === 0) {
    return (
      <section className="loading-section mb-12">
        <div className="text-center">
          <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-gray-700 font-medium">En iyi GIF'ler aranıyor...</span>
          </div>
        </div>
      </section>
    );
  }

  if (gifs.length === 0) {
    return (
      <section className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Henüz arama yapılmadı</h3>
        <p className="text-gray-600">Bir duygu seçin veya arama yapın!</p>
      </section>
    );
  }

  return (
    <section className="gif-results-section">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">
          {selectedEmotion ? `${selectedEmotion} GIF'leri` : 'GIF Sonuçları'}
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className="rounded-xl"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
            className="rounded-xl"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {gifs.map((gif) => (
          <Card key={gif.id} className="gif-card group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in">
            <div className="aspect-square relative overflow-hidden">
              <img
                src={gif.images.fixed_height.url}
                alt={gif.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex space-x-4">
                  <Button
                    size="icon"
                    onClick={() => handleShare(gif)}
                    className="p-3 bg-white rounded-full hover:scale-110 transition-transform"
                    variant="ghost"
                  >
                    <Share className="h-4 w-4 text-purple-600" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={() => handleFavorite(gif)}
                    className="p-3 bg-white rounded-full hover:scale-110 transition-transform"
                    variant="ghost"
                    disabled={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
                  >
                    <Heart className={`h-4 w-4 ${favorites.has(gif.id) ? 'text-red-600 fill-current' : 'text-pink-600'}`} />
                  </Button>
                  <Button
                    size="icon"
                    onClick={() => handleDownload(gif)}
                    className="p-3 bg-white rounded-full hover:scale-110 transition-transform"
                    variant="ghost"
                  >
                    <Download className="h-4 w-4 text-blue-600" />
                  </Button>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate flex-1">{gif.title}</span>
                <div className="flex items-center space-x-2 ml-2">
                  <Badge variant="secondary" className="text-xs">GIPHY</Badge>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Yükleniyor...
              </>
            ) : (
              <>
                <span className="mr-2">+</span>
                Daha Fazla GIF Yükle
              </>
            )}
          </Button>
        </div>
      )}
    </section>
  );
}
