import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import SearchSection from "@/components/search-section";
import EmotionSelector from "@/components/emotion-selector";
import GifGrid from "@/components/gif-grid";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { mapEmotionToKeywords } from "@/lib/emotion-mapping";

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

interface GiphyResponse {
  data: GifData[];
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
}

interface SearchData {
  id: number;
  query: string;
  emotion: string | null;
  userId: number | null;
  createdAt: Date | null;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [allGifs, setAllGifs] = useState<GifData[]>([]);

  const { data: gifsData, isLoading: isLoadingGifs, refetch } = useQuery<GiphyResponse>({
    queryKey: ['/api/gifs/search', searchQuery, offset],
    enabled: !!searchQuery,
  });

  const { data: recentSearches } = useQuery<SearchData[]>({
    queryKey: ['/api/searches/recent'],
  });

  const { data: trendingGifs, isLoading: isLoadingTrending } = useQuery<GiphyResponse>({
    queryKey: ['/api/gifs/trending'],
    enabled: !searchQuery,
  });

  const handleSearch = useCallback((query: string) => {
    const mappedQuery = mapEmotionToKeywords(query);
    setSearchQuery(mappedQuery);
    setSelectedEmotion(query);
    setOffset(0);
    setAllGifs([]);
  }, []);

  const handleEmotionSelect = useCallback((emotion: string, keywords: string) => {
    setSearchQuery(keywords);
    setSelectedEmotion(emotion);
    setOffset(0);
    setAllGifs([]);
  }, []);

  const handleLoadMore = useCallback(() => {
    const newOffset = offset + 20;
    setOffset(newOffset);
    // This will trigger a new query with the updated offset
    refetch();
  }, [offset, refetch]);

  const handleRecentSearchClick = useCallback((search: string) => {
    handleSearch(search);
  }, [handleSearch]);

  // Update allGifs when new data comes in
  React.useEffect(() => {
    if (gifsData?.data) {
      if (offset === 0) {
        setAllGifs(gifsData.data);
      } else {
        setAllGifs(prev => [...prev, ...gifsData.data]);
      }
    }
  }, [gifsData, offset]);

  const displayGifs = searchQuery ? allGifs : (trendingGifs?.data || []);
  const isLoading = searchQuery ? isLoadingGifs : isLoadingTrending;
  const hasMore = gifsData?.pagination ? gifsData.pagination.total_count > allGifs.length : false;

  return (
    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 min-h-screen font-inter">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Choose Your Emotion, <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Find Your GIF</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Select or describe how you're feeling, and we'll find the perfect GIF for you! 
            The most fun way to express your emotions is here.
          </p>
        </section>

        <SearchSection onSearch={handleSearch} isLoading={isLoading} />
        
        <EmotionSelector 
          onEmotionSelect={handleEmotionSelect} 
          selectedEmotion={selectedEmotion}
          isLoading={isLoading}
        />

        <GifGrid 
          gifs={displayGifs}
          selectedEmotion={selectedEmotion}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
        />

        {/* Recent Searches */}
        {recentSearches && recentSearches.length > 0 && (
          <section className="mt-16 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Searches</h3>
            <div className="flex flex-wrap gap-3">
              {recentSearches.slice(0, 8).map((search) => (
                <Badge
                  key={search.id}
                  variant="secondary"
                  className="px-4 py-2 bg-white/80 text-gray-700 rounded-xl hover:bg-purple-100 transition-colors text-sm border border-gray-200 cursor-pointer"
                  onClick={() => handleRecentSearchClick(search.query || search.emotion || '')}
                >
                  {search.query || search.emotion}
                </Badge>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
