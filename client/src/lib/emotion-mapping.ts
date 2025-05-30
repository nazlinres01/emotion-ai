export const emotionMapping: Record<string, string> = {
  // Turkish to English emotion mapping for GIPHY API
  'mutlu': 'happy excited joy celebration',
  'üzgün': 'sad crying disappointed upset',
  'kızgın': 'angry mad frustrated rage',
  'heyecanlı': 'excited thrilled enthusiastic pumped',
  'sakin': 'calm peaceful relaxed zen',
  'şaşkın': 'surprised shocked amazed wow',
  'yorgun': 'tired exhausted sleepy yawn',
  'gülmek': 'laughing funny humor giggle',
  'dans': 'dancing party celebration dance',
  'aşık': 'love heart romantic kiss',
  'korkmuş': 'scared afraid frightened horror',
  'şanslı': 'lucky win success victory',
  'hayal kırıklığı': 'disappointed fail sad upset',
  'gurur': 'proud success achievement win',
  'utangaç': 'shy embarrassed blush awkward',
  'meraklı': 'curious wondering thinking question',
  'rahatsız': 'annoyed irritated bothered upset',
  'memnun': 'satisfied pleased content happy',
  'endişeli': 'worried anxious nervous stress',
  'şakacı': 'funny joke humor playful'
};

export function mapEmotionToKeywords(emotion: string): string {
  const lowerEmotion = emotion.toLowerCase().trim();
  
  // Direct mapping
  if (emotionMapping[lowerEmotion]) {
    return emotionMapping[lowerEmotion];
  }
  
  // Partial matching for complex phrases
  for (const [key, value] of Object.entries(emotionMapping)) {
    if (lowerEmotion.includes(key) || key.includes(lowerEmotion)) {
      return value;
    }
  }
  
  // Fallback to original if no mapping found
  return emotion;
}

export const predefinedEmotions = [
  {
    id: 'happy',
    emoji: '😊',
    label: 'Happy',
    keywords: 'happy excited joy celebration',
    gradient: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'sad',
    emoji: '😢',
    label: 'Sad',
    keywords: 'sad crying disappointed',
    gradient: 'from-blue-400 to-indigo-600'
  },
  {
    id: 'excited',
    emoji: '🤩',
    label: 'Excited',
    keywords: 'excited thrilled enthusiastic',
    gradient: 'from-pink-400 to-purple-600'
  },
  {
    id: 'angry',
    emoji: '😠',
    label: 'Angry',
    keywords: 'angry mad frustrated',
    gradient: 'from-red-400 to-orange-600'
  },
  {
    id: 'calm',
    emoji: '😌',
    label: 'Calm',
    keywords: 'calm peaceful relaxed',
    gradient: 'from-green-400 to-teal-600'
  },
  {
    id: 'surprised',
    emoji: '😲',
    label: 'Surprised',
    keywords: 'surprised shocked amazed',
    gradient: 'from-yellow-300 to-amber-500'
  }
];
