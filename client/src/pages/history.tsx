import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, History, Search } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SearchHistory {
  id: number;
  query: string;
  emotion: string | null;
  userId: number | null;
  createdAt: Date | null;
}

export default function HistoryPage() {
  const { data: searches = [], isLoading } = useQuery<SearchHistory[]>({
    queryKey: ['/api/searches/recent'],
  });

  const handleSearchClick = (searchTerm: string) => {
    // Navigate to home with search
    window.location.href = `/?search=${encodeURIComponent(searchTerm)}`;
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 min-h-screen font-inter">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-4 rounded-xl hover:bg-white/50">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <History className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Search History</h1>
              <p className="text-gray-600">Your recent searches and emotions</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              <span className="text-gray-700 font-medium">Loading search history...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && searches.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No search history</h3>
            <p className="text-gray-600 mb-6">Start searching for emotions and GIFs to build your history!</p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300">
                Start Searching
              </Button>
            </Link>
          </div>
        )}

        {/* Search History */}
        {!isLoading && searches.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                {searches.length} recent search{searches.length !== 1 ? 'es' : ''}
              </p>
            </div>
            
            <div className="space-y-4">
              {searches.map((search) => (
                <div
                  key={search.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                  onClick={() => handleSearchClick(search.query || search.emotion || '')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Search className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          {search.query && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              Search: {search.query}
                            </Badge>
                          )}
                          {search.emotion && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                              Emotion: {search.emotion}
                            </Badge>
                          )}
                        </div>
                        {search.createdAt && (
                          <p className="text-sm text-gray-500">
                            {new Date(search.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-xl hover:bg-gray-100">
                      Search Again
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}