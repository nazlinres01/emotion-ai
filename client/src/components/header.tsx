import { Heart, History } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <span className="text-white text-lg">😊</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              EmotionGIF
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="rounded-xl bg-gray-100 hover:bg-gray-200">
              <History className="h-4 w-4 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl bg-gray-100 hover:bg-gray-200">
              <Heart className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
