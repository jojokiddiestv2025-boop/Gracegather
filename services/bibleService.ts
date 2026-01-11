import { BibleChapter, BibleVerse } from '../types';

const API_BASE = 'https://bible-api.com';
const CACHE_PREFIX = 'gracegather_bible_cache_';

export const BibleService = {
  
  /**
   * Fetches a bible chapter.
   * Strategy:
   * 1. Check LocalStorage (Offline Cache).
   * 2. If missing, fetch from bible-api.com (Non-AI Public DB).
   * 3. Save to cache.
   */
  getChapter: async (book: string, chapter: number, translation: string = 'kjv'): Promise<BibleChapter | null> => {
    const cacheKey = `${CACHE_PREFIX}${translation}_${book}_${chapter}`.replace(/\s+/g, '').toLowerCase();
    
    // 1. Try Cache
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        console.log(`Loaded ${book} ${chapter} from cache.`);
        return JSON.parse(cached);
      }
    } catch (e) {
      console.warn('Cache lookup failed', e);
    }

    // 2. Fetch from API
    try {
      // API expects format: "John 3:1-100" or just "John 3"
      // URL encode the book name (e.g. "1 Samuel")
      const query = `${book} ${chapter}`;
      const response = await fetch(`${API_BASE}/${encodeURIComponent(query)}?translation=${translation.toLowerCase()}`);
      
      if (!response.ok) {
        throw new Error('Chapter not found');
      }

      const data = await response.json();
      
      // Transform API response to our app's format
      const verses: BibleVerse[] = data.verses.map((v: any) => ({
        number: v.verse,
        text: v.text.replace(/\n/g, ' ').trim()
      }));

      const bibleChapter: BibleChapter = {
        book: data.reference.replace(/\s\d+.*$/, ''), // Extract Name "John" from "John 3"
        chapter: chapter,
        summary: `The book of ${book}, chapter ${chapter}.`, // Simple static summary since API doesn't provide one
        verses: verses
      };

      // 3. Save to Cache
      try {
        localStorage.setItem(cacheKey, JSON.stringify(bibleChapter));
      } catch (e) {
        // storage might be full, ignore
      }

      return bibleChapter;

    } catch (error) {
      console.error('Bible fetch error:', error);
      return null;
    }
  },

  /**
   * Clear bible cache if it gets too large or corrupted
   */
  clearCache: () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
};