import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Heart } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FavoriteGif {
  id: number;
  gifId: string;
  gifUrl: string;
  title: string | null;
  userId: number | null;
  createdAt: Date | null;
}

export default function Favorites() {
  const { data: favorites = [], isLoading } = useQuery<FavoriteGif[]>({
    queryKey: ['/api/favorites'],
  });

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
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Favorites</h1>
              <p className="text-gray-600">Your saved GIFs collection</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              <span className="text-gray-700 font-medium">Loading your favorites...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && favorites.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💜</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">Start exploring and save your favorite GIFs!</p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300">
                Discover GIFs
              </Button>
            </Link>
          </div>
        )}

        {/* Favorites Grid */}
        {!isLoading && favorites.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                {favorites.length} saved GIF{favorites.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => (
                <Card key={favorite.id} className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={favorite.gifUrl}
                      alt={favorite.title || 'Favorite GIF'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center">
                        <Heart className="h-8 w-8 text-red-500 fill-current mx-auto mb-2" />
                        <p className="text-white text-sm">Saved to favorites</p>
                      </div>
                    </div>
                  </div>
                  {favorite.title && (
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 truncate">{favorite.title}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}