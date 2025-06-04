# EmotionGIF

An emotion-driven GIF recommendation app that helps users find the perfect animated content based on their current mood.


![Resim7](https://github.com/user-attachments/assets/9f132dd8-98e3-4b89-aa47-ec6e7e7fb53d)


## Features

- **Emotion Selection**: Choose from predefined emotions (happy, sad, excited, calm, etc.)
- **Custom Search**: Enter any text to find relevant GIFs
- **Favorites**: Save your favorite GIFs for later
- **Search History**: Track your previous searches and emotions
- **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Backend**: Express.js + Node.js
- **API**: GIPHY API integration

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the displayed URL

## How It Works

1. Select an emotion button or type your own search term
2. Browse through curated GIF recommendations
3. Save favorites by clicking the heart icon
4. View your search history and saved GIFs anytime

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types and schemas
└── components.json  # Shadcn/ui configuration
```

## License

MIT License
