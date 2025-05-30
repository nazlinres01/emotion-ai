import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SearchSectionProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const suggestionTags = ['happy', 'excited', 'angry', 'surprised', 'calm', 'sad'];

export default function SearchSection({ onSearch, isLoading }: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    onSearch(tag);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="mb-12">
      <div className="relative max-w-2xl mx-auto">
        <div className="relative">
          <Input
            type="text"
            placeholder="Describe your emotion... (e.g: I'm so happy, excited, angry)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300"
            disabled={isLoading}
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading || !searchQuery.trim()}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold border-2 border-white/20"
          >
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 justify-center">
          {suggestionTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="px-3 py-1 bg-white/60 text-purple-700 rounded-full text-sm cursor-pointer hover:bg-purple-100 transition-colors"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
