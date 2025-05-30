import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSearchSchema, insertFavoriteSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // GIPHY API integration
  app.get("/api/gifs/search", async (req, res) => {
    try {
      const { q, emotion, limit = 20, offset = 0 } = req.query;
      
      if (!q && !emotion) {
        return res.status(400).json({ message: "Query or emotion parameter is required" });
      }

      const searchTerm = q || emotion;
      const apiKey = process.env.GIPHY_API_KEY || "GlVGYHkr3WSBnllca54iNt0yFbjz7L65";
      
      const giphyUrl = new URL("https://api.giphy.com/v1/gifs/search");
      giphyUrl.searchParams.set("api_key", apiKey);
      giphyUrl.searchParams.set("q", searchTerm as string);
      giphyUrl.searchParams.set("limit", limit as string);
      giphyUrl.searchParams.set("offset", offset as string);
      giphyUrl.searchParams.set("rating", "g");
      giphyUrl.searchParams.set("lang", "en");

      console.log("Searching for:", searchTerm, "with API key:", apiKey.substring(0, 10) + "...");

      const response = await fetch(giphyUrl.toString());
      
      if (!response.ok) {
        console.error(`GIPHY API error: ${response.status} - ${response.statusText}`);
        throw new Error(`GIPHY API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Store the search
      if (q || emotion) {
        await storage.createSearch({
          query: q as string || "",
          emotion: emotion as string || "",
          userId: undefined // For now, no user authentication
        });
      }

      res.json(data);
    } catch (error) {
      console.error("Error fetching GIFs:", error);
      res.status(500).json({ 
        message: "Could not fetch GIFs. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get trending GIFs
  app.get("/api/gifs/trending", async (req, res) => {
    try {
      const { limit = 20, offset = 0 } = req.query;
      const apiKey = process.env.GIPHY_API_KEY || process.env.VITE_GIPHY_API_KEY || "GlVGYHkr3WSBnllca54iNt0yFbjz7L65";
      
      const giphyUrl = new URL("https://api.giphy.com/v1/gifs/trending");
      giphyUrl.searchParams.set("api_key", apiKey);
      giphyUrl.searchParams.set("limit", limit as string);
      giphyUrl.searchParams.set("offset", offset as string);
      giphyUrl.searchParams.set("rating", "g");

      const response = await fetch(giphyUrl.toString());
      
      if (!response.ok) {
        throw new Error(`GIPHY API error: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching trending GIFs:", error);
      res.status(500).json({ 
        message: "Popüler GIF'ler alınamadı. Lütfen tekrar deneyin.",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Recent searches
  app.get("/api/searches/recent", async (req, res) => {
    try {
      const searches = await storage.getRecentSearches();
      res.json(searches);
    } catch (error) {
      console.error("Error fetching recent searches:", error);
      res.status(500).json({ message: "Son aramalar alınamadı." });
    }
  });

  // Add to favorites
  app.post("/api/favorites", async (req, res) => {
    try {
      const validatedData = insertFavoriteSchema.parse(req.body);
      const favorite = await storage.createFavorite(validatedData);
      res.json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Favori eklenemedi." });
    }
  });

  // Get favorites
  app.get("/api/favorites", async (req, res) => {
    try {
      const favorites = await storage.getFavorites();
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Favoriler alınamadı." });
    }
  });

  // Remove from favorites
  app.delete("/api/favorites/:gifId", async (req, res) => {
    try {
      const { gifId } = req.params;
      const removed = await storage.removeFavorite(gifId);
      
      if (removed) {
        res.json({ message: "Favorilerden kaldırıldı." });
      } else {
        res.status(404).json({ message: "Favori bulunamadı." });
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Favori kaldırılamadı." });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
