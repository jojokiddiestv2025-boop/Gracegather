import { CloudSettings } from '../types';

const SETTINGS_KEY = 'gracegather_cloud_settings';

export const StorageService = {
  getCloudSettings: (): CloudSettings | null => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  saveCloudSettings: (settings: CloudSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  /**
   * Generic load method that tries cloud first if enabled, then falls back to local.
   */
  load: async <T>(key: string, defaultValue: T): Promise<T> => {
    const settings = StorageService.getCloudSettings();
    const localData = localStorage.getItem(key);
    let data = localData ? JSON.parse(localData) : defaultValue;

    if (settings?.enabled && settings.apiKey && settings.binId) {
      try {
        // NOTE: In a real JSONBin setup, you might have different bins for different collections.
        // For this simple demo, we will assume the Bin holds a master object with keys for each service
        // OR we just use one Bin per app instance and store a big JSON object.
        // To keep it simple for the "Video Gallery" requirement:
        // We will fetch the whole bin, and return the specific key property.
        
        const response = await fetch(`https://api.jsonbin.io/v3/b/${settings.binId}/latest`, {
          headers: {
            'X-Master-Key': settings.apiKey
          }
        });

        if (response.ok) {
          const json = await response.json();
          // json.record contains the actual data
          const remoteData = json.record[key];
          if (remoteData) {
            // Update local cache
            localStorage.setItem(key, JSON.stringify(remoteData));
            data = remoteData;
          }
        }
      } catch (e) {
        console.warn('Cloud load failed, using local data', e);
      }
    }
    
    return data;
  },

  /**
   * Generic save method that updates local and pushes to cloud if enabled.
   */
  save: async <T>(key: string, data: T): Promise<void> => {
    // 1. Save Local
    localStorage.setItem(key, JSON.stringify(data));

    // 2. Save Cloud
    const settings = StorageService.getCloudSettings();
    if (settings?.enabled && settings.apiKey && settings.binId) {
      try {
        // Fetch current bin data first to merge (simple optimistic locking not implemented)
        const response = await fetch(`https://api.jsonbin.io/v3/b/${settings.binId}/latest`, {
            headers: { 'X-Master-Key': settings.apiKey }
        });
        
        let fullStore: any = {};
        if (response.ok) {
            const json = await response.json();
            fullStore = json.record || {};
        }

        // Update specific key
        fullStore[key] = data;

        // PUT back
        await fetch(`https://api.jsonbin.io/v3/b/${settings.binId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': settings.apiKey
          },
          body: JSON.stringify(fullStore)
        });
      } catch (e) {
        console.error('Cloud save failed', e);
      }
    }
  }
};