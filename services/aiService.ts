/**
 * Shared AI service with optimizations for better performance
 * - Singleton pattern to reuse client instance
 * - Optional caching for repeated requests
 * - Optimized generation config for faster responses
 */

import { GoogleGenAI } from "@google/genai";

class AIService {
  private static instance: AIService;
  private client: GoogleGenAI;
  private cache: Map<string, { response: string; timestamp: number }>;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.client = new GoogleGenAI({ apiKey: process.env.API_KEY });
    this.cache = new Map();
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Get the shared GoogleGenAI client
   */
  public getClient(): GoogleGenAI {
    return this.client;
  }

  /**
   * Generate content with optional caching
   * @param model - The model to use
   * @param prompt - The prompt text
   * @param useCache - Whether to cache and use cached responses
   * @param temperature - Lower values for faster, more consistent responses (default: 0.7)
   */
  public async generateContent(
    model: string,
    prompt: string,
    options?: {
      useCache?: boolean;
      temperature?: number;
      maxOutputTokens?: number;
    }
  ): Promise<string> {
    const { useCache = false, temperature = 0.7, maxOutputTokens } = options || {};

    // Check cache if enabled
    if (useCache) {
      const cached = this.getFromCache(prompt);
      if (cached) {
        return cached;
      }
    }

    // Optimized generation config for speed
    const config: any = {
      temperature, // Lower = faster and more consistent
    };
    
    if (maxOutputTokens) {
      config.maxOutputTokens = maxOutputTokens;
    }

    const response = await this.client.models.generateContent({
      model,
      contents: prompt,
      config,
    });

    const text = response.text;

    // Cache if enabled
    if (useCache) {
      this.setCache(prompt, text);
    }

    return text;
  }

  /**
   * Generate content with streaming for better perceived performance
   */
  public async *generateContentStream(
    model: string,
    prompt: string,
    options?: {
      temperature?: number;
      maxOutputTokens?: number;
    }
  ): AsyncGenerator<string, void, unknown> {
    const { temperature = 0.7, maxOutputTokens } = options || {};

    const config: any = {
      temperature,
    };
    
    if (maxOutputTokens) {
      config.maxOutputTokens = maxOutputTokens;
    }

    const responseStream = await this.client.models.generateContentStream({
      model,
      contents: prompt,
      config,
    });

    for await (const chunk of responseStream) {
      yield chunk.text;
    }
  }

  /**
   * Get cached response if available and not expired
   */
  private getFromCache(key: string): string | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.response;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  /**
   * Store response in cache
   */
  private setCache(key: string, response: string): void {
    this.cache.set(key, {
      response,
      timestamp: Date.now(),
    });

    // Clean up old cache entries
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
  }

  /**
   * Clear the cache
   */
  public clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const aiService = AIService.getInstance();

// Export default models for consistency
export const AI_MODELS = {
  FLASH: 'gemini-1.5-flash',
  FLASH_8B: 'gemini-1.5-flash-8b',
} as const;

// Export common configurations
export const AI_CONFIG = {
  // Faster responses with lower temperature
  FAST: { temperature: 0.5, maxOutputTokens: 512 },
  // Balanced
  BALANCED: { temperature: 0.7, maxOutputTokens: 1024 },
  // More creative but slower
  CREATIVE: { temperature: 0.9, maxOutputTokens: 2048 },
} as const;
