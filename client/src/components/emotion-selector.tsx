import { predefinedEmotions } from "@/lib/emotion-mapping";
import { Button } from "@/components/ui/button";

interface EmotionSelectorProps {
  onEmotionSelect: (emotion: string, keywords: string) => void;
  selectedEmotion: string | null;
  isLoading: boolean;
}

export default function EmotionSelector({ onEmotionSelect, selectedEmotion, isLoading }: EmotionSelectorProps) {
  const handleEmotionClick = (emotion: typeof predefinedEmotions[0]) => {
    onEmotionSelect(emotion.id, emotion.keywords);
  };

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Quick Emotion Selection</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {predefinedEmotions.map((emotion) => (
          <Button
            key={emotion.id}
            onClick={() => handleEmotionClick(emotion)}
            disabled={isLoading}
            className={`
              emotion-card group relative overflow-hidden bg-gradient-to-br ${emotion.gradient} 
              rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 
              border-3 border-transparent hover:border-white/50 h-auto min-h-[120px]
              ${selectedEmotion === emotion.id ? 'ring-4 ring-white ring-opacity-50 scale-105' : ''}
            `}
            variant="ghost"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{emotion.emoji}</div>
              <span className="text-white font-semibold text-sm">{emotion.label}</span>
            </div>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
        ))}
      </div>
    </section>
  );
}
