import { users, searches, favorites, type User, type InsertUser, type Search, type InsertSearch, type Favorite, type InsertFavorite } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createSearch(search: InsertSearch): Promise<Search>;
  getRecentSearches(userId?: number): Promise<Search[]>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  getFavorites(userId?: number): Promise<Favorite[]>;
  removeFavorite(gifId: string, userId?: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private searches: Map<number, Search>;
  private favorites: Map<number, Favorite>;
  private currentUserId: number;
  private currentSearchId: number;
  private currentFavoriteId: number;

  constructor() {
    this.users = new Map();
    this.searches = new Map();
    this.favorites = new Map();
    this.currentUserId = 1;
    this.currentSearchId = 1;
    this.currentFavoriteId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSearch(insertSearch: InsertSearch): Promise<Search> {
    const id = this.currentSearchId++;
    const search: Search = { 
      id, 
      query: insertSearch.query,
      emotion: insertSearch.emotion || null,
      userId: insertSearch.userId || null,
      createdAt: new Date() 
    };
    this.searches.set(id, search);
    return search;
  }

  async getRecentSearches(userId?: number): Promise<Search[]> {
    const allSearches = Array.from(this.searches.values());
    const filtered = userId 
      ? allSearches.filter(search => search.userId === userId)
      : allSearches;
    
    return filtered
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, 10);
  }

  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = this.currentFavoriteId++;
    const favorite: Favorite = { 
      id, 
      gifId: insertFavorite.gifId,
      gifUrl: insertFavorite.gifUrl,
      title: insertFavorite.title || null,
      userId: insertFavorite.userId || null,
      createdAt: new Date() 
    };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async getFavorites(userId?: number): Promise<Favorite[]> {
    const allFavorites = Array.from(this.favorites.values());
    const filtered = userId 
      ? allFavorites.filter(favorite => favorite.userId === userId)
      : allFavorites;
    
    return filtered.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async removeFavorite(gifId: string, userId?: number): Promise<boolean> {
    const favoriteToRemove = Array.from(this.favorites.values()).find(
      favorite => favorite.gifId === gifId && (userId ? favorite.userId === userId : true)
    );
    
    if (favoriteToRemove) {
      this.favorites.delete(favoriteToRemove.id);
      return true;
    }
    return false;
  }
}

export const storage = new MemStorage();
