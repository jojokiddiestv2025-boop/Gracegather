import { PrayerRequest } from '../types';

const STORAGE_KEY = 'gracegather_prayers';

export const PrayerService = {
  getRequests: (): PrayerRequest[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    const prayers = data ? JSON.parse(data) : [];
    // Sort by timestamp descending (newest first)
    return prayers.sort((a: PrayerRequest, b: PrayerRequest) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },

  addRequest: (author: string, content: string, isAnonymous: boolean): PrayerRequest => {
    const prayers = PrayerService.getRequests();
    const newPrayer: PrayerRequest = {
      id: Date.now().toString(),
      author: isAnonymous ? 'Anonymous' : author,
      content,
      timestamp: new Date().toISOString(),
      prayerCount: 0,
      isAnonymous
    };
    prayers.unshift(newPrayer); // Add to top
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prayers));
    return newPrayer;
  },

  incrementPrayerCount: (id: string): void => {
    const prayers = PrayerService.getRequests();
    const index = prayers.findIndex(p => p.id === id);
    if (index !== -1) {
      prayers[index].prayerCount += 1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prayers));
    }
  },

  deleteRequest: (id: string): void => {
      const prayers = PrayerService.getRequests().filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prayers));
  }
};